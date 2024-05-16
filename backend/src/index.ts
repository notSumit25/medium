import { Hono } from 'hono'
import { Prisma } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from '@prisma/client/extension'


const app = new Hono<{
  Bindings: {
   DATABASE_URL: string
  }
}>()



app.post('/api/v1/signup', (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  return c.text('signup')
})

app.post('/api/v1/signin', (c) => {
  return c.text('signup')
})
app.post('/api/v1/blog', (c) => {
  return c.text('signup')
})
app.put('/api/v1/blog', (c) => {
  return c.text('signup')
})
app.get('/api/v1/blog/:id', (c) => {
  return c.text('signup')
})


export default app
