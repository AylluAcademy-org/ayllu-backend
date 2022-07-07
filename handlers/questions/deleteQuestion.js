const { PrismaClient } = require('@prisma/client')

exports.handler = async(event, context) => {
    const prisma = new PrismaClient()
    const data = event.queryStringParameters && event.queryStringParameters.question_id;

    let questionId = parseInt(data)

    try {
        const deletedQuestion = await prisma.questions.delete({
            where: {
                question_id: questionId,
                status: true
            }
        })

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deletedQuestion) 
        }
    } catch (error) {
        console.log(error)

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
          }
    }finally{
        await prisma.$disconnect()
    }

}
