require("dotenv").config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.getCourseById= async (event, context, callback) => {
  const data = event.queryStringParameters && event.queryStringParameters.course_id

  let courseId = parseInt(data)

  try {
    const course = await prisma.Courses.findFirst({    
      where:{
          course_id:courseId
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        category: {
          select: {
            name: true,
            image: true
          }
        },
        modules: {
          select: {
            module_id: true,
            name: true,
            description: true,
            image: true,
            class: true,
            time: true,
            test: {
              select: {
                test_id: true,
                description: true,                
              },
              orderBy: {
                test_id: 'asc'
              }
            },
            lessons: {
              select: {
                lesson_id: true,
                name: true,
                image: true,
                video: true,
              },
              orderBy: {
                lesson_id: 'asc'
              }
            }
          },
          orderBy: {
            module_id: 'asc'
          }
        },
        
      },
      orderBy: {
        course_id: 'asc'
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
    console.log('Error al hacer getCourseById'+error);
    return {
      statusCode: 500,
      headers: { 
        "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
        "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
        "Access-Control-Allow-Methods": (process.env.METHODS).toString()
      },
      body: JSON.stringify(error.message)
    }
  }
  
}
module.exports.getCourseByIdPublic= async (event, context, callback) => {
  const data = event.queryStringParameters && event.queryStringParameters.course_id

  let courseId = parseInt(data)

  try {
    const course = await prisma.Courses.findFirst({    
      where:{
          course_id:courseId
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        category: {
          select: {
            name: true,
            image: true
          }
        },
        modules: {
          select: {
            module_id: true,
            name: true,
            description: true,
            image: true,
            class: true,
            time: true,
            lessons: {
              select: {
                name: true,
                image: true,
                video: true,
              },
              orderBy: {
                lesson_id: 'asc'
              }
            }
          },
          orderBy: {
            module_id: 'asc'
          }
        }
      },
      orderBy: {
        course_id: 'asc'
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
    console.log('Error al hacer getCourseById'+error);
    return {
      statusCode: 500,
      headers: { 
        "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
        "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
        "Access-Control-Allow-Methods": (process.env.METHODS).toString()
      },
      body: JSON.stringify(error.message)
    }
  }
  
}
module.exports.getCourseByCategory= async (event, context, callback) => {
  const data = JSON.parse(event.body)

  try {
    
    const courses = await prisma.Courses.findMany({    
        where:{
            categoryId :data.categoryId,
            status:true,
        },
        orderBy: {
          course_id: 'asc'
        }
      })

  return {
    statusCode: 200,
    headers: { 
      "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
      "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
      "Access-Control-Allow-Methods": (process.env.METHODS).toString()
    },
    body: JSON.stringify(courses)
  } 
  }catch(error) {
        return {
          statusCode: 500,
          headers: { 
            "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
            "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
            "Access-Control-Allow-Methods": (process.env.METHODS).toString()
          },
          body: JSON.stringify(error.message)
        }
  }
}

module.exports.getCourseByName = async(event) => {
  const data = JSON.parse(event.body);

  const course = await prisma.courses.findFirst({
    where: {
      name: data.name,
      status: true
    },
    orderBy: {
      course_id: 'asc'
    }
  })

  return {
    statusCode: 200,
    headers: { 
      "Access-Control-Allow-Headers" : process.env.HEADERS.toString(),
      "Access-Control-Allow-Origin": process.env.ORIGIN.toString(),
      "Access-Control-Allow-Methods": process.env.METHODS.toString()
    },
    body: JSON.stringify(course)
  }
  
}

/** Handler to get all the information of a course: general information, author, category
*   modules with its test/s, lessons (with general information and resources).
*   This information is meant to be used by the teachers.
*/
module.exports.GetAllCourseInfo = async (event) => {

  const data = event.queryStringParameters && event.queryStringParameters.course_id

  let courseId = parseInt(data)
  
  try {
    const allCourseInfo = await prisma.courses.findMany({
      where: {
        course_id: courseId,
        status: true
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        category: {
          select: {
            name: true,
            image: true
          }
        },
        modules: {
          select: {
            name: true,
            description: true,
            image: true,
            class: true,
            time: true,
            test: {
              select: {
                test_id: true,
                description: true,
                questions: {
                  select: {
                    text: true,
                    order: true,
                    status: true,
                    options: {
                      select: {
                        text: true,
                        order: true,
                        value: true
                      },
                      orderBy: {
                        order: 'asc'
                      }
                    }
                  },
                  orderBy: {
                    order: 'asc'
                  }
                }
              },
              orderBy: {
                test_id: 'asc'
              }
            },
            lessons: {
              select: {
                name: true,
                image: true,
                video: true,
                resources: {
                  select: {
                    name: true,
                    description: true,
                    url: true
                  }
                }
              },
              orderBy: {
                lesson_id: 'asc'
              }
            },
          },
          orderBy: {
            module_id: 'asc'
          }
        }
      },
      orderBy: {
        course_id: 'asc'
      }
    });

    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
        "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
        "Access-Control-Allow-Methods": (process.env.METHODS).toString()
      },
      body: JSON.stringify(allCourseInfo)
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
  }

}


module.exports.getAll=  async (event) => {
  try {
    console.log('aqui esta');
        const coursesAll = await prisma.Courses.findMany({    
          where:{
              status:true,
          },
          include: {
            author: {
              select: {
                name: true,
                email: true,
                image: true
              }
            },
            category: {
              select: {
                name: true,
                image: true
              }
            },
            modules: {
              select: {
                name: true,
                description: true,
                image: true,
                class: true,
                time: true,
                lessons: {
                  select: {
                    name: true,
                  },
                  orderBy: {
                    lesson_id: 'asc'
                  }
                }
              },
              orderBy: {
                module_id: 'asc'
              }
            }
          },
          orderBy: {
            course_id: 'asc'
          } 
        })

        return {
          statusCode: 200,
          headers: { 
            "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
            "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
            "Access-Control-Allow-Methods": (process.env.METHODS).toString()
          },
          body: JSON.stringify(coursesAll)
        }     
    
  } catch (error) {
    console.error('aquii cayo');
    console.error(error)
    return {
      statusCode: 500,
      headers: { 
        "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
        "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
        "Access-Control-Allow-Methods": (process.env.METHODS).toString()
      },
      body: JSON.stringify(error.message)
    }
  }
}


module.exports.getAllPublic=  async (event) => {
  try {
        const coursesAll = await prisma.Courses.findMany({    
          where:{
              status:true,
          },
          include: {
            author: {
              select: {
                name: true,
                email: true,
                image: true
              }
            },
            category: {
              select: {
                name: true,
                image: true
              }
            },
            modules: {
              select: {
                name: true,
                description: true,
                image: true,
                class: true,
                time: true,
                lessons: {
                  select: {
                    name: true,
                  },
                  orderBy: {
                    lesson_id: 'asc'
                  }
                }
              },
              orderBy: {
                module_id: 'asc'
              }
            }
          },
          orderBy: {
            course_id: 'asc'
          } 
        })

        return {
          statusCode: 200,
          headers: { 
            "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
            "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
            "Access-Control-Allow-Methods": (process.env.METHODS).toString()
          },
          body: JSON.stringify(coursesAll)
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
      body: JSON.stringify(error.message)
    }
  }
}








module.exports.getCourseByAuthorId = async(event) => {
  const authorId = parseInt(event.queryStringParameters && event.queryStringParameters.authorId)

  try {
    const coursesByAuthorId = await prisma.courses.findMany({
      where: {
        authorId: authorId
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        category: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        course_id: 'asc'
      }
    })

    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
        "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
        "Access-Control-Allow-Methods": (process.env.METHODS).toString()
      },
      body: JSON.stringify(coursesByAuthorId)
    } 
    
  } catch (error) {
    console.error("Error-->"+ error)

    return {
      statusCode: 500,
      headers: { 
        "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
        "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
        "Access-Control-Allow-Methods": (process.env.METHODS).toString()
      },
      body: JSON.stringify(error.message)
    }
  }

}

module.exports.getCourseByAuthorIdAndCategoryId = async (event) => {
  let author_Id = parseInt(event.queryStringParameters && event.queryStringParameters.authorId);
  let category_Id = parseInt(event.queryStringParameters && event.queryStringParameters.categoryId);

  try {

    const courseByAuthorAndCategory = await prisma.courses.findMany({
      where: {
        authorId: author_Id,
        categoryId: category_Id
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        category: {
          select: {
            name: true,
            image: true
          }
        },
        modules: {
          select: {
            name: true,
            description: true,
            image: true,
            class: true,
            time: true,
            test: {
              select: {
                test_id: true,
                description: true,
                questions: {
                  select: {
                    text: true,
                    order: true,
                    status: true,
                    options: {
                      select: {
                        text: true,
                        order: true,
                        value: true
                      },
                      orderBy: {
                        order: 'asc'
                      }
                    }
                  },
                  orderBy: {
                    order: 'asc'
                  }
                }
              },
              orderBy: {
                test_id: 'asc'
              }
            },
            lessons: {
              select: {
                name: true,
                image: true,
                video: true,
                resources: {
                  select: {
                    name: true,
                    description: true,
                    url: true
                  }
                }
              },
              orderBy: {
                lesson_id: 'asc'
              }
            },
          },
          orderBy: {
            module_id: 'asc'
          }
        }
      },
      orderBy: {
        course_id: 'asc'
      }
    });

    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
        "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
        "Access-Control-Allow-Methods": (process.env.METHODS).toString()
      },
      body: JSON.stringify(courseByAuthorAndCategory)
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
  }

}