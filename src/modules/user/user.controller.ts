import type { Request, Response } from "express";
import type { UserService } from "./user.service.js";
import { ok } from "../../utils/http.js";

export class UserController {
    constructor(private readonly userService: UserService) { }

    list = async (_req: Request, res: Response) => {
        const users = await this.userService.list();
        res.json({ data: users });
    };

    // POST Register
    register = async (req: Request, res: Response) => {
        const { email, password, role } = req.body;

        const user = await this.userService.register({ email, password, role });

        res.status(201).json(ok({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    }

    // GET One By Email & GET One By ObjectId
    getByEmail = async (req: Request, res: Response) => {
        const { email } = req.query;
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ message: "Email query parameter is required" });
        }

        const user = await this.userService.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(ok({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    };

    getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }

        const user = await this.userService.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(ok({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    };

    // PUT One By ObjectId
    updateById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { email, password, role } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }

        const user = await this.userService.updateById(id, { email, password, role });

        res.json(ok({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    };

    // DELETE One By ObjectId
    deleteById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }

        await this.userService.deleteById(id);

        res.status(204).send();
    };
}