const User = require('../models/user');
const Polygon = require('../models/polygon');
const Element = require('../models/element');
const PolygonElement = require('../models/polygon_element');
const { Op } = require('sequelize'); 
const auth = require('../middleware/auth');

const express = require('express');
const router = express.Router();

// 요소 설정 
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

// 요소 수정 -> 필요하다면 
router.put('/update-element', auth, async (req, res) => {
    try {
        const { elements } = req.body; 
        const user = req.user;

        // 사용자가 연결된 요소 끊음 
        await user.setElements([]);
        // 새로운 요소 연결
        await user.addElements(elements);

        res.status(200).json({ success: true, message: `${user.nickname}님이 선택하신 요소 업데이트 성공` });
        
    } catch (error) {
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }
});


// 다각형 생성 
router.post('/create', auth, async (req, res) => {
    try{
        const reqScores = req.body;
        const user = req.user;

        const UserElements = await user.getElements();
        // 현재 날짜를 가진 다각형 생성 
        const createPolygon = await Polygon.create({ date: new Date(), grade: 0 });
        
        const perfectScore = UserElements.length * 5;
        let totalScore = 0;

        // 사용자의 요소들을 다각형 요소로 연결
        for (const element of UserElements) {
            let score = 0;

            // 지금 사용자 요소 id == 요청 요소 id 이면 score에 요청 score 값 저장
            for (const reqScore of reqScores) {
                if (element.id == reqScore.id) {
                    score = reqScore.score;
                    break;
                }
            }

            totalScore += score;

            await createPolygon.createElement({
                name: `${element.name}_${createPolygon.id}`,
                score: score 
            });
        }

        let polygonGrade = 0;
        // 다각형의 만족도 등급 계산
        if ((totalScore / perfectScore) > (2 / 3)) {
            polygonGrade = 1;
        } else if ((totalScore / perfectScore) > (1 / 3)) {
            polygonGrade = 2;
        } else {
            polygonGrade = 3;
        }

        createPolygon.grade = polygonGrade;
        await createPolygon.save();

        // 유저와 다각형 연결 
        await user.addPolygon(createPolygon);

        res.status(200).json({ success: true, message: "다각형 생성 성공", polygon_id: createPolygon.id });

    } catch (error) {
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message }`});
    }
})


// 다각형 전체 조회
router.get('/read-all', auth, async (req, res) => {
    try {
        const user = req.user;

        // 사용자의 모든 다각형 가져오기
        const userPolygons = await user.getPolygons({
            include: [{ model: PolygonElement, as: 'elements' }] 
        });

        res.status(200).json({ 
            success: true, 
            polygons: userPolygons 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `서버 오류 발생 ${error.message}` 
        });
    }
});

router.get('/read/:id', auth, async (req, res) => {
    try {
        const user = req.user;
        const polygonId = req.params.id;

        const userPolygons = await Polygon.findAll({
            where: { userId: user.id },
            order: [['id', 'ASC']]
        });


        const IntPolygonId=parseInt(req.params.id, 10); // int 형으로 바꾸지 않으면 조회 불가 

        // 현재 다각형의 인덱스를 찾아야 함 
        const currentIndex = userPolygons.findIndex(polygon => polygon.id === IntPolygonId);
        console.log(userPolygons)
        console.log(currentIndex)

        // 이전 다각형과 다음 다각형
        const previousPolygon = currentIndex > 0 ? userPolygons[currentIndex - 1] : null;
        const nextPolygon = currentIndex < userPolygons.length - 1 ? userPolygons[currentIndex + 1] : null;

        let previousPolygonData = null;
        let nextPolygonData = null;

        if (previousPolygon) {
            previousPolygonData = await Polygon.findOne({
                where: { id: previousPolygon.id },
                include: [{ model: PolygonElement, as: 'elements' }]
            });
        }

        if (nextPolygon) {
            nextPolygonData = await Polygon.findOne({
                where: { id: nextPolygon.id },
                include: [{ model: PolygonElement, as: 'elements' }]
            });
        }

        // 현재 조회하구 있는 다각형 정보 반환
        const userPolygon = await Polygon.findOne({
            where: { id: polygonId },
            include: [{ model: PolygonElement, as: 'elements' }]
        });

        const responseData = {
            success: true,
            polygon: userPolygon,
            previousPolygon: previousPolygon,
            nextPolygon: nextPolygon,
        };

        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `서버 오류 발생 ${error.message}` 
        });
    }
});




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
