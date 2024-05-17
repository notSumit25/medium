import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, jwt, sign, verify } from "hono/jwt";

// This is the same as the previous snippet
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

blogRouter.post("/api/v1/blog", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  const res = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: body.authorId,
    },
  });
  return c.json({
    id: res.id,
  });
});
blogRouter.put("/api/v1/blog", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      const body = await c.req.json();
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
blogRouter.get("/api/v1/blog/:id", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      try {
          const body = await c.req.json();
          const res = await prisma.post.findFirst({
            where: {
                id: body.id,
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

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      const res = await prisma.post.findMany();
      return c.json({
        res
      });
});
