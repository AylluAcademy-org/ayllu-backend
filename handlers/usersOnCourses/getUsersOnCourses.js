require("dotenv").config()
const { PrismaClient } = require("@prisma/client")

module.exports.getAllUsersOnCourses = async() => {
    const prisma = new PrismaClient();    

    try {

        const allUsersOnCourse = await prisma.usersOnCourses.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                },
                course: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                useroncourse_Id: 'asc'
            }
        })
        console.log(allUsersOnCourse);
        
        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(allUsersOnCourse)
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
    }finally{
        await prisma.$disconnect();
    }
    
}

module.exports.getUserOnCourseByCourseId = async(event) => {
    const prisma = new PrismaClient();
    const data = event.queryStringParameters && event.queryStringParameters.courseId;

    let course_id = parseInt(data);

    try {
        const course = await prisma.usersOnCourses.findMany({
            where: {
                courseId: course_id,
                ended: false
            },
            include: {
                course: {
                    select: {
                        course_id: true,
                        name: true,
                        description: true
                    }
                }
            }
        })

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(course)
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
    }finally{
        await prisma.$disconnect();
    }
}

module.exports.getUserOnCourseByCourseIdUserId= async (event, context, callback) => {
    const prisma = new PrismaClient();
    const data = JSON.parse(event.body)
    const course = await prisma.usersOnCourses.findMany({    
          where:{
              userId:parseInt(data.userId) ,
              courseId:parseInt(data.courseId)
          } ,
          include: {
                rewards: {
                    select: {
                        reward_id: true
                    }
                }
            }         
        })        
        console.log(course);
    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
        "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
        "Access-Control-Allow-Methods": (process.env.METHODS).toString()
      },
      body: JSON.stringify(course)
    } 
  }

module.exports.getCoursesActive = async() => {
    const prisma = new PrismaClient();

    try {
        const userCoursesActive = await prisma.usersOnCourses.findMany({
            where: {
                ended: false
            }
        })

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(userCoursesActive)
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
        await prisma.$disconnect();
    }
}

module.exports.getCoursesCompleted = async() => {
    const prisma = new PrismaClient();

    try {
        const userCoursesCompleted = await prisma.usersOnCourses.findMany({
            where: {
                ended: true
            }
        })

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(userCoursesCompleted)
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
        await prisma.$disconnect();
    }
}

module.exports.getUserCoursesActive = async(event) => {
    const prisma = new PrismaClient();
    const data = event.queryStringParameters && event.queryStringParameters.user_id;

    let user_Id = parseInt(data)

    try {
        const userCoursesActive = await prisma.usersOnCourses.findMany({
            where: {
                userId: user_Id,
                ended: false
            },
            include: {
                modulesOnCourse: {
                    select: {
                        module_id: true,
                        lessonsCompleted: true,
                        isEnded: true,
                        grade: true
                    }
                }
            }
        })

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(userCoursesActive)
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
        await prisma.$disconnect();
    }
}

module.exports.getUserCoursesCompleted = async(event) => {
    const prisma = new PrismaClient();

    const data = event.queryStringParameters && event.queryStringParameters.user_id;

    let user_Id = parseInt(data)

    try {
        const userCoursesCompleted = await prisma.usersOnCourses.findMany({
            where: {
                userId: user_Id,
                ended: true
            },
            include: {
                modulesOnCourse: {
                    select: {
                        module_id: true,
                        lessonsCompleted: true,
                        isEnded: true,
                        grade: true
                    }
                }
            }
        })

        return {
            statusCode: 200,
            headers: { 
                "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify(userCoursesCompleted)
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
        await prisma.$disconnect();
    }
}
