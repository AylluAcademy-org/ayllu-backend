require("dotenv").config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.getModuleById= async (event, context, callback) => {
  const data = JSON.parse(event.body)
  const module = await prisma.Modules.findUnique({    
        where:{
            module_id:data.module_id,
        } ,   
        include:{
          lessons:
          {
            select:{
              lesson_id: true,
              name: true,
            }
          },
        }          
      })
  return {
    statusCode: 200,
    headers: { 
      "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
      "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
      "Access-Control-Allow-Methods": (process.env.METHODS).toString()
    },
    body: JSON.stringify(module)
  } 
}

module.exports.getModuleByCourse= async (event, context, callback) => {
  const data = JSON.parse(event.body)

  const modules = await prisma.Modules.findMany({    
    where:{
        courseId: data.courseId,
    }, 
    include:{
      lessons:
      {
        select:{
          lesson_id: true,
          name: true,
        }
      },
    }            
  })

  return {
    statusCode: 200,
    headers: { 
      "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
      "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
      "Access-Control-Allow-Methods": (process.env.METHODS).toString()
    },
    body: JSON.stringify(modules)
  } 
}
