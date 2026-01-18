import Router from "express";

import { getFoldersController, getFolderController, postFolderController, deleteFolderController } from "@/controllers/linksControllers/folders.controller";

const router = Router();

router.get("/", getFoldersController);

router.get("/:id", getFolderController);

router.post("/", postFolderController);

router.delete("/:id", deleteFolderController);
