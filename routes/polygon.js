const User = require('../models/user');
const Polygon = require('../models/polygon');
const Element = require('../models/element');

const auth = require('../middleware/auth');

const express = require('express');
const router = express.Router();

router.post('/set-element', auth,  async (req, res) => {
    try {
        const { elements } = req.body; 
        const user = req.user;

        // 사용자와 프론트로부터 받은 요소 연결
        await user.addElements(elements);

        res.status(200).json({ success: true, message: `${user.nickname}님이 선택하신 요소 연결 성공` });
        
    } catch (error) {
        res.status(500).json({  success: false, message: `서버 오류 발생 ${error.message }` });
    }
})

router.post('/create', auth, async (req, res) => {
    try{
        const user = req.user;

        const UserElements = await user.getElements();
        // 현재 날짜를 가진 다각형 생성 
        const createPolygon = await Polygon.create({ date: new Date() });
        // 다각형과 요소 리스트 연결
        await createPolygon.setElements(UserElements);
        // 유저와 다각형 연결 
        await user.addPolygon(createPolygon);

        res.status(200).json({ success: true, message: "다각형 생성 성공" });

    } catch (error) {
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message }`});
    }
})

module.exports = router;
