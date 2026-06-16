const bcrypt = require('bcryptjs');

const hash = '$2b$10$cwMGkMOvOc7i6LULauW1yO6Vv63S8TN..DUU6MmAikIYOo8SKI.S6';

async function check() {
  console.log('admin', await bcrypt.compare('admin', hash));
  console.log('admin123', await bcrypt.compare('admin123', hash));
  console.log('password', await bcrypt.compare('password', hash));
}
check();
