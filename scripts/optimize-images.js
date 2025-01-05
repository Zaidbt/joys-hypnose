const sharp = require('sharp');
const path = require('path');

async function optimizeImages() {
  try {
    console.log('Starting image optimization...');
    
    // Optimize epub.webp
    console.log('Optimizing epub.webp...');
    await sharp('public/images/epub.webp')
      .resize(1000, 1414, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .webp({
        quality: 90,
        effort: 6,
        lossless: false
      })
      .toFile('public/images/epub.optimized.webp')
      .then(info => {
        console.log('Optimization complete:', info);
        // Replace original file with optimized version
        require('fs').renameSync('public/images/epub.optimized.webp', 'public/images/epub.webp');
        console.log('File replaced successfully');
      });

  } catch (error) {
    console.error('Error during optimization:', error);
  }
}

optimizeImages(); 