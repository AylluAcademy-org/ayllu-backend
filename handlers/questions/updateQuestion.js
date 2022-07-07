const { Prisma, PrismaClient} = require('@prisma/client')

exports.handler = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)

    try {
        const updatedQuestion = await prisma.questions.update({
            where: {
                question_id: data.question_id,
                status: true
            },
            data: {
                question_id: data.question_id,
                text: data.text,
                order: data.order,
                status: data.status,
                testId: data.testId,
                updatedAt: data.updatedAt
            }
        })
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedQuestion)
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