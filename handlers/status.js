require("dotenv").config()

exports.handler = async (event, context, callback) => {
  return {
    statusCode: 200,
    headers: { 
      "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
      "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
      "Access-Control-Allow-Methods": (process.env.METHODS).toString()
    },
    body: JSON.stringify({ up: true })
  }
}
