const { PrismaClient } = require("@prisma/client")

exports.handler = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)

    try {
        const optionCreated = await prisma.options.create({ data })

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(optionCreated)
        }

    } catch (error) {
        console.error(error)
        
        return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error)
        }
    }finally {
        await prisma.$disconnect()
    }

}