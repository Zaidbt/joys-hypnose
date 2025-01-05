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

    // Optimize notrehistoire.png
    console.log('Optimizing notrehistoire.png...');
    await sharp('public/images/notrehistoire.png')
      .resize(1200, 900, {
        fit: 'cover',
        position: 'top'
      })
      .webp({
        quality: 85,
        effort: 6,
        lossless: false
      })
      .toFile('public/images/notrehistoire.optimized.webp')
      .then(info => {
        console.log('Notre Histoire optimization complete:', info);
        // Replace original file with optimized version
        require('fs').renameSync('public/images/notrehistoire.optimized.webp', 'public/images/notrehistoire.webp');
        console.log('Notre Histoire file replaced successfully');
      });

    // Optimize joys.jpg
    console.log('Optimizing joys.jpg...');
    await sharp('public/images/joys.jpg')
      .resize(1200, 900, {
        fit: 'cover',
        position: 'top'
      })
      .webp({
        quality: 85,
        effort: 6,
        lossless: false
      })
      .toFile('public/images/joys.optimized.webp')
      .then(info => {
        console.log('Joys optimization complete:', info);
        // Replace original file with optimized version
        require('fs').renameSync('public/images/joys.optimized.webp', 'public/images/joys.webp');
        console.log('Joys file replaced successfully');
      });

  } catch (error) {
    console.error('Error during optimization:', error);
  }
}

optimizeImages(); 