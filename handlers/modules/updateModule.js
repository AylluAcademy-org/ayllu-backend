const { Prisma, PrismaClient } = require('@prisma/client')

exports.handler = async(event) => {
    const prisma = new PrismaClient()
    const data = JSON.parse(event.body);

    try {
        const updatedModule = await prisma.modules.update({
            where: {
                module_id: data.module_id
            },
            data: {
                name: data.name,
                description: data.description,
                status: data.status,
                image: data.image,
                class: data.class,
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedModule)
          }
    } catch (e) {
        // if (e instanceof Prisma.PrismaClientRequestError) {
        //     if (e.code === 'P2002') {
        //       return {
        //         statusCode: 409,
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({
        //           error: 'Module update cannot be done, some data already exists'
        //         })
        //       }
        //     }
        //   }

        // console.error(e)
        // return {
        //     statusCode: 500
        // }

        console.log(error)

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(error)
        }
    } finally {
        await prisma.$disconnect();
    }
}