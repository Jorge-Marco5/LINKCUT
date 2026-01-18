import Router from "express";
import { getLinksController, postLinksController, deleteLinksController, getStatsController } from "@/controllers/linksControllers/links.controller";
import { idValidator, shortUrlValidator, urlValidator } from "@/utils/validator";
import { authMiddleware } from "@/utils/auth";

const router = Router();

router.get("/", authMiddleware("user"), getLinksController);
router.post("/", authMiddleware("user"), urlValidator, postLinksController);
router.delete("/:id", authMiddleware("user"), idValidator, deleteLinksController);

router.get("/stats/:id", authMiddleware("user"), idValidator, getStatsController);

export default router;