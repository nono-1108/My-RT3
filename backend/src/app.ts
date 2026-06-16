import express from 'express'
import cors from 'cors'
import { errorHandler } from './middlewares/error'
import routes from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Sistem Informasi Keuangan RT API' })
})

app.use(errorHandler)

export default app
