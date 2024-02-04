const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

// 테스트 전 데이터베이스 초기화
beforeAll(async () => {
    await sequelize.sync({ force: true }); 
});

// 테스트 후 데이터베이스 정리
afterAll(async () => {
    await sequelize.close(); 
});

describe('회원가입 진행', () => {
    it('새로운 유저 생성', async () => {
        userNickName = "eunseo";
        userPhoneNumber = "01012345678";
        userPassword = "1234";
        userPassword2 = "1234";

        // 요청
        const response = await request(app) // 요청 도메인
            .post('/api/auth/join') 
            .send({
                nickname: userNickName,
                phone_number: userPhoneNumber,
                password: userPassword,
                password2: userPassword2
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("회원가입 성공");
    });

    it("이미 존재하는 닉네임으로 회원가입 시도 시 실패", async () => {
        userNickName = "eunseo";
        userPhoneNumber = "01012345678";
        userPassword = "1234";
        userPassword2 = "1234";

        await request(app)
            .post('/api/auth/join') 
            .send({
                nickname: userNickName,
                phone_number: userPhoneNumber,
                password: userPassword,
                password2: userPassword2
            });

        // 2번째 요청
        const response = await request(app)
            .post('/api/auth/join') 
            .send({
                nickname: userNickName,
                phone_number: userPhoneNumber,
                password: userPassword,
                password2: userPassword2
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });
});

describe("로그인", () => {
    it('로그인 진행', async () => {
         // 요청
        await request(app)
            .post('/api/auth/join') 
            .send({
                nickname: userNickName,
                phone_number: userPhoneNumber,
                password: userPassword,
                password2: userPassword2
            });

        const response = await request(app)
            .post('/api/auth/login') 
            .send({
                nickname: userNickName,
                password: userPassword
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it("회원정보가 없는 유저가 로그인 시 에러", async () => {
        const response = await request(app) 
            .post('/api/auth/login') 
            .send({
                nickname: "whoareyou",
                password: userPassword
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });
});

/*
describe("로그아웃", () => {
    it('로그아웃 진행', async () => {

        await request("http://localhost:3001") // 회원가입
         .post('/api/auth/join') 
         .send({
             nickname: userNickName,
             phone_number: userPhoneNumber,
             password: userPassword,
             password2: userPassword2
         });

     await request("http://localhost:3001") // 로그인
     .post('/api/auth/login') 
     .send({
         nickname: userNickName,
         password: userPassword
     });
    
        const response= await request("http://localhost:3001") // 로그아웃
         .get('/api/auth/logout');

     expect(response.statusCode).toBe(200);
     expect(response.body.success).toBe(true);
     // expect(response.body.message).toBe("회원가입 성공");
    });
})*/