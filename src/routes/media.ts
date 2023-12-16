import { Router } from "express";
import { MediaController } from "../controllers";

const router = Router();

router.get("/:mediaType/:id", MediaController.getMedia);

export default router;
