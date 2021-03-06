require("dotenv").config()
const { Prisma, PrismaClient } = require('@prisma/client')
  
exports.handler = async (event, context, callback) => {
    const prisma = new PrismaClient() 
    const data = JSON.parse(event.body)

    try {
        
        const createQuestion = await prisma.questions.create({ data })
        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(createQuestion)
          }

    } catch (error) {
        console.log(error)

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