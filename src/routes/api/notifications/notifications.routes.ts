import Router from "express";
import { authMiddleware } from "@/utils/auth";
import { getNotificationsController } from "@/controllers/notificationsController/notifications.controller";

const router = Router();

router.get("/", authMiddleware("user"), getNotificationsController);

export default router;