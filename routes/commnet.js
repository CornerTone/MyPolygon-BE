const Complement = require('../models/compliment');

const auth = require('../middleware/auth');
const Community = require('../models/community');
const Element = require('../models/element');
const User = require('../models/user');
const Comment = require('../models/comment')

const express = require('express');
const router = express.Router();

router.post('/create/:id', auth, async(req, res) => {
    const communityId = req.params.id;
    const { content } = req.body;
    const user = req.user;

    try {
        // 해당 커뮤니티 가져오기
        const community = await Community.findByPk(communityId);
        if (!community) {
            return res.status(404).json({ success: false, message: '해당 커뮤니티를 찾을 수 없습니다.' });
        }

        // 댓글 생성
        const comment = await Comment.create({
            content: content,
            CommunityId: communityId, // 댓글이 속하는 커뮤니티 ID 설정
            UserId: user.id // 댓글을 작성한 사용자 ID 설정
        });

        // 댓글을 커뮤니티에 연결
     await comment.setCommunity(community);

        return res.status(201).json({ success: true, message: '댓글이 성공적으로 작성되었습니다.', comment: comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }

})

router.get('/read/:id', auth, async (req, res) => {
    const communityId = req.params.id;

    try {
        // 해당 커뮤니티 가져오기
        const community = await Community.findByPk(communityId, {
            include: [{ model: Comment, as: 'community_comments' }] // 별칭을 지정해야 함!
        });

        if (!community) {
            return res.status(404).json({ success: false, message: '해당 커뮤니티를 찾을 수 없습니다.' });
        }

        return res.status(200).json({ success: true, community:community });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: `서버 오류 발생 ${error.message}` });
    }
});


module.exports = router;