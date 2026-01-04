import { ObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
export class ProductDatabase {
    col() {
        return getDb().collection("products");
    }
    async create(doc) {
        const result = await this.col().insertOne(doc);
        return { ...doc, _id: result.insertedId };
    } // role admin
    async updatedById(id, update) {
        const result = await this.col().updateOne({ _id: new ObjectId(id) }, { $set: { ...update, updateAt: new Date() } });
        return result.modifiedCount > 0;
    } // role admin
    async findById(id) {
        return this.col().findOne({ _id: new ObjectId(id) });
    } //any
    async deleteById(id) {
        const result = await this.col().deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    } // role admin
    async list(query) {
        const filter = {};
        if (query.q) {
            filter.$or = [
                { title: { $regex: query.q, $options: "i" } },
                { description: { $regex: query.q, $options: "i" } },
                { sku: { $regex: query.q, $options: "i" } },
            ];
        }
        // Category filter
        if (query.category) {
            filter.category = query.category;
        }
        // Tags filter
        if (query.tags && query.tags.length > 0) {
            filter.tags = { $in: query.tags };
        }
        // Status filter
        if (query.status) {
            filter.status = query.status;
        }
        // Price range filter
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            filter.price = {};
            if (query.minPrice !== undefined)
                filter.price.$gte = query.minPrice;
            if (query.maxPrice !== undefined)
                filter.price.$lte = query.maxPrice;
        }
        // Sorting
        let sort = { createAt: -1 };
        if (query.sort === "price_asc")
            sort = { price: 1 };
        if (query.sort === "price_desc")
            sort = { price: -1 };
        // Pagination
        const page = query.page && query.page > 0 ? query.page : 1;
        const limit = query.limit && query.limit > 0 ? query.limit : 10;
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            this.col().find(filter).sort(sort).skip(skip).limit(limit).toArray(),
            this.col().countDocuments(filter),
        ]);
        return { products, total };
    } //any
}
//# sourceMappingURL=product.database.js.map