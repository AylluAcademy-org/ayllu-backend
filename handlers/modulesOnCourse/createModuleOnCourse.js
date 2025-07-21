require("dotenv").config()
const { PrismaClient } = require("@prisma/client")

exports.handler = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)
    let moduleOnCourseCreated

    try {

        const hasModuleOnCourse = await prisma.modulesOnCourse.findFirst({
            where: {
                userOnCourse_id: data.userOnCourse_id,
                isEnded: false
            }
        })

        if(!hasModuleOnCourse){
            moduleOnCourseCreated = await prisma.modulesOnCourse.create({ data })
        }else{
            moduleOnCourseCreated = {"Error":"User has a module in progress of this course already, need to finish it first to start another."}
        } 

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(moduleOnCourseCreated)
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
