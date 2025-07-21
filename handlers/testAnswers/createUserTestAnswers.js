require("dotenv").config()
const { PrismaClient } = require("@prisma/client")

//Handler to register (create the records) the answers given by the user for a specific test. 
exports.handler = async(event) => {
    const prisma = new PrismaClient();
    const data = JSON.parse(event.body);
    var len, userTestAnswers;

    try {
         
        // check if there's any record of the answers for the current test done by the user
        const existUserTestAnswer = await prisma.testAnswers.findFirst({
            where: {
                userOnCourse_id: data[0].userOnCourse_id,
                test_id: data[0].test_id
            }
        })
       

        //If there are records of answers for the current test it just displays an error message
        //Otherwise, many records of the answers are created on the testAnswers table.
        userTestAnswers = !existUserTestAnswer ? await prisma.testAnswers.createMany({ data }) : {"Error:": "Las respuestas de este test ya han sido registradas."};

        //Get all the questions that are part of the test done by the user, along with the options.
        const optionValue = await prisma.questions.findMany({
            where: {
                testId: data[0].test_id,
                status: true,
            },
            include: {
                options: {
                    where: {
                        value: true
                    },
                    select: {
                        value: true,
                        order: true
                    }
                }
            }
        })
        len = optionValue.length
        
        //Get all records of answers given by the user on the test. 
        const testAnswers = await prisma.testAnswers.findMany({
            where: {
                userOnCourse_id: data[0].userOnCourse_id,
                test_id: data[0].test_id
            }
        })

        //Check if the test has any questions registered, then it will loop over the quantity of the questions just to check if the option
        //selected by the user is true. If there's any answer that match with the right option, it will update that record value to true.  
        if(len > 0){
            for(var i = 0; i< len; i++){
                if(testAnswers[i].optionSelected === optionValue[i].options[0].order){
                    if(optionValue[i].options[0].value){
                        await prisma.testAnswers.update({
                            where: {
                                testAnwers_id: testAnswers[i].testAnwers_id
                            },
                            data: {
                                value: true
                            },
                            select: {
                                value: true
                            }
                        })
                    }
                }
            }
        }

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
