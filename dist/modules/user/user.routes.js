import { Router } from "express";
import { UserDatabase } from "./user.database.js";
import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";
const router = Router();
const db = new UserDatabase();
const service = new UserService(db);
const controller = new UserController(service);
router.get("/", controller.list);
router.post("/", controller.register);
// GET One By Email (query parameter: ?email=xxx)
router.get("/search", controller.getByEmail);
// GET One By ObjectId
router.get("/:id", controller.getById);
// PUT One By ObjectId
router.put("/:id", controller.updateById);
// DELETE One By ObjectId
router.delete("/:id", controller.deleteById);
export const userRouters = router;
//# sourceMappingURL=user.routes.js.map