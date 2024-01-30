require('dotenv').config(); 
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

// 회원가입
router.post('/join', async (req, res) => { 
    try {
        const { nickname, phone_number, password, password2 } = req.body;
        const exUser = await User.findOne({ where: { nickname } });
        if (exUser) {
            return res.status(400).json({ success: false, message: "닉네임이 이미 존재합니다" });
        }

        if (password != password2) {
            return res.status(400).json({ success: false, message: "비밀번호가 일치하지 않습니다." });
        }
        
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            nickname,
            phone_number,
            password: hash
        });

        return res.status(200).json({ success: true , message: "회원가입 성공"});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message }` });
    }
});

// 로그인
router.post('/login', async (req, res) => {
    const { nickname, password } = req.body;

    try {
        // 닉네임으로 사용자 정보 조회
        const user = await User.findOne({ where: { nickname } });
        if (!user) {
            return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });
        }

        // 비밀번호 비교
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: "비밀번호가 일치하지 않습니다." });
        }

        // JWT 토큰 생성
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.token = token;
        await user.save();

        // 토큰을 저장해야 함 => 쿠키 이용 
        res.cookie("mypolygon_auth", user.token)
            .status(200)
            .json({
                success: true,
                userId: token
            });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message }` });
    }
});

// auth 미들웨어 -> req.user에 현재 로그인한 유저 정보가 담김 
router.get('/user-info', auth, (req, res) => {
    return res.json({ 
        success: true,
        nickname: req.user.nickname 
      
    });
});

// 로그아웃
router.get('/logout', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });
        }
        // 토큰 제거
        user.token = '';
        await user.save();

        // 쿠키 제거
        res.clearCookie("mypolygon_auth");

        return res.status(200).json({
            success: true,
            message: "로그아웃 되었습니다."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message }` });
    }
});

module.exports = router;
