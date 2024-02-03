const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // bcrypt 가져오기 추가
const auth = require('../middleware/auth');
const request = require('supertest');
const authRouter = require('./auth');
const express = require('express');
const app=require('../app')

const { sequelize } = require('../models');


// 테스트 전 데이터베이스 초기화
beforeAll(async () => {
    await sequelize.sync({ force: true }); // 데이터베이스 초기화
});

// 테스트 후 데이터베이스 정리
afterAll(async () => {
    await sequelize.close(); // 데이터베이스 연결 닫기
});


describe('회원가입 진행', () => {
    it('새로운 유저 정상적으로 생성되어야 함', async () => {
        userNickName = "eunseo";
        userPhoneNumber = "01012345678";
        userPassword = "1234";
        userPassword2 = "1234";

        const user = {
            id: 1,
            nickname: userNickName,
            phone_number: userPhoneNumber,
            password: await bcrypt.hash(userPassword, 12)
        }

        const req = { body : {
            nickname: userNickName,
                phone_number: userPhoneNumber,
                password: userPassword,
                password2: userPassword2
        }}


        // 요청
        const response = await request("http://localhost:3001") // authRouter로 요청
            .post('/api/auth/join') // authRouter에는 '/api/auth'가 이미 설정되어 있으므로 '/join'만 지정하면 됩니다.
            .send({
                nickname: userNickName,
                phone_number: userPhoneNumber,
                password: userPassword,
                password2: userPassword2
            });

        //console.log("err => "+response.error.message);
        console.log("here'");
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("회원가입 성공");
    })
});

