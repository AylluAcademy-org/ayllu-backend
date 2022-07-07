const { Prisma, PrismaClient } = require('@prisma/client')
  
exports.handler = async (event, context, callback) => {
    const prisma = new PrismaClient()

    try {
        const data = JSON.parse(event.body)

        const createUserOnCourse = await prisma.usersOnCourses.create({ data })

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(createUserOnCourse)
          }

    } catch (error) {
        console.log(error)

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        }
    }
}