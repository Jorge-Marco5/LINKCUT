import Router from "express";
import { shortUrlController } from "@/controllers/linksControllers/shorturl.controller";

const router = Router();

router.get("/:shortUrl", shortUrlController);

export default router;
