import Router from "express";
import { getLinksController, getLinkController, postLinksController, deleteLinksController, getStatsController, getStatsLocationsController, toggleLinkStatusController } from "@/controllers/linksControllers/links.controller";
import { idValidator, shortUrlValidator, urlValidator } from "@/utils/validator";
import { authMiddleware } from "@/utils/auth";

const router = Router();

router.get("/", authMiddleware("user"), getLinksController);
router.get("/:id", authMiddleware("user"), idValidator, getLinkController);
router.post("/", authMiddleware("user"), urlValidator, postLinksController);
router.delete("/:id", authMiddleware("user"), idValidator, deleteLinksController);

router.patch("/:id/toggle", authMiddleware("user"), idValidator, toggleLinkStatusController);
router.get("/stats/:id", authMiddleware("user"), idValidator, getStatsController);
router.get("/stats/locations/:id", authMiddleware("user"), idValidator, getStatsLocationsController);

export default router;