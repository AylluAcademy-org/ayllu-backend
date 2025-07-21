require("dotenv").config()
const {
    Prisma,
    PrismaClient
  } = require('@prisma/client')
  const prisma = new PrismaClient()
  
  exports.handler = async (event, context, callback) => {
    try {
      const data = JSON.parse(event.body)
      const createdCourse = await prisma.Courses.create({ data })
  
      return {
        statusCode: 200,
        headers: { 
          "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
          "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
          "Access-Control-Allow-Methods": (process.env.METHODS).toString()
        },
        body: JSON.stringify(createdCourse)
      }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return {
            statusCode: 409,
            headers: { 
              "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
              "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
              "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify({
              error: 'Datos duplicados'
            })
          }
        }
      }
  
      console.error(e)
      return { statusCode: 500 ,body: JSON.stringify({
        error: 'Error' + e
      })}
    }
  }
  