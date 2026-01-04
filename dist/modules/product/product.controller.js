import { ok } from "../../utils/http.js";
export class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    // GET /api/products
    list = async (req, res) => {
        const query = {};
        if (req.query.q)
            query.q = req.query.q;
        if (req.query.category)
            query.category = req.query.category;
        if (req.query.tags) {
            query.tags = Array.isArray(req.query.tags)
                ? req.query.tags
                : [req.query.tags];
        }
        if (req.query.status)
            query.status = req.query.status;
        if (req.query.minPrice)
            query.minPrice = Number(req.query.minPrice);
        if (req.query.maxPrice)
            query.maxPrice = Number(req.query.maxPrice);
        if (req.query.sort)
            query.sort = req.query.sort;
        if (req.query.page)
            query.page = Number(req.query.page);
        if (req.query.limit)
            query.limit = Number(req.query.limit);
        const result = await this.productService.list(query);
        res.json(ok(result));
    };
    // GET /api/products/:id
    getById = async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: { message: "Missing product ID" } });
            return;
        }
        const product = await this.productService.findById(id);
        res.json(ok(product));
    };
    // POST /api/products
    create = async (req, res) => {
        const { sku, title, description, price, currency, category, tags, status } = req.body;
        const product = await this.productService.create({
            sku,
            title,
            description,
            price,
            currency,
            category,
            tags,
            status,
        });
        res.status(201).json(ok(product));
    };
    // PUT /api/products/:id
    update = async (req, res) => {
        const { id } = req.params;
        const { title, description, price, currency, category, tags, status } = req.body;
        if (!id) {
            res.status(400).json({ error: { message: "Missing product ID" } });
            return;
        }
        const product = await this.productService.updateById(id, {
            title,
            description,
            price,
            currency,
            category,
            tags,
            status,
        });
        res.json(ok(product));
    };
    // DELETE /api/products/:id
    delete = async (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: { message: "Missing product ID" } });
            return;
        }
        const result = await this.productService.deleteById(id);
        res.json(ok(result));
    };
}
//# sourceMappingURL=product.controller.js.map