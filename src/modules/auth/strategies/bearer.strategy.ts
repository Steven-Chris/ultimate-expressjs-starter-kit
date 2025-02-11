import { Strategy } from "passport-http-bearer";
import { sessionService } from "../session.service";
import passport from "passport";
import { redisService } from "@/src/common/providers/cache/redis";

export const setupBearerStrategy = async () => {
  passport.use(
    "bearer",
    new Strategy(async (token, done) => {
      try {
        // -- get token from cache if it's already cached
        const cachedSessionKey = `sessions:${token}`;
        const cachedSession = await redisService.get(cachedSessionKey);
        if (cachedSession) {
          return done(null, cachedSession.account, { scope: "all" });
        }

        // -- get session by token
        const session = await sessionService.findByToken({ token });

        // -- verify if it expired
        const isExpired = await sessionService.isExpired({ token });

        if (isExpired) {
          return done(null, false);
        }

        // -- cache session for 1 hour
        await redisService.set(cachedSessionKey, session, 60 * 60 * 1);

        // ----------------------------
        // Return user
        // ----------------------------
        return done(null, session.account, { scope: "all" });
      } catch (err) {
        return done(null, false);
      }
    })
  );
};
