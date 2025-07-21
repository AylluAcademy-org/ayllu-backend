require("dotenv").config()
const { PrismaClient, prisma } = require('@prisma/client')

exports.handler = async(event, context) => {
    const prisma = new PrismaClient()
    const data = event.queryStringParameters && event.queryStringParameters.module_id

    let moduleId = parseInt(data)

    try {
        const deletedModule = await prisma.modules.delete({
            where: {
                module_id: moduleId,
                status: true
            }
        })

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(deletedModule) 
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
    }finally{
        await prisma.$disconnect()
    }

}