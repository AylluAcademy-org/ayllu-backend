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
            }
        })

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userTestAnswers)
        }

    } catch (error) {
        console.error(error)
        
        return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
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

        //We check that there are questions for the current test, and that we got the record of the current module test.
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(moduleEnded)
        }

    }catch (error) {
        console.error(error)
        
        return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error)
        }
    }finally {
        await prisma.$disconnect()
    }

}