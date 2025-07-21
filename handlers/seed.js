require("dotenv").config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.handler = async (event, context, callback) => {
  try {

    const createdCategory1 = await prisma.Categories.create({
      data: seedCategory1,
    })
    const createdCategory2 = await prisma.Categories.create({
      data: seedCategory2,
    })

    const createdCategory3 = await prisma.Categories.create({
      data: seedCategory3,
    })

    const createdCategory4 = await prisma.Categories.create({
      data: seedCategory4,
    })

    const createdProfile1 = await prisma.Categories.create({
      data: seedProfile1,
    })

    const createdProfile2 = await prisma.Categories.create({
      data: seedProfile3,
    })

    const createdProfile3 = await prisma.Categories.create({
      data: seedProfile3,
    })



    return {
      statusCode: 201,
      headers: { 
        "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
        "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
        "Access-Control-Allow-Methods": (process.env.METHODS).toString()
      },
      body: JSON.stringify([createdUser, createdUser2]),
    }
  } catch (error) {
    console.error(error)
    return { statusCode: 500 }
  }
}

const seedCategory1={
  name:"BlockChain",
}
const seedCategory2={
  name:"Programación Funcional",
}
const seedCategory3={
  name:"Cardano",
}
const seedCategory4={
  name:"Criptomonedas",
}

const seedProfile1={
  name:"Estudiante",
}
const seedProfile2={
  name:"Maestro",
}
const seedProfile3={
  name:"Administrador",
}

const seedUser = {
  email: 'jane@prisma.io',
  name: 'Jane',
  profile: {
    create: {
      bio: 'Health Enthusiast',
    },
  },
  posts: {
    create: [
      {
        title: 'Comparing Database Types: How Database Types Evolved to Meet Different Needs',
        content: 'https://www.prisma.io/blog/comparison-of-database-models-1iz9u29nwn37/',
      },
      {
        title: 'Analysing Sleep Patterns: The Quantified Self',
        content: 'https://quantifiedself.com/get-started/',
      },
      {
        title: 'Prisma 2 Docs',
        content: 'https://www.prisma.io/docs/',
      },
    ],
  },
}

const seedUser2 = {
  email: 'toru@prisma.io',
  name: 'Toru Takemitsu',
  profile: {
    create: {
      bio: 'Musician',
    },
  },
  posts: {
    create: [
      {
        title: 'Requiem for String Orchestra',
        content: '',
      },
      {
        title: 'Music of Tree',
        content: '',
      },
      {
        title: 'Waves for clarinet, horn, two trombones and bass drum ',
        content: '',
      },
    ],
  },
}
