const db = require('../utils/connectDB')
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwtService')
const { makeHash, checkPassword } = require('../utils/Helpers')

const createError = require('http-errors')

module.exports = {
    register: async (req, res, next) => {

        try{
            const {uid, username, email, password} = req.body;

            const createdAt = new Date()
            const visibleAt = new Date()

            const userExists = await db.execute(`SELECT * FROM users WHERE uid = ? || email = ? ;`, [uid, email]).then(result=>{
                if (result[0].length == 0) return false;
                return true;
            })
            if (userExists) throw createError.BadRequest("A user with this userid or email already exists")

            const query = `
                INSERT INTO users (uid, username, email, password_hash, created_at, visible_at) 
                VALUES (?, ?, ?, ?, ?, ?);
            `;

            const hashedPassword = await makeHash(password);
            const values = [uid, username, email, hashedPassword, createdAt, visibleAt];

            if (!userExists){

                await db.execute(query, values).then(async (result)=>{
                    const user = { uid, username, email }
                    const access_token = generateAccessToken(user);
                    const refresh_token = generateRefreshToken(user);

                    await db.query(`INSERT INTO logins (uid, refresh_token, email) VALUES (?, ?, ?);`, 
                    [uid, refresh_token, email])
                    
                    res.status(200).json({
                        message: "User Successfully Registered.",
                        access_token: access_token,
                        refresh_token: refresh_token
                    })
                })
            }

        }catch (err){
            console.log(err)
            next(err)
        }

    },

    login: async (req, res, next) => {
        try{
            const {uid, password} = req.body;

            const createdAt = new Date()
            const visibleAt = new Date()

            const user = await db.execute(`SELECT * FROM users WHERE uid = ?;`, [uid]).then(result=>{
                if (result.length > 0) return result[0][0]
                return undefined;
            })
            const email = user.email;
            if (!user) throw createError.BadRequest("A user with this userid or email does not exists")

            const login = await db.execute(`SELECT * FROM logins WHERE uid = ? `, [uid]).then(result => {
                if (result[0].length) return result[0]
                return undefined;
            })

            const User = {
                uid: uid,
                username: user.username,
                email: user.email
            }

            const access_token = generateAccessToken(User)
            const refresh_token = generateRefreshToken(User)

            if (login){
                const uid = login[0].uid
                
                const refresh_token = await db.execute("SELECT * FROM logins WHERE uid = ?", [uid]).then(result => {
                    return result[0][0].refresh_token
                })

                res.status(200).json({
                    message: "Already Logged In.",
                    access_token: access_token,
                    refresh_token: refresh_token
                })

                return;
            }

            if (!(await checkPassword(password, user.password_hash))) throw createError.BadRequest("Password is incorrect")
            const query = `
                INSERT INTO logins (uid, refresh_token, email) 
                VALUES (?, ?, ?);
            `;


            const values = [uid, refresh_token, email];

            await db.execute(query, values).then((result)=>{

                res.status(200).json({
                    message: "User Logged In.",
                    access_token: access_token,
                    refresh_token: refresh_token
                })
            })
        }catch (err){
            console.log(err)
            next(err)
        }
    },

    logout: async (req, res, next) => {
        try {
            const { uid, email } = req.user; // Assuming uid and email are set in req.locals by middleware

            const user = await db.execute('SELECT * FROM users WHERE uid = ? OR email = ?', [uid, email])
                .then(result => result[0][0]);

            if (!user) throw createError.BadRequest("This user does not exist");

            const loggedIn = await db.execute('SELECT * FROM logins WHERE uid = ? AND email = ?', [uid, email])
                .then(result => result[0].length > 0);

            if (!loggedIn) throw createError.BadRequest("This user is not logged in");

            await db.execute('DELETE FROM logins WHERE uid = ? AND email = ?', [uid, email]);

            res.status(200).json({
                message: "User Logged Out."
            });
        } catch (err) {
            next(err);
        }
    },

    refresh: async (req, res, next) => {
        try {
            console.log("Body : ", req.body)
            const refreshToken = req.body.refresh_token;
            if (!refreshToken) throw createError.BadRequest('Refresh token is required');

            const checkLoginQuery = 'SELECT * FROM logins WHERE refresh_token = ?';
            const checkLoginValues = [refreshToken];
            const loginResult = await db.execute(checkLoginQuery, checkLoginValues);
            if (loginResult[0].length === 0) {
                throw createError.Unauthorized('Refresh token is invalid or expired');
            }

            // Verify the refresh token
            const userPayload = await verifyRefreshToken(refreshToken);
            delete userPayload.iat
            // Generate a new access token
            const newAccessToken = generateAccessToken(userPayload);

            res.status(200).json({
                access_token: newAccessToken
            });
        } catch (err) {
            next(err);
        }
    }
}