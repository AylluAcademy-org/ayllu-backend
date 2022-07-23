require("dotenv").config()
const {
    Prisma,
    PrismaClient
  } = require('@prisma/client')
  const prisma = new PrismaClient()
  
  exports.handler = async (event, context, callback) => {
    const data = JSON.parse(event.body)

    try {
      const createdModule = await prisma.Modules.create({ data })     
  
      return {
        statusCode: 200,
        headers: { 
          "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
          "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
          "Access-Control-Allow-Methods": (process.env.METHODS).toString()
        },
        body: JSON.stringify(createdModule)
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
    }
  }
  