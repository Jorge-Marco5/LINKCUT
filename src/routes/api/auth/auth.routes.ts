import Router from "express";
import { registerController, loginController, changePasswordController, logoutController } from "@/controllers/auth/auth.controller";

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});
router.post("/signup", registerController);
router.post("/login", loginController);
router.get("/logout", logoutController);
router.post("/change-password", changePasswordController);

export default router;