require("dotenv").config()

exports.handler = async(event) => {
    const data = event.queryStringParameters && event.queryStringParameters.access_token

    const accessToken = data.split("access_token=")[1].split('&')[0]

    return {
        statusCode: 200,
        headers: { 
            "Access-Control-Allow-Headers" : (process.env.HEADERS).toString(),
            "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
            "Access-Control-Allow-Methods": (process.env.METHODS).toString()
        },
        body: JSON.stringify(accessToken)
    }

}