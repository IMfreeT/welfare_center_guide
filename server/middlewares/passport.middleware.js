const { Naver } = require("../config/dotenv.config");
const { userService } = require("../config/service_init.config");
const TokenService = require("../services/token.service");

const NaverStrategy = require("passport-naver").Strategy;
const LocalStrategy = require("passport-local").Strategy;
//������ �ٷ� done �ϴ°� �ƴ϶� db ���� �������ش�. ���񽺿� ���� ����
module.exports = {
  naver: new NaverStrategy(
    {
      clientID: Naver.NaverClientID,
      clientSecret: Naver.NaverClientSecret,
      callbackURL: "http://localhost:8080/api/auth/naver-login/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // �߰� �ʿ�
        //�����ϳ�?
        //�����ϸ� --> �α���
        //������ϸ� ��� �� �α���
        const user = await userService.existUser(profile._json.email);
        if (user) return done(null, user);
        if (
          await userService.registerUser({
            u_name: profile.displayName,
            u_email: profile._json.email,
            u_provider: profile.provider,
            u_provider_id: profile.id,
          })
        )
          console.log("a");
        return done(null, {
          u_name: profile.displayName,
          u_email: profile._json.email,
          u_provider: profile.provider,
          u_provider_id: profile.id,
        });
      } catch (err) {
        return done(err, null);
      }
    }
  ),
};
