import { Router } from "express";
import { ReviewController } from "../controllers";

const router =  Router();

router.post("/create", ReviewController.createReview);

router.get("/detail/:id", ReviewController.getReview);

router.get("/:id", ReviewController.getReviews);

router.put("/edit/:id", ReviewController.editReview);

router.delete("/delete/:id", ReviewController.deleteReview);

export default router;