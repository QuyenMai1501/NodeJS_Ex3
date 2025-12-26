import cookieParser from 'cookie-parser';
import express from 'express';
import { userRouters } from './modules/user/user.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
export function createApp() {
    const app = express();
    app.use(express.json({ limit: "10mb" }));
    app.use(cookieParser());
    // check server run or not
    app.get("/health", (_req, res) => res.json({ ok: true }));
    // User modules
    app.use("/api/users", userRouters);
    // Auth modules
    // app.use("/api/auth", userRouters);
    app.use(errorMiddleware);
    return app;
}
//# sourceMappingURL=app.js.map