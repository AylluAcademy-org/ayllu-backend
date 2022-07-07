const { Prisma, PrismaClient, prisma } = require('@prisma/client')
const prisma = new PrismaClient()

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body)

  try {
    const updatedTest = await prisma.Tests.update({ 
      where:{
          test_id: data.test_id
      },
      data: {
        test_id: data.test_id,
        description: data.description,
        moduleId: data.moduleId,
        status: data.status
      },
      select: {
        test_id: true,
        description: true,
        moduleId: true,
        status: true
      }
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTest)
    }
  } catch (error) {
    // if (e instanceof Prisma.PrismaClientRequestError) {
    //   if (e.code === 'P2002') {
    //     return {
    //       statusCode: 409,
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({
    //         error: 'A test with this description already exists'
    //       })
    //     }
    //   }
    // }

    // console.error(e)
    // return {
    //   statusCode: 500
    // }

    console.log(error)

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        }
  }

}
  