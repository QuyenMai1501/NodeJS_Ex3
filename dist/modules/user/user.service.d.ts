import type { UserDatabase, UserEntity } from "./user.database.js";
import type { UserDoc, UserRole } from "./user.model.js";
export declare class UserService {
    private readonly userDb;
    constructor(userDb: UserDatabase);
    list(): Promise<(UserDoc & {
        _id: import("bson").ObjectId;
    })[]>;
    register(input: {
        email: string;
        password: string;
        role?: UserRole;
    }): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    updateById(id: string, input: Partial<{
        email: string;
        password: string;
        role: UserRole;
    }>): Promise<UserEntity>;
    deleteById(id: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map