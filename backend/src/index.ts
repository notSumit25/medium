import { Hono } from 'hono'
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '@prisma/client/edge'
import { decode,jwt,sign,verify } from 'hono/jwt'


const app = new Hono<{
  Bindings: {
   DATABASE_URL: string
  }
}>()

app.use('/api/v1', async (c,next) => {
  const response = c.req.header('authorization')
  if (!response) {
    c.status(401)
    return c.json({ message: 'Unauthorized' });
  }
  const token = response.split(' ')[1]
  try {
    const payload = await verify(token, 'secret')
    if(payload.id){
      next()
    }else{
      c.status(401)
      return c.json({ message: 'Unauthorized' });
    } 
  } catch (e) {
    c.status(401)
    return c.json({ message: 'Unauthorized' });
  }
}
)

app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json();
  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    }
  })
  const token = await sign({ id: user.id}, 'secret')
  return c.json({ jwt: token});
})

app.post('/api/v1/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      password: body.password,
    }
  })
  if (!user) {
    c.status(403)
    return c.json({ message: 'Invalid email or password' });
  }
  const jwt = await sign({ id: user.id}, 'secret');
  return c.json({ jwt });
})
app.post('/api/v1/blog', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json();
  const res = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: body.authorId,
    }
  })
  return c.json(res);
})
app.put('/api/v1/blog', (c) => {
  return c.text('signup')
})
app.get('/api/v1/blog/:id', (c) => {
  return c.text('signup')
})


export default app
