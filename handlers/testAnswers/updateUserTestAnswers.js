require("dotenv").config()
const { PrismaClient } = require("@prisma/client")

exports.handler = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)
    const updatedUserTestAnswers = null
    var len, answers
    
    try {
        //Get the records of the current answers given by the user on a specific test.
        const oldUserTestAnswers = await prisma.testAnswers.findMany({
            where: {
                userOnCourse_id: data.userOnCourse_id,
                test_id: data.test_id
            }
        })
        len = oldUserTestAnswers.length

        data.forEach(e => {
            answers = e
        });

        for(var i =0; i< len; i++){
            updatedUserTestAnswers = await prisma.testAnswers.updateMany({
                where: {
                    testAnwers_id: oldUserTestAnswers[i].testAnwers_id
                },
                data: {
                    userOnCourse_id: data[i].userOnCourse_id,
                    test_id: data[i].test_id,
                    question_id: data[i].question_id,
                    optionSelected: data[i].optionSelected,
                    value: answers[i].value
                }
            })
        }

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(data)
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