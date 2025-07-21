require("dotenv").config()
const { Prisma, PrismaClient } = require('@prisma/client')

exports.handler = async (event, context, callback) => {
    const prisma = new PrismaClient()

    try {
      const data = JSON.parse(event.body)
      const updatedResource = await prisma.Resources.update({ 
        where:{
            resource_id: data.resource_id
        },
        data: {
          name: data.name,
          description: data.description,
          status: data.status,
          url: data.url,
          lessonId: data.LessonId
        },
        // select: {
        //     resource_id: true,
        //     name: true,
        //     description: true,
        //     status: true,
        //     url: true,
        //     lessonId: true,
        //   },  
      })
  
      return {
        statusCode: 200,
        headers: { 
          "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
          "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
          "Access-Control-Allow-Methods": (process.env.METHODS).toString()
        },
        body: JSON.stringify(updatedResource)
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
              error: 'This resource already exists'
            })
          }
        }
      }
  
      console.error(e)
      return {
        statusCode: 500}
    }
  }