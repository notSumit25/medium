import z from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export type signupInput = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type signinInput = z.infer<typeof signinSchema>;

export const postSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export type postInput = z.infer<typeof postSchema>;

export const updateSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
});

export type updateInput = z.infer<typeof updateSchema>;
