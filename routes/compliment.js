const Complement = require('../models/compliment');

const auth = require('../middleware/auth');
const Compliment = require('../models/compliment');

const express = require('express');
const router = express.Router();

// 칭찬일기 작성
router.post('/create', auth, async(req, res) => {
    try{
        const { content, emotion } = req.body;
        const user = req.user;

        const createCompliment = await Compliment.create({
            content: content,
            emotion: emotion,
            date: new Date(),
        });

        user.addCompliment(createCompliment);

        res.json({success: true, message: "글이 성공적으로 등록되었습니다"});
    } catch (error) {
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message }`});
    }

})

// 칭찬일기 전체조회
router.get('/read-all', auth, async (req, res) => {
    try {
        const user = req.user;

        // 사용자가 작성한 모든 칭찬일기 가져옴
        const userCompliments = await Compliment.findAll({
            where: { userId: user.id } // 사용자 ID를 기준으로 분류
            ,
            order: [
                ['id', 'DESC'] // id를 내림차순으로 정렬
            ]
        });

        res.json({ success: true, message: userCompliments });

    } catch (error) {
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }
});

// 칭찬일기 상세조회
router.get('/read/:id', auth, async (req, res) => {
    try {
        const user = req.user;
        const complimentId = req.params.id;
        // id에 해당하는 칭찬일기 글 가져옴 
        const userCompliments = await Compliment.findByPk(complimentId);

        res.json({ success: true, message: userCompliments });

    } catch (error) {
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }
});

// 칭찬일기 수정
router.put('/update/:id', auth, async (req, res) => {
    try {
        const { content, emotion } = req.body;
        const user = req.user;
        const complimentId = req.params.id;
        // id에 해당하는 칭찬일기 글 가져옴 
        const userCompliments = await Compliment.findByPk(complimentId);

        // 수정 
        userCompliments.content = content;
        userCompliments.emotion = emotion;
        userCompliments.save();
        res.json({ success: true, message: "칭찬일기가 성공적으로 수정되었습니다" });

    } catch (error) {
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }
});

// 칭찬일기 삭제
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const complimentId = req.params.id;
        // id에 해당하는 칭찬일기 글 가져옴 
        const userCompliments = await Compliment.findByPk(complimentId);
        
        // 삭제
        userCompliments.destroy();

        res.json({ success: true, message: "성공적으로 삭제되었습니다"});

    } catch (error) {
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }
});

module.exports = router;