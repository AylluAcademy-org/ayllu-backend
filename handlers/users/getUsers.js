require("dotenv").config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.getAllUsers = async (event, context, callback) => {
  try {

    const users = await prisma.users.findMany({
      where: {
        status: true
      },
      select: {
        user_id: true,
        name: true,
        email: true,
        wallet: true,
        image: true,
        totalRewards: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            profile: {
              select: {
                name: true
              }
            }
          }
        },
        courses: {
          select: {
            name: true,
            description: true
          }
        },
        enroll: {
          select: {
            course: {
              select: {
                name: true,
                description: true
              }
            },
            progress: true,
            ended: true
          }
        },
        posts: true
      },
      orderBy: {
        user_id: 'asc'
      }
    })
    
    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
        "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
        "Access-Control-Allow-Methods": (process.env.METHODS).toString()
      },
      body: JSON.stringify(users)
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

module.exports.getUserById = async (event, context, callback) => {
  const data = event.queryStringParameters && event.queryStringParameters.user_id

  let userId = parseInt(data)

  //Get user by Id
  const user = await prisma.Users.findUnique({
    where: {
      user_id: userId
    }
  })
  
  return {
    statusCode: 200,
    headers: { 
      "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
      "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
      "Access-Control-Allow-Methods": (process.env.METHODS).toString()
    },
    body: JSON.stringify(user)
  }
}
