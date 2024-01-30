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

router.get('/questions', auth, async (req, res) => {
    try{
        const user = req.user;

        // 사용자가 가지고 있는 elements를 가져옴
        const userElements = await user.getElements();

        const allQuestions = [];

        // 각 Element에서 랜덤으로 하나의 question을 선택하여 randomQuestions에 추가
        userElements.forEach(element => {
            // 랜덤으로 선택된 질문을 담을 변수
            const randomQuestions = [];

            const questionsArray = element.questions;
    
            // 중복을 피하면서 다섯 개의 랜덤 질문을 뽑기
            while (randomQuestions.length < 5) {
                // 남아있는 질문 중에서 랜덤으로 선택
                const randomIndex = Math.floor(Math.random() * questionsArray.length);
                const randomQuestion = questionsArray[randomIndex];
        
                if (!randomQuestions.includes(randomQuestion)) {
                    randomQuestions.push(randomQuestion);
                }
            }

            const oneElement = {
                id: element.id,
                element_name: element.name,
                question_strings: randomQuestions
            };

            allQuestions.push(oneElement);
        });
    
        res.status(200).json({ success: true, elements: allQuestions });
    } catch (error) {
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }
})

module.exports = router;
