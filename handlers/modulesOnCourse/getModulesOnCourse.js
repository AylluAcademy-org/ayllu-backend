require("dotenv").config()
const { PrismaClient } = require("@prisma/client")

module.exports.getAllModulesOnCourse = async(event) => {
    const prisma = new PrismaClient()
    //const data = JSON.parse(event.body)

    try {
        const allCourseModules = await prisma.modulesOnCourse.findMany()

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(allCourseModules)
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

module.exports.getModuleOnCourseById = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)

    try {
        const moduleOnCourseByUserId = await prisma.modulesOnCourse.findFirst({
            where: {
                userOnCourse_id: data.userId,
                isEnded: false
            }
        }) 

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(moduleOnCourseByUserId)
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

module.exports.getModulesCompleted = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)

    try {
        const modulesCompletedByUser = await prisma.modulesOnCourse.findMany({
            where: {
                userOnCourse_id: data.userId,
                isEnded: true
            }
        }) 

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(modulesCompletedByUser)
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

module.exports.getModulesAverageGrade = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body)
    var modulesCompleted, modulesByCourse, averageGrade, _progress;

    try {
        // Get data of user enrolled in a specific course
        const userOnCourse = await prisma.usersOnCourses.findUnique({
            where: {
                useroncourse_Id: data.userOnCourse_id
            }
        })

        // Get modules already completed by the user of a specific course, just to get the number of modules completed.
        const userModulesCompleted = await prisma.modulesOnCourse.findMany({
            where: {
                userOnCourse_id: data.userOnCourse_id,
                isEnded: true
            }
        })
        modulesCompleted = userModulesCompleted.length;

        // Get the data of every module that belongs to a specific course, just to get the number of modules.
        const getModulesByCourse = await prisma.modules.findMany({
            where: {
                courseId: userOnCourse.courseId,
                status: true
            }
        })
        modulesByCourse = getModulesByCourse.length;

        // If there's no module alredy completed there's nothing to do, it will omit everything
        if(modulesCompleted != 0){
            //If the modules already completed are all the modules of a specific course, it will get every grade obtained on every module
            //then it will calculate the average grade obtained of the course, and it'll also calculate the progress of the course.
            //Due all modules has been completed progress will be 100%, and the progress, status (ended) and grade will be updated, so it shows the course has been completed.
            if(modulesCompleted === modulesByCourse){
                let sum = 0

                for(var i = 0; i < modulesByCourse; i++){
                    sum += userModulesCompleted[i].grade
                }

                averageGrade = sum / modulesByCourse;
                _progress = modulesCompleted / modulesByCourse

                await prisma.usersOnCourses.update({
                    where: {
                        useroncourse_Id: userOnCourse.useroncourse_Id
                    },
                    data:{
                        progress: _progress,
                        ended: true,
                        grade: averageGrade
                    },
                    select: {
                        progress: true,
                        ended: true,
                        grade: true
                    }
                })

            }else{
                //if there's still modules to be completed, it will just calculate the average grade of the grades obtained on those modules.
                //It also calculate the progress acording the number of modules completed. And finally, data will be update with the current progress and average grade.
                let sum = 0

                for(var i = 0; i < modulesCompleted; i++){
                    sum += userModulesCompleted[i].grade
                }

                averageGrade = sum / modulesByCourse
                _progress = modulesCompleted / modulesByCourse

                await prisma.usersOnCourses.update({
                    where: {
                        useroncourse_Id: userOnCourse.useroncourse_Id
                    },
                    data:{
                        progress: _progress,
                        grade: averageGrade
                    },
                    select: {
                        progress: true,
                        grade: true
                    }
                })
            }
        }

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(averageGrade)
        }

    }catch (error) {
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

