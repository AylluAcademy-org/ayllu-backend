require("dotenv").config()
const { PrismaClient } = require("@prisma/client")

exports.handler = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)

    try {
        const optionCreated = await prisma.options.create({ data })

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(optionCreated)
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