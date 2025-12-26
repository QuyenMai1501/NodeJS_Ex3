import type { NextFunction, Request, Response } from "express";
export type AuthUser = {
    userId: string;
    role: "customer" | "admin";
};
declare global {
    namespace Express {
        interface Request {
            auth?: AuthUser;
        }
    }
}
export declare function requiredAuth(req: Request, _res: Response, next: NextFunction): void;
export declare function requiredRole(role: "admin" | "customer"): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map