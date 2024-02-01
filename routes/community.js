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
    const category = await Element.findByPk(categoryId);
    try {
        // 카테고리에 해당하는 커뮤니티 글 조회
        const communities = await Community.findAll({
            attributes: ['id', 'content', 'UserId'], // id, content, UserId 속성만 선택
            include: [
                {
                    model: Element,
                    as: 'categories',
                    through: { attributes: [] },
                    where: { id: category.id },
                    attributes: [] 
                }
            ]
        });

        if (!communities || communities.length === 0) {
            return res.status(404).json({ success: false, message: '해당 카테고리에 글이 없습니다.' });
        }

        return res.status(200).json({ success: true, categoryId:category.id , categoryName: category.name, communities: communities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }
});

// 전체 커뮤니티 조회
router.get('/read-category', auth, async (req, res) => {
    try {
        // 카테고리에 해당하는 커뮤니티 글 조회
        const communities = await Community.findAll({
            include: [
                {
                    model: Element,
                    as: 'categories',
                    attributes: ['id'], // 카테고리의 id만 선택
                    through: { attributes: [] }
                }
            ]
        });

        if (!communities || communities.length === 0) {
            return res.status(404).json({ success: false, message: '커뮤니티에 글이 없습니다.' });
        }

        return res.status(200).json({ success: true, communities: communities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }
});

// 커뮤니티 글 상세조회
router.get('/read-detail/:id', auth, async (req, res) => {
    const communityId = req.params.id;
    const communityDetail = await Community.findByPk(communityId, {
        include: [
            {
                model: Element,
                as: 'categories',
                attributes: ['id'] // 카테고리의 id만 선택
                ,through: { attributes: [] }
            }
        ]
    });
    try {

        return res.status(200).json({ success: true, community:communityDetail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }
});

// 커뮤니티 글 수정
router.put('/update/:id', auth, async (req, res) => {
    try {
        const { content, category } = req.body;
        const user = req.user;
        const communityId = req.params.id;
        // id에 해당하는 커뮤니티 글 가져옴 
        const userCommunity = await Community.findByPk(communityId);

        // 수정 
        userCommunity.content = content;
        // 카테고리 수정
        await userCommunity.setCategories(category);
        userCommunity.save();
        res.json({ success: true, message: "커뮤니티 글이 성공적으로 수정되었습니다" });

    } catch (error) {
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }
});

// 커뮤니티 글 삭제
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const { content, category } = req.body;
        const user = req.user;
        const communityId = req.params.id;
        // id에 해당하는 커뮤니티 글 가져옴 
        const userCommunity = await Community.findByPk(communityId);
        
        // 삭제
        userCommunity.destroy();

        res.json({ success: true, message: "커뮤니티 글이 성공적으로 삭제되었습니다"});

    } catch (error) {
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }
});

module.exports = router;
