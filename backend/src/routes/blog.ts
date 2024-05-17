import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, jwt, sign, verify } from "hono/jwt";
import { postSchema, updateSchema } from "@notsumit/medium-common";

// This is the same as the previous snippet
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    userId: string;
  };
}>();


blogRouter.use('/*', async (c, next) => {
    const response = c.req.header("authorization");
    if (!response) {
      c.status(401);
      return c.json({ message: "Unauthorized" });
    }
    const token = response.split(" ")[1];
    try {
      const payload = await verify(token, "secret");
      if (payload.id) {
        c.set('userId', payload.id);
        await next();
      } else {
        c.status(401);
        return c.json({ message: "Unauthorized" });
      }
    } catch (e) {
      c.status(401);
      return c.json({ message: "Unauthorized" });
    }
  }
);

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
    const { success } = postSchema.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({ message: "Invalid input" });
    }
  const userId = c.get('userId');
  const res = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: userId
    },
  });
  return c.json({
    id: res.id,
  });
});
blogRouter.put("/", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      const body = await c.req.json();
        const { success } = updateSchema.safeParse(body);
        if (!success) {
          c.status(400);
          return c.json({ message: "Invalid input" });
        }
      const res = await prisma.post.update({
        where: {
            id: body.id,
        },
        data: {
          title: body.title,
          content: body.content,
        },
      });
      return c.json({
        id: res.id,
      });
});
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      const res = await prisma.post.findMany();
      return c.json({
        res
      });
});
blogRouter.get("/:id", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      try {
          const body = await c.req.json();
          const id = c.req.param("id");

          const res = await prisma.post.findFirst({
            where: {
                id
            }
          });
          return c.json({
            res
          });
      } catch (error) {
        console.log(error);
        c.status(403);
        return c.json({ message: "Invalid id" });
      }
});

