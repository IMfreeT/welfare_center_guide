const GoogleStrategy = require("passport-google-oauth20").Strategy;
const NaverStrategy = require("passport-naver").Strategy;
const KakaoStrategy = require("passport-kakao").Strategy;
const dotenv = require("dotenv").config();
//������ �ٷ� done �ϴ°� �ƴ϶� db ���� �������ش�. ���񽺿� ���� ����
module.exports = {
  naver: new NaverStrategy(
    {
      clientID: process.env.NaverClientID,
      clientSecret: process.env.NaverClientSecret,
      callbackURL: "http://43.201.112.233:8000/api/auth/naver-login/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      return done(null, {
        email: profile._json.email,
        nick: profile._json.email,
      });
    }
  ),
};
