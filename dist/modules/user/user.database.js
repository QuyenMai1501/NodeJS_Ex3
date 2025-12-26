import { ObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
export class UserDatabase {
    col() {
        return getDb().collection("users");
    }
    async list() {
        return this.col().find({}).limit(50).toArray();
    }
    async findByEmail(email) {
        return this.col().findOne({ email });
    }
    async findById(id) {
        return this.col().findOne({ _id: new ObjectId(id) });
    }
    async create(doc) {
        const res = await this.col().insertOne(doc);
        return { ...doc, _id: res.insertedId };
    }
    async insertMany(docs) {
        if (docs.length === 0)
            return [];
        const res = await this.col().insertMany(docs);
        return docs.map((doc, index) => {
            const insertedId = res.insertedIds[index];
            if (!insertedId) {
                throw new Error(`Failed to insert document at index ${index}`);
            }
            return {
                ...doc,
                _id: insertedId,
            };
        });
    }
    async updateById(id, update) {
        const res = await this.col().findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...update, updatedAt: new Date() } }, { returnDocument: "after" });
        return res;
    }
    async deleteById(id) {
        const res = await this.col().deleteOne({ _id: new ObjectId(id) });
        return res.deletedCount > 0;
    }
}
//# sourceMappingURL=user.database.js.map