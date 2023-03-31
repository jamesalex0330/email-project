import HttpStatus from 'http-status';
import jwt from '../services/jwt';
/**
  * Check user authorization
  * @param {Object} req
  * @param {Object} res
  * @param {Function} next
  */
const authValidateRequest = async (req, res, next) => {
  console.log("Hello");
  let token = req.headers['authorization'];
  if (token) {
    // Remove Bearer from string
    token = token.split(' ');
    token = token[token.length - 1];
  
    const user = jwt.verifyToken(token);
    console.log(user);
    if (!user) {
        return res.json({
          success: 0,
          message: "Invalid Token..."
        });
      } else {
        req.user = user
        next();
      };
  } else {
    return res.json({
      success: 0,
      message: "Access Denied! Unauthorized User"
    });
  }


}
export default authValidateRequest;