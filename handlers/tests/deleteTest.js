const { PrismaClient } = require('@prisma/client')

exports.handler = async(event, context) => {
    const prisma = new PrismaClient()
    const data = event.queryStringParameters && event.queryStringParameters.test_id;

    let testId = parseInt(data)
    
    try {
        const deletedTest = await prisma.Tests.delete({
            where: {
                test_id: testId,
                status: true
            }
        })

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deletedTest) 
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