require("dotenv").config()
const { PrismaClient } = require("@prisma/client")

exports.handler = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)
    let updatedModuleOnCourse

    try {
        
        const findModule = await prisma.modulesOnCourse.findFirst({
            where: {
                userOnCourse_id: data.userOnCourse_id,
                isEnded: false
            }
        }) 

        if(findModule){
            updatedModuleOnCourse = await prisma.modulesOnCourse.update({
                where: {
                    useronmodule_id: findModule.useronmodule_id
                },
                data: {
                    module_id: data.module_id,
                    userOnCourse_id: data.userOnCourse_id,
                    lessonsCompleted: data.lessonsCompleted,
                    progress: data.progress,
                    isEnded: data.isEnded,
                    grade: data.grade,
                    moduleRating: data.moduleRating,
                    userReview: data.userReview
                },
                select: {
                    module_id: true,
                    userOnCourse_id: true,
                    lessonsCompleted: true,
                    progress: true,
                    isEnded: true,
                    grade: true,
                    moduleRating: true,
                    userReview: true
                }
            })
        }else{
            updatedModuleOnCourse = { "Error": "No hay módulo en progreso."}
        }

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(updatedModuleOnCourse)
        }
        
    } catch (error) {
        if (e instanceof Prisma.PrismaClientRequestError) {
            if (e.code === 'P2002') {
              return {
                statusCode: 409,
                headers: { 
                    "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                    "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                    "Access-Control-Allow-Methods": (process.env.METHODS).toString()
                },
                body: JSON.stringify({
                  error: 'Module update cannot be done, some data already exists'
                })
              }
            }
          }

        console.error(e)
        return {
            statusCode: 500
        }
    } finally {
        await prisma.$disconnect();
    }

}