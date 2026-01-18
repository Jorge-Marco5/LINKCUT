import Router from "express";
import { registerController, loginController, changePasswordController, logoutController } from "@/controllers/auth/auth.controller";
import { logginValidator, registerValidator, changePasswordValidator } from "@/utils/validator";
import { authMiddleware } from "@/utils/auth";

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});
router.post("/signup", registerValidator, registerController);
router.post("/login", logginValidator, loginController);
router.get("/logout", authMiddleware("user"), logoutController);
router.post("/change-password", changePasswordValidator, changePasswordController);

export default router;