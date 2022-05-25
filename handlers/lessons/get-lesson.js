const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


module.exports.getLessonById= async (event, context, callback) => {
  const data = JSON.parse(event.body)

  const lesson = await prisma.Lessons.findUnique({    
        where:{
            lesson_id:data.lesson_id,
        },
        include:{
          resources:
          {
            select:{
              resource_id: true,
              name: true,
              description: true,
              url: true
            }
          },
        }             
      })
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lesson)
  } 
}

module.exports.getLessonByModule= async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const lessons = await prisma.Lessons.findMany({    
        where:{
            moduleId :data.moduleId,
            status:true,
        },
        include: {
          resources: {  
            select: {
              resource_id: true,
              name: true,
              description: true,
              url: true
            }
          }  
        }           
      })
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lessons)
  } 
}
