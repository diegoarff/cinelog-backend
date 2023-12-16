import { Router } from "express";
import { SearchController } from "../controllers";

const router = Router();

router.get('/', SearchController.searchByText);

router.get('/filter/:media_type', SearchController.searchFilter);

export default router;