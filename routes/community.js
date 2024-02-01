const Complement = require('../models/compliment');

const auth = require('../middleware/auth');
const Community = require('../models/community');
const Element = require('../models/element');
const User = require('../models/user');

const express = require('express');
const router = express.Router();

// 커뮤니티 글 작성 
router.post('/create', auth, async(req, res) => {
    const { categoryId, content } = req.body;

    try {
        const category = await Element.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ success: false, message: "카테고리를 찾을 수 없습니다."});
        }

       const user = req.user;

        // 커뮤니티 글 생성
        const createCommunity = await Community.create({
            content: content
        });

        // 커뮤니티 글과 카테고리 연결
        await createCommunity.addCategory(category);

        // 커뮤니티 글과 유저 연결 
        await user.addCommunity(createCommunity);

        return res.status(201).json({ success: true, message: "성공적으로 글이 등록되었습니다."});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message }`});
    }

})

// 카테고리 별 커뮤니티 조회
router.get('/read-category/:id', auth, async (req, res) => {
    const categoryId = req.params.id;
    try {
        // 카테고리에 해당하는 커뮤니티 글 조회
        const communities = await Community.findAll({
            attributes: ['id', 'content', 'UserId'], // id, content, UserId 속성만 선택
            include: [
                {
                    model: Element,
                    as: 'categories',
                    through: { attributes: [] },
                    where: { id: categoryId },
                    attributes: [] // 카테고리 정보를 선택 안되도록 
                }
            ]
        });

        if (!communities || communities.length === 0) {
            return res.status(404).json({ success: false, message: '해당 카테고리에 글이 없습니다.' });
        }

        return res.status(200).json({ success: true, categoryId: (parseInt)(categoryId), communities: communities, });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }
});





module.exports = router;