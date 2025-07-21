require("dotenv").config()
const { Prisma, PrismaClient } = require('@prisma/client')

exports.handler = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body);

    try {
        let lessons = [];
        let tests = [];

        const modules = await prisma.modules.findMany({
            where: {
                courseId: data.course_id
            },
            include: {
                test: true,
                lessons: true
            }
        })

        modules.forEach((e) => {
            if(e.lessons) {
                e.lessons.forEach((data) => {
                    lessons.push(data);
                })  
            }
            
            if(e.test){
                e.test.forEach(val => {
                    tests.push(val);
                })
            }
        })


        const courseUpdated = await prisma.courses.update({
            where: {
                course_id: data.course_id,
            },
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                duration: data.duration,
                image: data.image,
                video: data.image,
                lesson: lessons.length,
                likes: data.likes,
                tests: tests.length,
                categoryId: data.categoryId,
                authorId: data.authorId
            },
            select: {
                name: true,
                description: true,
                price: true,
                duration: true,
                image: true,
                video: true,
                lesson: true,
                likes: true,
                tests: true,
                categoryId: true,
                author: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                },
                modules: {
                    select: {
                        name: true,
                        description: true,
                        image: true
                    }
                }
            }
        });

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(courseUpdated)
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