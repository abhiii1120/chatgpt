import type { AccessTokenPayload } from "../../utils/jwt.js";

/**
 * This file adds a `user` field to Express's Request type.
 *
 * Normally, TypeScript doesn't know that `req` can have a `user`
 * property, because Express's own types don't define one. So writing
 * `req.user = payload` in our middleware causes a type error, even
 * though it works fine when the code actually runs.
 *
 * This file fixes that by telling TypeScript: "Request objects can
 * also have an optional `user` field." Once this file exists in the
 * project, `req.user` is allowed everywhere, with no more errors.
 */

declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload
        }
    }
}

export {}