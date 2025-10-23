const fs = require('fs');
const path = require('path');

const prismaClientPath = path.join(__dirname, 'node_modules', '.prisma', 'client');
console.log('Prisma client path:', prismaClientPath);

if (fs.existsSync(prismaClientPath)) {
  console.log('Files in Prisma client:');
  fs.readdirSync(prismaClientPath).forEach(file => {
    console.log(file);
  });
} else {
  console.log('Prisma client directory does not exist.');
}