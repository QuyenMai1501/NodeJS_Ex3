import { ObjectId } from "mongodb";
import type { UserDoc } from "./user.model.js";
export type UserEntity = UserDoc & {
    _id: ObjectId;
};
export declare class UserDatabase {
    private col;
    list(): Promise<Array<UserDoc & {
        _id: ObjectId;
    }>>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    create(doc: UserDoc): Promise<UserEntity>;
    insertMany(docs: UserDoc[]): Promise<UserEntity[]>;
    updateById(id: string, update: Partial<UserDoc>): Promise<UserEntity | null>;
    deleteById(id: string): Promise<boolean>;
}
//# sourceMappingURL=user.database.d.ts.map