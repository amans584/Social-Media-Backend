const { verifyAccessToken } = require('../utils/jwtService')
const createError = require('http-errors')

module.exports = {
    isUserAuthenticated : async (req, res, next) => {
        try {
          const authHeader = req.headers['authorization'];
          console.log("authHeader", authHeader)
          if (!authHeader) throw createError.Unauthorized('Access token is missing');
          const accessToken = authHeader.split(' ')[1];
          if (!accessToken) throw createError.Unauthorized('Access token is missing or malformed');
          
          const payload = await verifyAccessToken(accessToken);
          req.user = payload;

          next();
        } catch (err) {
          next(err);
        }
    }
}