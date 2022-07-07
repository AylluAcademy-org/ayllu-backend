const { PrismaClient } = require('@prisma/client')

exports.handler = async(event, context) => {
    const prisma = new PrismaClient()
    const data = event.queryStringParameters && event.queryStringParameters.resource_id;

    let resourceId = parseInt(data)
    
    try {
        const deletedResource = await prisma.Resources.delete({
            where: {
                resource_id: resourceId,
                status: true
            }
        })

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deletedResource) 
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