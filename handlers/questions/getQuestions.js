const { PrismaClient } = require("@prisma/client")

module.exports.getQuestionsByTest = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)

    try {
        const testQuestions = await prisma.questions.findMany({
            where: {
                testId: data.testId,
                status: true
            },
            include: {
                options: {
                    select: {
                        text: true,
                        order: true
                    }
                }
            }
        })

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testQuestions)
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

module.exports.getQuestionByOrderId = async(event) => {
    const prisma = new PrismaClient();
    const data = event.queryStringParameter && event.queryStringParameter.order;

    let orderId = parseInt(data)

    try {
        const questionByOrder = await prisma.questions.findUnique({
            where: {
                order: orderId,
                status: true
            },
            include: {
                options: {
                    select:{
                        text: true,
                        order: true
                    }
                }
            }
        })

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(questionByOrder)
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