import app from './app.js'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 5005

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Backend] Server successfully started and running on http://127.0.0.1:${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Error] Port ${PORT} sudah digunakan oleh proses lain!`)
    console.error(`Silakan matikan proses yang menggunakan port ${PORT} terlebih dahulu atau tunggu beberapa saat.`)
    process.exit(1)
  } else {
    console.error(`[Error] Gagal menjalankan server:`, err)
  }
})

process.on('uncaughtException', (err) => {
  console.error('[Backend Uncaught Exception]:', err)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Backend Unhandled Rejection]:', reason)
})
