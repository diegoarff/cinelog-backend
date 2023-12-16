import { Router } from "express";
import { UserController } from "../controllers";
import { validate } from "../middlewares";
import { updatePasswordSchema, updateUserSchema } from "../zod/user";

const router = Router();

router
  .route("/me")
  .get(UserController.getAuthUser)
  .delete(UserController.deleteUser);

router.put("/me", validate(updateUserSchema), UserController.updateUser);

router.put(
  "/changePassword",
  validate(updatePasswordSchema),
  UserController.updatePassword
);

router.get("/:userId", UserController.getUser);

export default router;
