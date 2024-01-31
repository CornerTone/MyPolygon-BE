// routes/timeInvestment.js
const express = require('express');
const router = express.Router();
const TimeInvestment = require('../models/timeInvestment');
const { Op } = require('sequelize');

function getCurrentWeekAndYear() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / (24 * 60 * 60 * 1000);
    const currentWeek = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    const currentYear = today.getFullYear();
    return { year: currentYear, week: currentWeek };
}

// 주차별 시작 및 종료 날짜를 반환하는 함수
function getWeekDates(year, week) {
    const startDate = new Date(year, 0, 1 + (week - 1) * 7); // 주의 시작일
    const endDate = new Date(year, 0, 1 + (week - 1) * 7 + 6); // 주의 종료일
    return { startDate, endDate };
}



//하루의 각 카테고리별 투자한 시간
router.post('/save-today-investment', async (req, res) => {
    try {
        const { categoryTimes } = req.body;
        const { year, week } = getCurrentWeekAndYear();

        // 각 카테고리별로 투자 시간 저장
        await Promise.all(categoryTimes.map(async (item) => {
            const { category, timeInvested } = item;
            // 오늘의 투자 시간 조회
            const todayInvestment = await TimeInvestment.findOne({
                where: {
                    category,
                    activityDate: new Date(),
                    year,
                    week
                }
            });
            if (todayInvestment) {
                // 이미 오늘의 투자 시간이 저장되어 있다면 업데이트
                todayInvestment.timeInvested += timeInvested;
                await todayInvestment.save();
            } else {
                // 오늘의 투자 시간이 저장되어 있지 않다면 새로 생성
                await TimeInvestment.create({
                    category,
                    timeInvested,
                    activityDate: new Date(),
                    year,
                    week
                });
            }
        }));

        res.status(200).json({ success: true, message: '오늘의 투자 시간을 저장하는 데 성공했습니다.' });
    } catch (error) {
        console.error('Error saving today\'s investment:', error);
        res.status(500).json({ success: false, message: '오늘의 투자 시간을 저장하는 데 실패했습니다.' });
    }
});


// 1. 주별 투자 시간 저장
router.post('/save-weekly-investment', async (req, res) => {
    try {
        const { year, week, categoryTimes } = req.body;

        // 주차의 시작 및 종료 날짜 가져오기
        const { startDate, endDate } = getWeekDates(year, week);

        // 주차별로 각 카테고리별 투자 시간을 데이터베이스에 저장
        await Promise.all(categoryTimes.map(async (categoryTime) => {
            const { category, timeInvested } = categoryTime;
            await TimeInvestment.findOrCreate({
                where: { category, year, week },
                defaults: { timeInvested, startDate, endDate }
            });
        }));

        res.status(200).json({ success: true, message: '주간 통계가 성공적으로 저장되었습니다.' });
    } catch (error) {
        console.error('Error saving weekly statistics:', error);
        res.status(500).json({ success: false, message: '주간 통계를 저장하는 데 실패했습니다.' });
    }
});

// 2. 주별 투자 시간 조회
router.get('/weekly-investment', async (req, res) => {
    try {
        const { year, week } = req.query;

        // 데이터베이스에서 해당 주의 투자 시간 조회
        const weeklyInvestments = await TimeInvestment.findAll({
            where: { year, week },
            attributes: ['category', 'timeInvested']
        });

        res.status(200).json({ success: true, message: '주간 투자 시간을 불러오는 데 성공했습니다.', data: weeklyInvestments });
    } catch (error) {
        console.error('Error fetching weekly investments:', error);
        res.status(500).json({ success: false, message: '주간 투자 시간을 불러오는 데 실패했습니다.' });
    }
});

// 3. 일년 동안의 투자 시간 조회
router.get('/yearly-investment', async (req, res) => {
    try {
        const { year } = req.query;

        // 데이터베이스에서 해당 연도의 투자 시간 조회
        const yearlyInvestments = await TimeInvestment.findAll({
            where: { year },
            attributes: ['category', 'timeInvested']
        });

        res.status(200).json({ success: true, message: '연간 투자 시간을 불러오는 데 성공했습니다.', data: yearlyInvestments });
    } catch (error) {
        console.error('Error fetching yearly investments:', error);
        res.status(500).json({ success: false, message: '연간 투자 시간을 불러오는 데 실패했습니다.' });
    }
});


module.exports = router;
