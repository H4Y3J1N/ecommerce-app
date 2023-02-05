const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authCheck = async(req,res,next) => {
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer ")){
        try{
            token = req.headers.authorization.split(" ")[1];
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                //find user by id
                const user = await User.findById(decoded?.id).select("-password");
                // attach the user to the request object
                req.user = user;
                next();
            }else {
                throw new Error("there is no token in header")
            }
        }catch(error){
            throw new Error ("not authorized token expired, login again");
        }
    }
};


// //----------------------------------------------------------------
// // 좋아보이는 중급 코드라 일단 훔쳐옴
// //----------------------------------------------------------------
exports.adminCheck = async (req, res, next) => {
    const { email } = req.user;
  
    const adminUser = await User.findOne({ email }).exec();
  
    if (adminUser.role !== "admin") {
      res.status(403).json({
        err: "Admin resource. Access denied.",
      });
    } else {
      next();
    }
  };
  