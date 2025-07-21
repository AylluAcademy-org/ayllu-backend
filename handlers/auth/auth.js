const { PrismaClient } = require("@prisma/client")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require("dotenv").config()

module.exports.registerUser = async(event) => {
    const data = JSON.parse(event.body);
    const prisma = new PrismaClient();

    try {

        let errorMessage;

        if ((typeof(data.name) !== 'string') || data.name.trim() === '') {
            errorMessage = new Error("El nombre de usuario debe tener caracteres validos.");
            return {
                statusCode: 500,  
                body: JSON.stringify({ message: errorMessage.message})
            };
        }

        if ((typeof(data.lastname) !== 'string') || data.lastname.trim() === '') {
            errorMessage = new Error("El Apellido de usuario debe tener caracteres validos.");
            return {
                statusCode: 500,  
                body: JSON.stringify({ message: errorMessage.message})
            };
        }

        if ((typeof(data.email) !== 'string') || data.email.trim() === '') {
            errorMessage = new Error("El correo electronico debe tener caracteres validos.");
            return {
                statusCode: 500,  
                body: JSON.stringify({ message: errorMessage.message})
            };
        }

        if (data.password.length < 9 || data.password.trim() === '') {
            errorMessage = new Error("La contraseña debe ser mayor a 8 caracteres de longitud.");
            return {
                statusCode: 500,  
                body: JSON.stringify({ message: errorMessage.message})
            };
        }

        if (data.password !== data.confirmPassword) {
            errorMessage = new Error("Las contraseñas no coinciden.");
            return {
                statusCode: 500,
                body: JSON.stringify({ message: errorMessage.message})
            }
        }

        let hashedPasword;

        const existingUser = await prisma.users.findUnique({
            where: {
                email: data.email
            }
        })

        if (existingUser) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Usuario ya ha sido registrado." })
            }
        } else {
            hashedPasword = await bcrypt.hash(data.password, 12);
        }

        const userCreated = await prisma.users.create({
            data: {
                name: data.name.concat(" ", data.lastname),
                email: data.email,
                password: hashedPasword
            }
        })


        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify({ status: "Usuario creado exitosamente.", data: userCreated })
        }

    } catch (error) {

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers": (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify({error: error.message})
        }
    }

}
module.exports.registerWallet = async(event) => {
    const data = JSON.parse(event.body);
    const prisma = new PrismaClient();

    try {

        let errorMessage;

        if ((typeof(data.name) !== 'string') || data.name.trim() === '') {
            errorMessage = new Error("El nombre de usuario debe tener caracteres validos.");
            return {
                statusCode: 500,  
                body: JSON.stringify({ message: errorMessage.message})
            };
        }

        if ((typeof(data.lastname) !== 'string') || data.lastname.trim() === '') {
            errorMessage = new Error("El Apellido de usuario debe tener caracteres validos.");
            return {
                statusCode: 500,  
                body: JSON.stringify({ message: errorMessage.message})
            };
        }

        if ((typeof(data.wallet) !== 'string') || data.wallet.trim() === '') {
            errorMessage = new Error("El nombre de usuario debe tener caracteres validos.");
            return {
                statusCode: 500,  
                body: JSON.stringify({ message: errorMessage.message})
            };
        }

        if ((typeof(data.email) !== 'string') || data.email.trim() === '') {
            errorMessage = new Error("El correo electronico debe tener caracteres validos.");
            return {
                statusCode: 500,  
                body: JSON.stringify({ message: errorMessage.message})
            };
        }

        if (data.password.length < 9 || data.password.trim() === '') {
            errorMessage = new Error("La contraseña debe ser mayor a 8 caracteres de longitud.");
            return {
                statusCode: 500,  
                body: JSON.stringify({ message: errorMessage.message})
            };
        }

        if (data.password !== data.confirmPassword) {
            errorMessage = new Error("Las contraseñas no coinciden.");
            return {
                statusCode: 500,
                body: JSON.stringify({ message: errorMessage.message})
            }
        }

        

        let hashedPasword;

        const existingUser = await prisma.users.findUnique({
            where: {
                wallet: data.wallet
            }
        })

        if (existingUser) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Usuario ya ha sido registrado." })
            }
        } else {
            hashedPasword = await bcrypt.hash(data.password, 12);
        }

        const userCreated = await prisma.users.create({
            data: {
                name: data.name.concat(" ", data.lastname),
                email: data.email,
                password: hashedPasword,
                wallet: data.wallet
            }
        })


        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify({ status: "Usuario creado exitosamente.", data: userCreated })
        }

    } catch (error) {

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers": (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify({error: error.message})
        }
    }

}
module.exports.login = async(event, context, callback) => {
    const data = JSON.parse(event.body);
    const prisma = new PrismaClient();

    try {

        if ((typeof(data.email) !== 'string') || data.email.trim() === '') {
            errorMessage = new Error("El correo electronico debe tener caracteres validos.");
            return {
                statusCode: 200,  
                body: JSON.stringify({ auth: false, message: errorMessage.message})
            };
        }

        if (data.password.length < 9 || data.password.trim() === '') {
            errorMessage = new Error("La contraseña debe ser mayor a 8 caracteres de longitud.");
            return {
                statusCode: 200,  
                body: JSON.stringify({ auth: false, message: errorMessage.message})
            };
        }

        const existingUser = await prisma.users.findUnique({
            where: {
                email: data.email
            }
        })

        if (!existingUser) {
            return {
                statusCode: 200,
                body: JSON.stringify({auth: false,  message: `Usuario con email ${data.email} no existe.` })
            }
        }

        const isPasswordCorrect = await bcrypt.compare(data.password, existingUser.password);

        if (!isPasswordCorrect) {
            return {
                statusCode: 200,
                body: JSON.stringify({ auth: false, message: "Credenciales no validas." })
            }
        }

        const token = signToken(data);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify({ auth: true, userID: existingUser.user_id, userName:existingUser.name, token: token })
        }

    } catch (error) {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify({auth: false,message:error.message})
        }
    }

}
module.exports.loginWallet = async(event, context, callback) => {
    const data = JSON.parse(event.body);
    const prisma = new PrismaClient();

    try {

        if ((typeof(data.wallet) !== 'string') || data.wallet.trim() === '') {
            errorMessage = new Error("Dirección de billetera incorrecta.");
            return {
                statusCode: 200,  
                body: JSON.stringify({ auth: false, message: errorMessage.message})
            };
        }
        const existingUser = await prisma.users.findUnique({
            where: {
                wallet: data.wallet
            }
        })

        if (!existingUser) {
            return {
                statusCode: 200,
                body: JSON.stringify({auth: false, userID:0, message: `Wallet no registrado.` })
            }
        }

        const token = signToken(data);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify({ auth: true, userID: existingUser.user_id, userName:'ANONIMO', token: token,wallet:existingUser.wallet })
        }

    } catch (error) {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": (process.env.HEADERS).toString(),
                "Access-Control-Allow-Origin": (process.env.ORIGIN).toString(),
                "Access-Control-Allow-Methods": (process.env.METHODS).toString()
            },
            body: JSON.stringify({auth: false,message:error.message})
        }
    }

}

/** Helper Functions */


function signToken(data) {
    return jwt.sign({ email: data.email, userId: data.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}