// routes/dailyInvestment.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const { DailyInvestment, User } = require('../models'); // DailyInvestment 모델 임포트
const { Op } = require('sequelize');

// POST 요청을 통해 하루의 투자 정보를 저장하는 라우터
router.post('/save_daily', auth, async (req, res) => {
    try {
        const { category, totalMinutes, activityDate } = req.body;

        // 분을 시간과 분으로 분리
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // DailyInvestment 모델을 사용하여 데이터베이스에 저장
        // 기존에 해당 날짜의 데이터가 있으면 덮어씌우도록 수정합니다.
        const [dailyInvestment, created] = await DailyInvestment.findOrCreate({
            where: {
                category,
                activityDate,
                user_id: req.user.id // 로그인된 사용자의 ID를 저장
            },
            defaults: {
                hours,
                minutes
            }
        });

        if (!created) { // 이미 해당 날짜의 데이터가 존재하는 경우
            dailyInvestment.hours = hours; // 시간을 새로운 값으로 덮어씌웁니다.
            dailyInvestment.minutes = minutes; // 분도 새로운 값으로 덮어씌웁니다.
            await dailyInvestment.save(); // 변경된 값을 저장합니다.
        }

        res.status(201).json({ success: true, message: '하루의 투자 정보를 저장했습니다.', data: dailyInvestment });
    } catch (error) {
        console.error('Error saving daily investment:', error);
        res.status(500).json({ success: false, message: '하루의 투자 정보를 저장하는 데 실패했습니다.' });
    }
});



router.put('/rewrite_daily', auth, async (req, res) => {
    try {
        const { category, totalMinutes, activityDate } = req.body;
        const userId = req.user.id; // 요청에서 사용자 ID를 가져옵니다. 이는 로그인된 사용자의 ID일 것입니다.

        // 분을 시간과 분으로 분리
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // DailyInvestment 모델을 사용하여 데이터베이스에서 해당 사용자의 해당 날짜의 투자 정보를 찾기
        let dailyInvestment = await DailyInvestment.findOne({
            where: {
                user_id: userId,
                activityDate: activityDate,
                category: category
            }
        });

        // 투자 정보가 존재하지 않으면 새로 생성
        if (!dailyInvestment) {
            dailyInvestment = await DailyInvestment.create({
                category,
                hours,
                minutes,
                activityDate,
                user_id: userId
            });
        } else {
            // 투자 정보가 이미 존재하면 해당 정보를 삭제하고 새로운 정보를 저장
            await DailyInvestment.destroy({
                where: {
                    user_id: userId,
                    activityDate: activityDate,
                    category: category
                }
            });

            // 새로운 정보를 저장
            dailyInvestment = await DailyInvestment.create({
                category,
                hours,
                minutes,
                activityDate,
                user_id: userId
            });
        }

        res.status(201).json({ success: true, message: '하루의 투자 정보가 수정되었습니다.', data: dailyInvestment });
    } catch (error) {
        console.error('Error saving daily investment:', error);
        res.status(500).json({ success: false, message: '하루의 투자 정보를 수정하는 데 실패했습니다.' });
    }
});



// // GET 요청을 통해 특정 사용자의 하루 투자 정보를 조회하는 라우터
// router.get('/daily', auth, async (req, res) => {
//     try {
//         const userId = req.user.id;

//         // DailyInvestment 모델을 사용하여 현재 사용자의 하루 투자 정보를 조회
//         const userDailyInvestments = await DailyInvestment.findAll({
//             where: {
//                 user_id: userId,
//                 activityDate: {
//                     [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000) // 어제부터 오늘까지의 데이터를 조회
//                 }
//             }
//         });

//         res.status(200).json({ success: true, message: '현재 사용자의 하루 투자 정보를 조회했습니다.', data: userDailyInvestments });
//     } catch (error) {
//         console.error('Error fetching user daily investments:', error);
//         res.status(500).json({ success: false, message: '현재 사용자의 하루 투자 정보를 조회하는 데 실패했습니다.' });
//     }
// });


// GET 요청을 통해 특정 사용자의 하루 투자 정보를 조회하는 라우터
router.get('/daily/:date', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const selectedDate = req.params.date; // URL의 경로 파라미터로부터 날짜를 추출합니다.

        // DailyInvestment 모델을 사용하여 현재 사용자의 선택된 날짜의 하루 투자 정보를 조회합니다.
        let userDailyInvestments = await DailyInvestment.findAll({
            where: {
                user_id: userId,
                activityDate: selectedDate
            }
        });

        // 요청에서 전달된 정보와 일치하는 항목을 찾아 투자 정보를 수정합니다.
        for (let investment of userDailyInvestments) {
            // 조회된 투자 정보의 카테고리와 활동 날짜를 기반으로 요청에서 전달된 정보와 일치하는 항목을 찾습니다.
            if (investment.category === req.body.category && investment.activityDate === req.body.activityDate) {
                // 요청에서 전달된 정보로 투자 시간을 갱신합니다.
                investment.hours = Math.floor(req.body.totalMinutes / 60);
                investment.minutes = req.body.totalMinutes % 60;
                // 변경된 값을 데이터베이스에 저장합니다.
                await investment.save();
            }
        }

        // 수정된 정보를 다시 조회합니다.
        userDailyInvestments = await DailyInvestment.findAll({
            where: {
                user_id: userId,
                activityDate: selectedDate
            }
        });

        res.status(200).json({ success: true, message: `특정 날짜(${selectedDate})의 사용자의 하루 투자 정보를 조회했습니다.`, data: userDailyInvestments });
    } catch (error) {
        console.error('Error fetching user daily investments:', error);
        res.status(500).json({ success: false, message: '특정 날짜의 사용자의 하루 투자 정보를 조회하는 데 실패했습니다.' });
    }
});



module.exports = router;
