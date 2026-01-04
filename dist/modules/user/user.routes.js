import { Router } from "express";
import { UserDatabase } from "./user.database.js";
import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";
import { requiredAuth, requiredRole } from "../../middlewares/auth.middleware.js";
const router = Router();
const db = new UserDatabase();
const service = new UserService(db);
const controller = new UserController(service);
router.get("/", requiredAuth, requiredRole("admin"), controller.list);
router.post("/register", controller.register);
// GET One By Email (query parameter: ?email=xxx)
router.get("/search", controller.getByEmail);
// GET One By ObjectId
router.get("/:id", requiredAuth, controller.getById);
// PUT One By ObjectId
router.put("/:id", requiredAuth, controller.updateById);
// DELETE One By ObjectId
router.delete("/:id", requiredAuth, controller.deleteById);
export const userRouters = router;
//# sourceMappingURL=user.routes.js.map