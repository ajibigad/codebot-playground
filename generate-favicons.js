const sharp = require('sharp');
const fs = require('fs');

const svgBuffer = fs.readFileSync('favicon.svg');

const sizes = [16, 32, 192];

async function generateFavicons() {
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(`favicon-${size}x${size}.png`);
    console.log(`Generated favicon-${size}x${size}.png`);
  }

  // Also generate a standard favicon.ico (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('favicon.ico');
  console.log('Generated favicon.ico');
}

generateFavicons().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
