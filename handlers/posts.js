require("dotenv").config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.handler = async (event, context, callback) => {
  try {
    const posts = await prisma.Posts.findMany({
      include: { author: true }
    })
    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
        "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
        "Access-Control-Allow-Methods": (process.env.METHODS).toString()
      },
      body: JSON.stringify(posts)
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
