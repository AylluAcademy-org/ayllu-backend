const {
    Prisma,
    PrismaClient
  } = require('@prisma/client')
  const prisma = new PrismaClient()
  
  exports.handler = async (event, context, callback) => {
    const data = JSON.parse(event.body)

    try {
      const createdModule = await prisma.Modules.create({ data })     
  
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdModule)
      } 

    } catch (error) {
      console.log(error)

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        }
    }
  }
  