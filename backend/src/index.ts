import app from './app'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 5005

const server = app.listen(PORT, () => {
  console.log(`[Backend] Server successfully started and running on port ${PORT}`)
})

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Error] Port ${PORT} sudah digunakan oleh proses lain!`)
    console.error(`Silakan matikan proses yang menggunakan port ${PORT} terlebih dahulu atau tunggu beberapa saat.`)
    process.exit(1)
  } else {
    console.error(`[Error] Gagal menjalankan server:`, err)
  }
})
