const https = require('https');
const fs = require('fs');
const path = require('path');

const books = [
  {
    title: 'alchemist',
    url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg'
  },
  {
    title: 'littleprince',
    url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1367545443i/157993.jpg'
  },
  {
    title: 'harrypotter',
    url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1474154022i/3.jpg'
  },
  {
    title: 'bookthief',
    url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1522157426i/19063.jpg'
  },
  {
    title: 'hobbit',
    url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg'
  },
  {
    title: 'davinci',
    url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1579621267i/968.jpg'
  },
  {
    title: 'hungergames',
    url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1586722975i/2767052.jpg'
  },
  {
    title: 'kiterunner',
    url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1579036753i/77203.jpg'
  }
];

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../public/books', filename);
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => reject(err));
    });
  });
};

async function downloadAll() {
  try {
    // Create books directory if it doesn't exist
    const booksDir = path.join(__dirname, '../public/books');
    if (!fs.existsSync(booksDir)) {
      fs.mkdirSync(booksDir, { recursive: true });
    }

    // Download all book covers
    for (const book of books) {
      console.log(`Downloading ${book.title}...`);
      await downloadImage(book.url, `${book.title}.jpg`);
    }
    
    console.log('All book covers downloaded successfully!');
  } catch (error) {
    console.error('Error downloading book covers:', error);
  }
}

downloadAll(); 