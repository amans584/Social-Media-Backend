const jwt = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {

    generateAccessToken : function(user){
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
    },

    generateRefreshToken : function(user){
        return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    },

    verifyAccessToken: (token) => {
        return new Promise((resolve, reject) => {
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) return reject(createError.Unauthorized(err.message));
            resolve(payload);
          });
        });
    },

    verifyRefreshToken: (token) => {
        return new Promise((resolve, reject) => {
          jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) return reject(createError.Unauthorized(err.message));
            resolve(payload);
          });
        });
    },
    
}