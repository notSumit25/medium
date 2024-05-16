import { Hono } from 'hono'

const app = new Hono()

app.post('/api/v1/signup', (c) => {
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
