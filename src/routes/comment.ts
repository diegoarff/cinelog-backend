import { Router } from "express";
import { CommentController } from "../controllers";

const router = Router();

router.post('/create', CommentController.createComment);
router.delete('/delete/:commentId', CommentController.deleteComment);
router.get('/detail/:commentId', CommentController.getComment)
router.get('/:type/:isReplyTo', CommentController.getComments);
router.put('/edit/:commentId', CommentController.editComment);

export default router;