const { Prisma, PrismaClient } = require('@prisma/client')
  
exports.handler = async (event, context, callback) => {
    const prisma = new PrismaClient() 
    const data = JSON.parse(event.body)

    try {
        
        const createQuestion = await prisma.questions.create({ data })
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createQuestion)
          }

    } catch (error) {
        console.log(error)

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        }
    }finally {
        await prisma.$disconnect()
    }

}