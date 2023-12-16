import { Router } from "express";
import { TrendingController } from "../controllers";
const router = Router();

router.get("/:type/:time", TrendingController.getTrendings);

export default router;