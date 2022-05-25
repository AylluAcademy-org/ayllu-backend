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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resources)
    } 
  }
  