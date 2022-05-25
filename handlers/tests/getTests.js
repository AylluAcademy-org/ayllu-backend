const { PrismaClient } = require("@prisma/client")

module.exports.getTestByModuleId = async(event) => {
    const prisma = new PrismaClient();    
    const data = JSON.parse(event.body)

    try {

        const moduleTest = await prisma.Tests.findMany({
            where: {
                moduleId: data.moduleId
            },
            include: {
                questions: {
                    select: {
                        question_id: true,
                        text: true,
                        order: true
                    }
                }
            }
        })
        
        return {
            statusCode: 200,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(moduleTest)
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