require("dotenv").config()
const {
    Prisma,
    PrismaClient
  } = require('@prisma/client')
  const prisma = new PrismaClient()
  
  exports.handler = async (event, context, callback) => {
    try {

      const data = JSON.parse(event.body)
      const createdLesson = await prisma.Lessons.create({ data })

      const getAllLessons = await prisma.lessons.findMany({
        where: {
          moduleId: data.moduleId
        }
      });

      await prisma.modules.update({
        where: {
          module_id: data.moduleId
        },
        data: {
          class: getAllLessons.length
        }
      })
    
      return {
        statusCode: 200,
        headers: { 
          "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
          "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
          "Access-Control-Allow-Methods": (process.env.METHODS).toString()
        },
        body: JSON.stringify(createdLesson)
      }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientRequestError) {
        if (e.code === 'P2002') {
          return {
            statusCode: 409,
            headers: { 
              "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
              "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
              "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify({
              error: 'A user with this email already exists'
            })
          }
        }
      }
  
      console.error(e)
      return {
        statusCode: 500}
    }
  }
  