require("dotenv").config()
const { Prisma, PrismaClient } = require('@prisma/client')

exports.handler = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body);

    try {

        const classes = await prisma.lessons.findMany({
            where: {
                moduleId: data.module_id
            }
        })

        const updatedModule = await prisma.modules.update({
            where: {
                module_id: data.module_id
            },
            data: {
                name: data.name,
                description: data.description,
                status: data.status,
                image: data.image,
                class: classes.length,
                time: data.time,
                courseId: data.courseId
            },
            select: {
                module_id: true,
                name: true,
                description: true,
                status: true,
                image: true,
                class: true,
                time: true,
                courseId: true,
                lessons: true,
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
            body: JSON.stringify(updatedModule)
          }
    } catch (error) {

        return {
            statusCode: 500,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(error.message)
        }
    } finally {
        await prisma.$disconnect();
    }
}