const jwt = require('jsonwebtoken');

exports.generateToken = id => {
    return jwt.sign({id}, process.env.JWT_KEY, {expiresIn:'20d'});
};


// 여기서 이렇게 만들어 놓고, 라우터에서 불러와 사용함 