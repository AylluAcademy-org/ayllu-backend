
exports.handler = async(event) => {
    const data = event.queryStringParameters && event.queryStringParameters.access_token

    const accessToken = data.split("access_token=")[1].split('&')[0]

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accessToken)
    }

}