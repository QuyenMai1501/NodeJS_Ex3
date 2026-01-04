import type { Request, Response } from "express";
import type { ProductService } from "./product.service.js";
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    list: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=product.controller.d.ts.map