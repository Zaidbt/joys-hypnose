const sharp = require('sharp');
const path = require('path');

async function optimizeImages() {
  // Optimize epub-cover.jpg
  await sharp('public/images/epub-cover.jpg')
    .resize(1000, 1414, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .jpeg({
      quality: 90,
      mozjpeg: true
    })
    .toFile('public/images/epub-cover.optimized.jpg');

  // Optimize joys.jpg
  await sharp('public/images/joys.jpg')
    .resize(1920, null, {
      withoutEnlargement: true,
      fit: 'inside'
    })
    .jpeg({
      quality: 80,
      mozjpeg: true
    })
    .toFile('public/images/joys.optimized.jpg');

  // Optimize meditation-space.webp
  await sharp('public/images/meditation-space.webp')
    .resize(1920, null, {
      withoutEnlargement: true,
      fit: 'inside'
    })
    .webp({
      quality: 80,
      effort: 6
    })
    .toFile('public/images/meditation-space.optimized.webp');

  // Replace original files with optimized versions
  require('fs').renameSync('public/images/epub-cover.optimized.jpg', 'public/images/epub-cover.jpg');
  require('fs').renameSync('public/images/joys.optimized.jpg', 'public/images/joys.jpg');
  require('fs').renameSync('public/images/meditation-space.optimized.webp', 'public/images/meditation-space.webp');
}

optimizeImages().catch(console.error); 