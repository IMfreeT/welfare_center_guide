const { Naver } = require("../config/dotenv.config");
const { userService } = require("../config/service_init.config");
const TokenService = require("../services/token.service");

const NaverStrategy = require("passport-naver").Strategy;
const LocalStrategy = require("passport-local").Strategy;
//������ �ٷ� done �ϴ°� �ƴ϶� db ���� �������ش�. ���񽺿� ���� ����
module.exports = {
  local: new LocalStrategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        /**
         * username and password aren't use
         * req�� ���� ���� ������ �ް�, �� ������ ����
         * ���� �� ������ �Ϸ�Ǿ��ٸ� �α������Ѵ�.
         *
         */
        const { refreshToken, u_name, u_email, u_provider, u_provider_id } =
          req.body;

        //TODO: valid�� refresh token���� Ȯ���ؾ��ϴ� �۾� �߰� �Ǿ����.

        const user = await userService.existUser(u_email);
        //refreshToken �� �׽�
        if (user) {
          TokenService.updateRefreshToken(user.u_id, refreshToken);
          return done(null, user);
        }
        if (
          await userService.registerUser({
            u_name: u_name,
            u_email: u_email,
            u_provider: u_provider,
            u_provider_id: u_provider_id,
          })
        ) {
          const user = await userService.existUser(u_email);
          TokenService.createRefreshToken(user.u_id, refreshToken);
          return done(null, user);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  ),
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
