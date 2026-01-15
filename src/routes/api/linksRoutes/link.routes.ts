import Router from "express";
import { getLinksController, postLinksController, deleteLinksController, getStatusController } from "@/controllers/linksControllers/links.controller";

const router = Router();

router.get("/", getLinksController);
router.post("/", postLinksController);
router.delete("/:id", deleteLinksController);

router.get("/:shortUrl", getStatusController);

export default router;