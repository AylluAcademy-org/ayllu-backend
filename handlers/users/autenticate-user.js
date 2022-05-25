const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.handler = async (event, context, callback) => {
  try {
    const data = JSON.parse(event.body)
    const user = await prisma.Users.findUnique({
      where: {
        email: data.email,               
      },
      select: {
        user_id: true,
        password: true,
        email: true,
        name: true,
        wallet: true,
        image: true,
      },      
    })
    
    if (user.password==data.password)
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }
    else
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {"Message":"Correo o Contraseña incorrectas",}          
          )
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
