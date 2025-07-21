require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

module.exports.getRewardsByUserAndTest = async (event) => {
  const prisma = new PrismaClient();

  try {
    const data = JSON.parse(event.body);
    const { student_id, test_id } = data; 
console.log("Data received:---", data);
    const existingReward = await prisma.rewards.findFirst({
      where: {
        student_id,
        test_id
      },
      include: {
        course: {
          select: {
            name: true,
            description: true
          }
        },
        test: {
          select: {
            description: true,
            createdAt: true
          }
        },
        transaction: true
      }
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": process.env.HEADERS,
        "Access-Control-Allow-Origin": process.env.ORIGIN,
        "Access-Control-Allow-Methods": process.env.METHODS
      },
      body: JSON.stringify({
        hasReward: !!existingReward,
        reward: existingReward,
      })
    };

  } catch (error) {
    console.error("Error en getRewardsByUserAndTest:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await prisma.$disconnect();
  }
}



module.exports.geAllRewardsByUser = async (event) => {
  const prisma = new PrismaClient();

  try {
    const data = JSON.parse(event.body);
    const { userId } = data;

    // 1. Buscar todos los userOnCourse_id del usuario
    const userOnCourses = await prisma.usersOnCourses.findMany({
      where: { userId },
      select: { useroncourse_Id: true }
    });

    const userOnCourseIds = userOnCourses.map((uoc) => uoc.useroncourse_Id);

    // 2. Buscar recompensas relacionadas a esos userOnCourse_id
    const rewards = await prisma.rewards.findMany({
      where: {
        student_id: { in: userOnCourseIds }
      },
      include: {
        test: {
          select: {
            description: true,
            createdAt: true,
            module: {
              select: {
                name: true,
                description: true
              }
            } 
          }
        },
        course: {
          select: {
            name: true,
            description: true,
            
          }
        },
        transaction: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": process.env.HEADERS,
        "Access-Control-Allow-Origin": process.env.ORIGIN,
        "Access-Control-Allow-Methods": process.env.METHODS
      },
      body: JSON.stringify({ rewards })
    };

  } catch (error) {
    console.error("Error en get-all-rewards:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await prisma.$disconnect();
  }
};
