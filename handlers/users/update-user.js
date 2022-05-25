const { Prisma, PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
  
exports.handler = async (event, context, callback) => {
  try {
    const data = JSON.parse(event.body)
    const updateUser = await prisma.Users.update({ 
      where:{
          user_id: data.user_id
      },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        wallet: data.wallet,
        totalRewards: data.totalRewards
      },
      select: {
          user_id: true,
          password: true,
          email: true,
          name: true,
          wallet: true,
          image: true,
          totalRewards: true,
          updatedAt: true
        },  
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateUser)
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientRequestError) {
      if (e.code === 'P2002') {
        return {
          statusCode: 409,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'A user with this email already exists'
          })
        }
      }
    }

    console.error(e)
    return {
      statusCode: 500}
  }
}
  