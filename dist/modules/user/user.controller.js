import { ok } from "../../utils/http.js";
export class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    list = async (_req, res) => {
        const users = await this.userService.list();
        res.json({ data: users });
    };
    // POST Register
    register = async (req, res) => {
        const { email, password, role } = req.body;
        const user = await this.userService.register({ email, password, role });
        res.status(201).json(ok({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    };
    // GET One By Email & GET One By ObjectId
    getByEmail = async (req, res) => {
        const { email } = req.query;
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ message: "Email query parameter is required" });
        }
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(ok({
            email: user.email,
        }));
    };
    getById = async (req, res) => {
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
    updateById = async (req, res) => {
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
    deleteById = async (req, res) => {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required" });
        }
        await this.userService.deleteById(id);
        res.status(204).send();
    };
}
//# sourceMappingURL=user.controller.js.map