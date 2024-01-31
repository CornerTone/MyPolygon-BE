const Element = require('../models/element');
const { sequelize } = require('../models');

const express = require('express');
const router = express.Router();

router.get('/create', async (req, res) => {
    try {
        await sequelize.sync();

        // 데이터베이스에 element 모두 생성 
        await Element.bulkCreate([
          { name: '학업', questions: ["학업 질문 1", "학업 질문 2", "학업 질문 3", "학업 질문 4", "학업 질문 5", "학업 질문 6", "학업 질문 7"], score: 0, time: 0 },
          { name: '여가', questions: ["여가 질문 1", "여가 질문 2", "여가 질문 3", "여가 질문 4", "여가 질문 5", "여가 질문 6", "여가 질문 7"], score: 0, time: 0 },
          { name: '건강', questions: ["건강 질문 1", "건강 질문 2", "건강 질문 3", "건강 질문 4", "건강 질문 5", "건강 질문 6", "건강 질문 7"], score: 0, time: 0 },
          { name: '인간관계', questions: ["인간관계 질문 1", "인간관계 질문 2", "인간관계 질문 3", "인간관계 질문 4", "인간관계 질문 5", "인간관계 질문 6", "인간관계 질문 7"], score: 0, time: 0 },
          { name: '경제', questions: ["경제 질문 1", "경제 질문 2", "경제 질문 3", "경제 질문 4", "경제 질문 5", "경제 질문 6", "경제 질문 7"], score: 0, time: 0 }
        ]);
        
        res.json({ success: true, message: 'Elements 생성 완료' });
      } catch (error) {
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message }` });
      }
    });


module.exports = router;