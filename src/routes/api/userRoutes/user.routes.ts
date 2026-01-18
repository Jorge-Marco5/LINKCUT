import { Router } from "express";
import { createUserController, deleteUserController, getUserController, getUsersController } from "@/controllers/userControllers/user.controller";

const router = Router();

router.get("/", getUsersController);
router.get("/:id", getUserController);
router.post("/", createUserController);
router.delete("/:id", deleteUserController);

export default router;