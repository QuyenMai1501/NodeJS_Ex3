import type { ProductDatabase, ProductListQuery } from "./product.database.js";
import type { ProductStatus } from "./product.model.js";
export type CreateProductInput = {
    sku: string;
    title: string;
    description: string;
    price: number;
    currency: "USD" | "VND";
    category: string;
    tags: string[];
    status?: ProductStatus;
};
export type UpdateProductInput = {
    title?: string;
    description?: string;
    price?: number;
    currency?: "USD" | "VND";
    category?: string;
    tags?: string[];
    status?: ProductStatus;
};
export declare class ProductService {
    private readonly productDb;
    constructor(productDb: ProductDatabase);
    create(input: CreateProductInput): Promise<import("./product.database.js").ProductEntity>;
    updateById(id: string, input: UpdateProductInput): Promise<import("./product.database.js").ProductEntity | null>;
    findById(id: string): Promise<import("./product.database.js").ProductEntity>;
    deleteById(id: string): Promise<{
        deleted: boolean;
    }>;
    list(query: ProductListQuery): Promise<{
        products: import("./product.database.js").ProductEntity[];
        total: number;
    }>;
}
//# sourceMappingURL=product.service.d.ts.map