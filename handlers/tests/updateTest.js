const { Prisma, PrismaClient, prisma } = require('@prisma/client')
const prisma = new PrismaClient()

exports.handler = async (event, context, callback) => {

  try {
    const data = JSON.parse(event.body)

    const updatedTest = await prisma.Tests.update({ 
      where:{
          test_id: data.test_id
      },
      data: {
        test_id: data.test_id,
        description: data.description,
        moduleId: data.moduleId,
        status: data.status
      } 
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTest)
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientRequestError) {
      if (e.code === 'P2002') {
        return {
          statusCode: 409,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'A question with this description already exists'
          })
        }
      }
    }

    console.error(e)
    return {
      statusCode: 500
    }
  }

}
  