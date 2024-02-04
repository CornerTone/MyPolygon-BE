const jwt = require('jsonwebtoken'); 
const User = require('../models/user');

let auth = async (req, res, next) => { 
    try {
        // 클라이언트 쿠키에서 토큰을 가져옴 
        let token = req.cookies.mypolygon_auth;
        // console.log(token);

        // 토큰을 복호화한 후 유저를 찾음 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        console.log(userId);

        // 데이터베이스에서 사용자 정보 조회
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다',
            });
        }

        // 사용자 정보를 req.user에 넣음 
        req.user = user;
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') { // 유효 기간 초과인 경우 
            return res.status(419).json({
                success: false,
                message: '토큰이 만료되었습니다',
            });
        }
        return res.status(401).json({
            success: false,
            message: '유효하지 않은 토큰입니다',
        });
    }
}

module.exports = auth; 
