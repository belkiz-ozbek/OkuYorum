const sharp = require('sharp');
const fs = require('fs');

const inputPath = './backend/src/main/resources/static/images/';
const outputPath = './backend/src/main/resources/static/images/';

// Logo dönüştürme
sharp(inputPath + 'logo.svg')
  .resize(300, 300)
  .png()
  .toFile(outputPath + 'logo.png')
  .then(() => console.log('Logo dönüştürüldü'))
  .catch(err => console.error('Logo dönüştürme hatası:', err));

// Pattern dönüştürme
sharp(inputPath + 'pattern.svg')
  .resize(200, 200)
  .png()
  .toFile(outputPath + 'pattern.png')
  .then(() => console.log('Pattern dönüştürüldü'))
  .catch(err => console.error('Pattern dönüştürme hatası:', err)); 