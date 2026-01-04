import { ApiError } from "../../utils/http.js";
export class ProductService {
    productDb;
    constructor(productDb) {
        this.productDb = productDb;
    }
    async create(input) {
        const existing = await this.productDb.list({ q: input.sku, limit: 1 });
        if (existing.products.some((p) => p.sku === input.sku)) {
            throw new ApiError(400, { message: "SKU already exists" });
        }
        if (input.price <= 0) {
            throw new ApiError(400, { message: "Price must be greater than zero" });
        }
        const now = new Date();
        const doc = {
            sku: input.sku.trim(),
            title: input.title.trim(),
            description: input.description.trim(),
            price: input.price,
            currency: input.currency,
            category: input.category.trim(),
            tags: input.tags.map((t) => t.trim()),
            status: input.status || "active",
            createAt: now,
            updateAt: now,
        };
        const product = await this.productDb.create(doc);
        return product;
    }
    async updateById(id, input) {
        const product = await this.productDb.findById(id);
        if (!product) {
            throw new ApiError(404, { message: "Product not found" });
        }
        if (input.price !== undefined && input.price <= 0) {
            throw new ApiError(400, { message: "Price must be greater than zero" });
        }
        const update = {};
        if (input.title !== undefined)
            update.title = input.title.trim();
        if (input.description !== undefined)
            update.description = input.description.trim();
        if (input.price !== undefined)
            update.price = input.price;
        if (input.currency !== undefined)
            update.currency = input.currency;
        if (input.category !== undefined)
            update.category = input.category.trim();
        if (input.tags !== undefined)
            update.tags = input.tags.map((t) => t.trim());
        if (input.status !== undefined)
            update.status = input.status;
        const updated = await this.productDb.updatedById(id, update);
        if (!updated) {
            throw new ApiError(500, { message: "Failed to update product" });
        }
        return await this.productDb.findById(id);
    }
    async findById(id) {
        const product = await this.productDb.findById(id);
        if (!product) {
            throw new ApiError(404, { message: "Product not found" });
        }
        return product;
    }
    async deleteById(id) {
        const product = await this.productDb.findById(id);
        if (!product) {
            throw new ApiError(404, { message: "Product not found" });
        }
        const deleted = await this.productDb.deleteById(id);
        if (!deleted) {
            throw new ApiError(500, { message: "Failed to delete product" });
        }
        return { deleted: true };
    }
    async list(query) {
        const result = await this.productDb.list(query);
        return result;
    }
}
//# sourceMappingURL=product.service.js.map