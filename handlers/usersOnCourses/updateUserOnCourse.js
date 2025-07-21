require("dotenv").config()
const { Prisma, PrismaClient} = require('@prisma/client')

exports.handler = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)

    try {
        
        const updatedUserOnCourse = await prisma.usersOnCourses.update({
            where: {
                useroncourse_Id: data.useroncourse_Id
            },
            data: {
                userId: data.userId,
                courseId: data.courseId,
                progress: data.progress,
                ended: data.ended,
                grade: data.grade,
                rating: data.rating,
                review: data.review,
                reward: data.reward
            }
        })

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(updatedUserOnCourse)
        }

    } catch (error) {
        console.log(error)

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