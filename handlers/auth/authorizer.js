const { PrismaClient } = require("@prisma/client")
const jwt = require('jsonwebtoken');

require("dotenv").config()

module.exports.handler = async(event, context, callback) => {

    try {
        
        const authenticationToken = event.headers.Authorization;

        if(!authenticationToken){
            throw new Error("Authorization header is missing.")
        }

        const token = authenticationToken.split(' ')[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        decodedToken
        return {
            principalId: decodedToken.email,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: event.methodArn
                    }
                ]
            }
        }

    } catch (error) {

        console.error(error);

        return {
            principalId: null,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: event.methodArn
                    }
                ]
            }
        };
    }

}