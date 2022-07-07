const { PrismaClient } = require('@prisma/client')

exports.handler = async(event, context) => {
    const prisma = new PrismaClient()
    const data = event.queryStringParameters && event.queryStringParameters.useroncourse_Id;

    let user_id = parseInt(data)
    
    try {
        const deletedUserOnCourse = await prisma.usersOnCourses.delete({
            where: {
                useroncourse_Id: user_id,
                ended: false
            }
        })

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deletedUserOnCourse) 
        }

    } catch (error) {
        console.log(error)

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
          }
    }finally{
        await prisma.$disconnect()
    }

} 