import { ObjectId } from "mongodb";
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
export type ProductEntity = ProductDoc & {
    _id: ObjectId;
};
export declare class ProductDatabase {
    private col;
    create(doc: ProductDoc): Promise<ProductEntity>;
    updatedById(id: string, update: Partial<ProductDoc>): Promise<boolean>;
    findById(id: string): Promise<ProductEntity | null>;
    deleteById(id: string): Promise<boolean>;
    list(query: ProductListQuery): Promise<{
        products: ProductEntity[];
        total: number;
    }>;
}
//# sourceMappingURL=product.database.d.ts.map