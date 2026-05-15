const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../assets/data/bitcoin_price_history.json');
const templatePath = path.join(__dirname, '../templates/bitcoin-video/index.html');
const outputDir = path.join(__dirname, '../videos');

if (!fs.existsSync(dataPath)) {
  console.error('Data file not found:', dataPath);
  process.exit(1);
}

const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const template = fs.readFileSync(templatePath, 'utf8');

// Group data by year
const groupedData = {};
rawData.forEach(entry => {
  const date = entry[0];
  const year = date.split('-')[0];
  if (!groupedData[year]) {
    groupedData[year] = [];
  }
  groupedData[year].push(entry);
});

Object.keys(groupedData).forEach(year => {
  const yearDir = path.join(outputDir, `bitcoin-${year}`);
  if (!fs.existsSync(yearDir)) {
    fs.mkdirSync(yearDir, { recursive: true });
  }

  // Inject data into template
  const dataString = JSON.stringify(groupedData[year]);
  const finalHtml = template
    .replace('const yearData = [];', `const yearData = ${dataString};`)
    .replace('const year = "20XX";', `const year = "${year}";`);

  fs.writeFileSync(path.join(yearDir, 'index.html'), finalHtml);

  // Create meta.json
  const meta = {
    id: `bitcoin-${year}`,
    title: `Bitcoin History - ${year}`,
    duration: 15,
    width: 1920,
    height: 1080
  };
  fs.writeFileSync(path.join(yearDir, 'meta.json'), JSON.stringify(meta, null, 2));

  console.log(`Generated video act for ${year}`);
});
