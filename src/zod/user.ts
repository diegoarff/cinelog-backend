import { z } from "zod";
import { password, username } from "./generics";

export const updateUserSchema = z.object({
  username,
  avatar: z.string().url({ message: "Avatar must be a valid URL" }),
});

export const updatePasswordSchema = z.object({
  oldPassword: password,
  newPassword: password,
});
