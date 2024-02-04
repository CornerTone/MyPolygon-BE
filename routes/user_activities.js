// 사용자의 활동 시간을 넘겨받아 처리하는 코드 : user_activities
// Express 라이브러리를 사용하여 요청 처리
const express = require('express');
const router = express.Router();
const UserActivity = require('../models/user_activities'); // UserActivity 모델을 가져옴
const auth = require('../middleware/auth');


// POST 요청을 처리하는 라우트 핸들러
router.post('/user-activities',auth, async (req, res) => {
    try {
        // 요청에서 데이터 추출
        const { category, duration_minutes, activity_date } = req.body;
        const user = req.user;
        // 프론트에서 넘겨받은 데이터 데이터베이스에 저장
        const userActivity = await UserActivity.create({
            userId: user,
            category,
            duration_minutes,
            activity_date
        });

        // 성공적인 응답
        res.status(201).json({ success : true, message: 'User activity recorded successfully', data: userActivity });
    } catch (error) {
        // 오류 처리
        console.error('Error recording user activity:', error);
        res.status(500).json({ success : false, message: 'Failed to record user activity' });
    }
});


module.exports = router;