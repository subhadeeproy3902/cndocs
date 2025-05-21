const fs = require('fs');
const path = require('path');

// Function to copy directory recursively
function copyDirectory(source, destination) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Read all files/directories in source
  const files = fs.readdirSync(source);

  files.forEach((file) => {
    const srcPath = path.join(source, file);
    const destPath = path.join(destination, file);

    const stats = fs.statSync(srcPath);

    if (stats.isDirectory()) {
      // Recursively copy directory
      copyDirectory(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Copy content/docs to public/content/docs
const sourceDir = path.join(process.cwd(), 'content/docs');
const destinationDir = path.join(process.cwd(), 'public/content/docs');

try {
  copyDirectory(sourceDir, destinationDir);
  console.log('Successfully copied content to public directory');
} catch (error) {
  console.error('Error copying content:', error);
  process.exit(1);
}
