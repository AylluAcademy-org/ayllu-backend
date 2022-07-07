const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.getAllUsers = async (event, context, callback) => {
  try {
    const users = await prisma.Users.findMany({
      include: { profile: true }
    })
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users)
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  }
}
