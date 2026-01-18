import Router from "express";
import { getLinksController, postLinksController, deleteLinksController, getStatsController } from "@/controllers/linksControllers/links.controller";

const router = Router();

router.get("/", getLinksController);
router.post("/", postLinksController);
router.delete("/:id", deleteLinksController);

router.get("/stats/:id", getStatsController);

export default router;