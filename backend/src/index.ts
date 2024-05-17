import { Hono } from "hono";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@prisma/client/edge";
import { decode, jwt, sign, verify } from "hono/jwt";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

app.route('/api/v1/user',userRouter);
app.route('/api/v1/blog',blogRouter);

app.use("/api/v1", async (c, next) => {
  const response = c.req.header("authorization");
  if (!response) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }
  const token = response.split(" ")[1];
  try {
    const payload = await verify(token, "secret");
    if (payload.id) {
      next();
    } else {
      c.status(401);
      return c.json({ message: "Unauthorized" });
    }
  } catch (e) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }
});


export default app;
