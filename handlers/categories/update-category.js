require("dotenv").config()
const { PrismaClient } = require("@prisma/client")

exports.handler = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)

    try {
        const categoryUpdated = await prisma.categories.update({
            where: {
                category_id: data.category_id
            },
            data: {
                name: data.name,
                status: data.status,
                image: data.image
            },
            select: {
                category_id: true,
                name: true,
                status: true,
                image: true,
                courser: {
                    select: {
                        name: true
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        })

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(categoryUpdated)
        }
        
    } catch (error) {
        console.error(error)
        
        return {
            statusCode: 500,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(error)
        }

    }finally {
        await prisma.$disconnect()
    }

}