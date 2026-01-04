import { Router } from "express";
import { ProductDatabase } from "./product.database.js";
import { ProductService } from "./product.service.js";
import { ProductController } from "./product.controller.js";
import { requiredAuth, requiredRole } from "../../middlewares/auth.middleware.js";

// ROUTES:
const router = Router();

const productDb = new ProductDatabase();
const service = new ProductService(productDb);
const controller = new ProductController(service);

router.get("/", controller.list);

router.get("/:id", controller.getById);

router.post("/", requiredAuth, requiredRole("admin"), controller.create);

router.put("/:id", requiredAuth, requiredRole("admin"), controller.update);

router.delete("/:id", requiredAuth, requiredRole("admin"), controller.delete);

export const productRoutes = router;