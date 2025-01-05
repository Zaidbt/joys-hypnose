const sharp = require('sharp');
const path = require('path');

async function optimizeImages() {
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
  require('fs').renameSync('public/images/joys.optimized.jpg', 'public/images/joys.jpg');
  require('fs').renameSync('public/images/meditation-space.optimized.webp', 'public/images/meditation-space.webp');
}

optimizeImages().catch(console.error); 