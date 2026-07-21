import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { errorHandler } from './middlewares/error'
import routes from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use('/api', routes)

// Static Files & SPA Fallback for Single Server (Frontend + Backend unified)
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist')
if (fs.existsSync(frontendDistPath)) {
  console.log(`[Unified Server] Serving static frontend from: ${frontendDistPath}`)
  app.use(express.static(frontendDistPath))

  // SPA fallback for Vue Router (any GET request not starting with /api goes to index.html)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDistPath, 'index.html'))
    } else {
      next()
    }
  })
} else {
  // Fallback if frontend is not built yet
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Sistem Informasi Keuangan RT API (Frontend build not found in /frontend/dist)' })
  })
}

app.use(errorHandler)

export default app
