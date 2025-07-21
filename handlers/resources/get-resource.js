require("dotenv").config()
const { PrismaClient } = require("@prisma/client")

module.exports.getResourcesByLessonId = async (event, context, callback) => {
    const prisma = new PrismaClient()

    const data = JSON.parse(event.body)
    const resources = await prisma.Resources.findMany({    
          where:{
              lessonId:data.lessonId,
              status:true,
          },                  
        })
    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
        "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
        "Access-Control-Allow-Methods": (process.env.METHODS).toString()
      },
      body: JSON.stringify(resources)
    } 
  }
  