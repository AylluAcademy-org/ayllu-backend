require("dotenv").config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.handler = async (event, context, callback) => {
  try {
    
    const categories = await prisma.categories.findMany({    
        where:{
            status:true,
        } , 
        select: {
          category_id: true,
          name: true,
          courser: {
            select: {
              course_id: true,
              name: true  
            }
          },
          image: true,
          createdAt: true,
          updatedAt: true        
        },
        orderBy: {
          category_id: 'asc'
        }   
    })


    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
        "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
        "Access-Control-Allow-Methods": (process.env.METHODS).toString()
      },
      body: JSON.stringify(categories)
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
  }
}
