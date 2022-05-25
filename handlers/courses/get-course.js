const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


module.exports.getCourseById= async (event, context, callback) => {
  const data = event.queryStringParameters && event.queryStringParameters.course_id

  let courseId = parseInt(data)

  const course = await prisma.Courses.findUnique({    
        where:{
            course_id:courseId
        }            
      })

  console.log(course)

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  } 
}

module.exports.getCourseByCategory= async (event, context, callback) => {
  const data = JSON.parse(event.body)

  const courses = await prisma.Courses.findMany({    
        where:{
            categoryId :data.categoryId,
            status:true,
        } ,           
      })
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courses)
  } 
}

module.exports.getCourseByName = async(event) => {
  const data = JSON.parse(event.body);

  const course = await prisma.Courses.findUnique({
    where: {
      name: data.name
    }
  })

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  }

}

module.exports.getAll=  async (event, context, callback) => {
  try {
        const coursesAll = await prisma.Courses.findMany({    
          where:{
              status:true,
          } ,           
        })
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(coursesAll)
        }     
    
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error)
    }
  }
}
