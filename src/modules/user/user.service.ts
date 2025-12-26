import { hashPassword } from "../../utils/crypto.js";
import { ApiError } from "../../utils/http.js";
import type { UserDatabase, UserEntity } from "./user.database.js";
import type { UserDoc, UserRole } from "./user.model.js";

export class UserService {
    constructor(private readonly userDb: UserDatabase) { }
    async list() {
        return this.userDb.list();
    }

    async register(input: { email: string; password: string; role?: UserRole }): Promise<UserEntity> {
        const email = input.email.trim().toLowerCase();
        if (!email.includes("@")) throw new ApiError(400, { message: "Invalid Email" });

        if (input.password.length < 6) throw new ApiError(400, { message: "Password must be higher then 6 characters" });

        // btvn: bắt lỗi ký tự đặc biệt & chữ viết hoa
        const hasUpperCase = /[A-Z]/.test(input.password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_]/.test(input.password);
        if (!hasUpperCase) throw new ApiError(400, { message: "Password must contain at least one uppercase letter" });
        if (!hasSpecialChar) throw new ApiError(400, { message: "Password must contain at least one special character" });

        // bắt lỗi trùng
        const existed = await this.userDb.findByEmail(email);
        if (existed) throw new ApiError(409, { message: "Email already exists" });

        const now = new Date();

        const passwordHash = await hashPassword(input.password);

        const role: UserRole = input.role || "customer";

        return this.userDb.create({
            email,
            passwordHash,
            role,
            createdAt: now,
            updatedAt: now,
        });
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.userDb.findByEmail(email.trim().toLowerCase());
    }

    async findById(id: string): Promise<UserEntity | null> {
        const user = await this.userDb.findById(id);
        if (!user) throw new ApiError(404, { message: "User not found" });
        return user;
    }

    async updateById(id: string, input: Partial<{ email: string; password: string; role: UserRole }>): Promise<UserEntity> {
        const updateData: Partial<UserDoc> = {};

        if (input.email) {
            const email = input.email.trim().toLowerCase();
            if (!email.includes("@")) throw new ApiError(400, { message: "Invalid Email" });

            const existed = await this.userDb.findByEmail(email);
            if (existed && existed._id.toString() !== id) {
                throw new ApiError(409, { message: "Email already exists" });
            }
            updateData.email = email;
        }

        if (input.password) {
            if (input.password.length < 6) throw new ApiError(400, { message: "Password must be higher then 6 characters" });

            const hasUpperCase = /[A-Z]/.test(input.password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_]/.test(input.password);

            if (!hasUpperCase) throw new ApiError(400, { message: "Password must contain at least one uppercase letter" });
            if (!hasSpecialChar) throw new ApiError(400, { message: "Password must contain at least one special character" });

            updateData.passwordHash = await hashPassword(input.password);
        }

        if (input.role) {
            updateData.role = input.role;
        }

        const updated = await this.userDb.updateById(id, updateData);
        if (!updated) throw new ApiError(404, { message: "User not found" });

        return updated;
    }

    async deleteById(id: string): Promise<void> {
        const deleted = await this.userDb.deleteById(id);
        if (!deleted) throw new ApiError(404, { message: "User not found" });
    }
}