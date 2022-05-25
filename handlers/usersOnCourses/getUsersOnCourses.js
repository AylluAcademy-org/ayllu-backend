const { PrismaClient } = require("@prisma/client")

module.exports.getAllUsersOnCourses = async() => {
    const prisma = new PrismaClient();    

    try {

        const allUsersOnCourse = await prisma.usersOnCourses.findMany()
        console.log(allUsersOnCourse);
        
        return {
            statusCode: 200,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(allUsersOnCourse)
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

//Not working yet
module.exports.getUserOnCourseByName = async(event) => {
    const prisma = new PrismaClient();
    const data = event.queryStringParameters && event.queryStringParameters.name;

    try {
        const course = await prisma.usersOnCourses.findUnique({
            where: {
                course: {
                    some: {
                        name: data
                    }
                }
            },
        })

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course)
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userCoursesActive)
        }
    } catch (error) {
        console.log(error)

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userCoursesCompleted)
        }
    } catch (error) {
        console.log(error)

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        }
    }finally {
        await prisma.$disconnect();
    }
}

//Not working yet
module.exports.getUserCoursesActive = async(event) => {
    const prisma = new PrismaClient();
    //const data = JSON.parse(event.body);
    const data = event.queryStringParameters && event.queryStringParameters.user_id;

    let user_Id = parseInt(data)

    try {
        const userCoursesActive = await prisma.usersOnCourses.findMany({
            where: {
                userId: user_Id,
                ended: false
            },
            // select: {
            //     useroncourse_Id: true,
            //     userId: true,
            //     courseId: true,
            //     progress: true,

            // }
        })

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userCoursesActive)
        }

    } catch (error) {
        console.log(error)

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        }
    }finally {
        await prisma.$disconnect();
    }
}

//Not working yet
module.exports.getUserCoursesCompleted = async(event) => {
    const prisma = new PrismaClient();
    //const data = JSON.parse(event.body);

    const data = event.queryStringParameters && event.queryStringParameters.user_id;

    let user_Id = parseInt(data)

    try {
        const userCoursesCompleted = await prisma.usersOnCourses.findMany({
            where: {
                userId: user_Id,
                ended: true
            },
            // select: {
                
            // }
        })

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userCoursesCompleted)
        }

    } catch (error) {
        console.log(error)

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        }
    }finally {
        await prisma.$disconnect();
    }
}
