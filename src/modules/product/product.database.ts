import { ObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
import type { ProductDoc } from "./product.model.js";

export type ProductListQuery = {
    q?: string;
    category?: string;
    tags?: string[];
    status?: "active" | "inactive";
    minPrice?: number;
    maxPrice?: number;

    sort?: "newest" | "price_asc" | "price_desc";
    page?: number;
    limit?: number;
};

export type ProductEntity = ProductDoc & { _id: ObjectId };

export class ProductDatabase {
    private col() {
        return getDb().collection<ProductDoc>("products");
    }

    async create(doc: ProductDoc): Promise<ProductEntity> {
        const result = await this.col().insertOne(doc);
        return { ...doc, _id: result.insertedId };
    } // role admin

    async updatedById(id: string, update: Partial<ProductDoc>): Promise<boolean> {
        const result = await this.col().updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...update, updateAt: new Date() } }
        );
        return result.modifiedCount > 0;
    } // role admin

    async findById(id: string): Promise<ProductEntity | null> {
        return this.col().findOne({ _id: new ObjectId(id) }) as Promise<ProductEntity | null>;
    } //any

    async deleteById(id: string): Promise<boolean> {
        const result = await this.col().deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    } // role admin
    async list(query: ProductListQuery): Promise<{ products: ProductEntity[]; total: number }> {
        const filter: any = {};

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
            if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
            if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
        }

        // Sorting
        let sort: any = {createAt: -1};
        if (query.sort === "price_asc") sort = { price: 1 };
        if (query.sort === "price_desc") sort = { price: -1 };

        // Pagination
        const page = query.page && query.page > 0 ? query.page : 1;
        const limit = query.limit && query.limit > 0 ? query.limit : 10;
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            this.col().find(filter).sort(sort).skip(skip).limit(limit).toArray() as Promise<ProductEntity[]>,
            this.col().countDocuments(filter),
        ]);

        return { products, total };
    } //any
}