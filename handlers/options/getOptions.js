const { PrismaClient } = require('@prisma/client')

module.exports.getOptionsByQuestion = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)

    try {
        const questionOptions = await prisma.options.findMany({
            where: {
                questionId: data.questionId,
                status: true
            }
        })

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(questionOptions)
        }

    } catch (error) {
        console.log(error)

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        }
    }finally{
        await prisma.$disconnect();
    }
    
}