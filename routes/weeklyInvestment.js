const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const { WeeklyInvestment } = require('../models'); // WeeklyInvestment 모델 임포트

// 주차별 투자 시간 업데이트 또는 추가
router.post('/weekly',auth, async (req, res) => {
    try {
        const { year, week, category, timeInvested } = req.body;
        const user_id = req.user.id; // 요청에서 사용자 ID를 가져옵니다. 이는 로그인된 사용자의 ID일 것입니다.

        // 해당 주차의 데이터 찾기
        let weeklyInvestment = await WeeklyInvestment.findOne({ where: { user_id, year, week, category } });

        if (weeklyInvestment) {
            // 해당 주차의 데이터가 이미 존재하는 경우 시간을 더합니다.
            weeklyInvestment.totalTimeInvested += timeInvested;
            await weeklyInvestment.save();
        } else {
            // 해당 주차의 데이터가 없는 경우 새로 생성합니다.
            weeklyInvestment = await WeeklyInvestment.create({
                user_id,
                year,
                week,
                category,
                totalTimeInvested: timeInvested,
                startDate: new Date(), // 주의 시작일
                endDate: new Date() // 주의 종료일
            });
        }

        res.status(200).json({ success: true, message: '주차별 투자 시간이 업데이트되거나 추가되었습니다.', data: weeklyInvestment });
    } catch (error) {
        console.error('Error updating or creating weekly investment:', error);
        res.status(500).json({ success: false, message: '주차별 투자 시간을 업데이트하거나 추가하는 데 실패했습니다.' });
    }
});


// 주차별 각 카테고리별 투자 시간 조회
router.get('/weekly-investment/:year/:week',auth, async (req, res) => {
    try {
        const { year, week } = req.params;
        const user_id = req.user.id; // 요청에서 사용자 ID를 가져옵니다. 이는 로그인된 사용자의 ID일 것입니다.

        // 해당 주차의 사용자별 투자 시간 조회
        const weeklyInvestments = await WeeklyInvestment.findAll({
            where: { user_id, year, week },
            attributes: ['category', 'totalTimeInvested']
        });

        res.status(200).json({ success: true, message: '주차별 각 카테고리별 투자 시간을 조회했습니다.', data: weeklyInvestments });
    } catch (error) {
        console.error('Error fetching weekly investments:', error);
        res.status(500).json({ success: false, message: '주차별 투자 시간을 조회하는 데 실패했습니다.' });
    }
});

module.exports = router;
