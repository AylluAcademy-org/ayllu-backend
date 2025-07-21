require("dotenv").config()
const { PrismaClient } = require("@prisma/client")

//Handler to get the answers (records from testAnswers table) given by a user in a specific test. 
module.exports.getUserTestAnswers = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)

    try {
        //Get the records of the answers of the test.
        const userTestAnswers = await prisma.testAnswers.findMany({
            where: {
                userOnCourse_id: data.userOnCourse_id,
                test_id: data.test_id
            },
            orderBy: {
                testAnwers_id: 'asc'
            }
        })

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(userTestAnswers)
        }

    } catch (error) {
        console.error(error)
        
        return {
        statusCode: 500,
        headers: { 
            "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
            "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
            "Access-Control-Allow-Methods": (process.env.METHODS).toString()
        },
        body: JSON.stringify(error)
        }
    }finally {
        await prisma.$disconnect()
    }

}

//Handler to calculate the grade obtained on the test through evaluation the quantity of right options selected by the user.
//Then, because making the test means the module was completed, it updates the module which was in progress with the grade obtained and status ended.
module.exports.getTestGrade = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)
    let sum=0, questions, result, moduleEnded

    try {

        //Get the records of the answers given by the user for the current test.
        const optionsSelected = await prisma.testAnswers.findMany({
            where: {
                userOnCourse_id: data.userOnCourse_id,
                test_id: data.test_id
            },
            orderBy: {
                testAnwers_id: 'asc'
            }
        })

        //Get the record of the question of the test.
        const testQuestions = await prisma.questions.findMany({
            where: {
                testId: data.test_id
            },
            include: {
                options: {
                    select: {
                        value: true
                    }
                }
            }
        })
        questions = testQuestions.length

        //We need to get the record of the current test and the id of the module which the test belongs to. 
        const currentModule = await prisma.tests.findUnique({
            where: {
                test_id: data.test_id
            },
            select: {
                moduleId: true
            }
        })

        // //We check that there are questions for the current test, and that we got the record of the current module test.
        if(questions > 0 && currentModule){
            
            //we iterate every record of the option selected for every question. If any value of those records is true, it will add one more number to sum variable.
            optionsSelected.forEach(option => {
                if(option.value){
                    sum++
                }
            })

            //Calculate the grade obtained by dividing the number of the correct answers between the whole quantity of question to get the average.
            result = (sum / questions) * 10

            //We get the record of the module that is currently in progress.
            const moduleToUpdate = await prisma.modulesOnCourse.findFirst({
                where: {
                    userOnCourse_id: data.userOnCourse_id,
                    module_id: currentModule.moduleId,
                    isEnded: false
                }
            })

            //If there's any module that the user has in progress, it proceeds to update that module to ended and adding the grade obtained.  
            if(moduleToUpdate){
                moduleEnded = await prisma.modulesOnCourse.update({
                    where: {
                        useronmodule_id: moduleToUpdate.useronmodule_id
                    },
                    data: {
                        isEnded: true,
                        grade: result
                    },
                    select: {
                        isEnded: true,
                        grade: true,
                    }
                })
            }else {
                moduleEnded = {"Error": "No hay modulo que calificar, ya ha sido completado probablemente."}
            }

        }


        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(moduleEnded)
        }

    }catch (error) {
        console.error(error)
        
        return {
        statusCode: 500,
        headers: { 
            "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
            "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
            "Access-Control-Allow-Methods": (process.env.METHODS).toString()
        },
        body: JSON.stringify(error)
        }
    }finally {
        await prisma.$disconnect()
    }

}

//Handler to get student answers of a test, and review which of them are correct and wrong. 
module.exports.getTestReviewed = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body);
    var testReviewed = []
  
    try {        
        
        // check if there's any record of the answers for the current test done by the user
        const isUserTestAnswer = await prisma.testAnswers.findFirst({
            where: {
                userOnCourse_id: data.userOnCourse_id,
                test_id: data.test_id
            },
            orderBy: {
                testAnwers_id: 'asc'
            }
        })

        //To get the test developed by the student
        const testDone = await prisma.tests.findUnique({
            where: {
                test_id: data.test_id
            },
            select: {
                description: true,
                questions: {
                    select: {
                        text: true,
                        order: true,
                        options: {
                            where: {
                                value: true
                            },
                            select: {
                                order: true,
                                value: true
                            }
                        }
                    }
                }
            }
        })

        // If there's any record of answers given by the student for a specific test, we proceed to review the test to determine 
        // which answers are correct and which are wrong.
        if(isUserTestAnswer){
            //Get the records of the answers given by the user for the current test.
            const answersGiven = await prisma.testAnswers.findMany({
                where: {
                    userOnCourse_id: data.userOnCourse_id,
                    test_id: data.test_id
                },
                select: {
                    optionSelected: true,
                    value: true
                },
                orderBy: {
                    testAnwers_id: 'asc'
                }
            })

            /** If there are answers given by the student for the current test, we evaluate if the answer selected is the right one,
            /*  if it is right we display a "Respuesta correcta" message, else "Respuesta incorrecta" message.  
            /*  If there's no record of answers we display an Error message  */
            answersGiven ? answersGiven.forEach((e, i) => {
                            //let res = (e.optionSelected === testDone.questions[i].options[0].order) && 
                            //          (e.value === testDone.questions[i].options[0].value) ? 
                            //          {"Respuesta": "Respuesta correcta"} : {"Respuesta": "Respuesta incorrecta"}
                            let res = (e.value === true) ? 
                            {"Respuesta": "Respuesta correcta","isCorrect": true} :
                            {"Respuesta": "Respuesta incorrecta","isCorrect": false}

                            let option = {"OptionSelected" : e.optionSelected}

                            let result = Object.assign(option, res)

                            testReviewed.push(result)
                            
                      }) : {"Error: " : "Respuestas no registradas"}
            
            // We insert to each question the answer selected (option), and the result (if it's correct or wrong)          
            testDone.questions.forEach((e, i) => {
                testDone.questions[i] = Object.assign(e, testReviewed[i])
            })

        }else {
            return {
                statusCode: 200,
                headers: { 
                    "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                    "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                    "Access-Control-Allow-Methods": (process.env.METHODS).toString()
                },
                body: JSON.stringify({"Error: ": "El test aún no ha sido desarrollado por el estudiante."})
            }
        }

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(testDone)
        }

    }catch(error){
        console.error(error)
        
        return {
        statusCode: 500,
        headers: { 
            "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
            "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
            "Access-Control-Allow-Methods": (process.env.METHODS).toString()
        },
        body: JSON.stringify(error)
        }
    }finally {
        await prisma.$disconnect()
    }

}