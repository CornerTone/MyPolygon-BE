// 사용자의 활동 시간을 넘겨받아 처리하는 코드 : user_activities
// Express 라이브러리를 사용하여 요청 처리

const express = require('express');
const app = express();
const UserActivity = require('./models/user_activities'); // UserActivity 모델을 가져옴

// POST 요청을 처리하는 라우트 핸들러
app.post('/user-activities', async (req, res) => {
    try {
        // 요청에서 데이터 추출
        const { user_id, category, duration_minutes, activity_date } = req.body;

        // 데이터베이스에 저장
        const userActivity = await UserActivity.create({
            user_id,
            category,
            duration_minutes,
            activity_date
        });

        // 성공적인 응답
        res.status(201).json({ message: 'User activity recorded successfully', data: userActivity });
    } catch (error) {
        // 오류 처리
        console.error('Error recording user activity:', error);
        res.status(500).json({ message: 'Failed to record user activity' });
    }
});

// 서버 시작
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
