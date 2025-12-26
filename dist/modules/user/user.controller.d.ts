import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    list: (_req: Request, res: Response) => Promise<void>;
    register: (req: Request, res: Response) => Promise<void>;
    getByEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    updateById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=user.controller.d.ts.map