import Router from "express";
import { loginController, signupController, changepasswordController } from "@/controllers/web/web.controller";

const router = Router();

router.get("/login", loginController);
router.get("/signup", signupController);
router.get("/changepassword", changepasswordController);

export default router;