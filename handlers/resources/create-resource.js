const { Prisma, PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
  
exports.handler = async (event, context, callback) => {
  try {
    const data = JSON.parse(event.body)
    const createdResource = await prisma.Resources.create({ data })     

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createdResource)
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientRequestError) {
      if (e.code === 'P2002') {
        return {
          statusCode: 409,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: 'El recurso ya existe'
          })
        }
      }
    }

    console.error(e)
    return {
      statusCode: 500}
  }
}
  