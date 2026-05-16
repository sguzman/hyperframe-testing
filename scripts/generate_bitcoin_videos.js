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

  // Generate dynamic audio tags based on price changes
  const totalDuration = 15;
  const timeOffset = 1;
  const availableDuration = 12; // Data spans 1 to 13
  let audioHtml = '';
  let chunks = [];
  let currentChunk = null;
  const yearData = groupedData[year];

  yearData.forEach((d, i) => {
    const price = d[1];
    const prevPrice = i > 0 ? yearData[i-1][1] : price;
    const isUp = price >= prevPrice;
    const time = timeOffset + (i / yearData.length) * availableDuration;
    
    if (!currentChunk) {
      currentChunk = { isUp, start: time, end: time };
    } else if (currentChunk.isUp === isUp) {
      currentChunk.end = time;
    } else {
      chunks.push(currentChunk);
      currentChunk = { isUp, start: time, end: time };
    }
  });
  if (currentChunk) {
    currentChunk.end = timeOffset + availableDuration; // end of data
    chunks.push(currentChunk);
  }

  // Prepend intro audio based on first chunk
  const firstUp = chunks.length > 0 ? chunks[0].isUp : true;
  audioHtml += `<audio id="audio-intro" class="clip" src="../../assets/audio/${firstUp ? 'Morning_Jumpstart.mp3' : 'Receipt_from_.mp3'}" data-start="0" data-duration="${timeOffset}" data-media-start="0"></audio>\n`;

  chunks.forEach((chunk, idx) => {
    const src = chunk.isUp ? "Morning_Jumpstart.mp3" : "Receipt_from_.mp3";
    const duration = chunk.end - chunk.start;
    // ensure minimum duration for ffmpeg (e.g., 0.01s)
    if (duration > 0) {
      audioHtml += `      <audio id="audio-chunk-${idx}" class="clip" src="../../assets/audio/${src}" data-start="${chunk.start.toFixed(3)}" data-duration="${duration.toFixed(3)}" data-media-start="${chunk.start.toFixed(3)}"></audio>\n`;
    }
  });

  // Outro
  const lastUp = chunks.length > 0 ? chunks[chunks.length - 1].isUp : true;
  audioHtml += `      <audio id="audio-outro" class="clip" src="../../assets/audio/${lastUp ? 'Morning_Jumpstart.mp3' : 'Receipt_from_.mp3'}" data-start="${timeOffset + availableDuration}" data-duration="${totalDuration - (timeOffset + availableDuration)}" data-media-start="${timeOffset + availableDuration}"></audio>\n`;

  // Inject data into template
  const dataString = JSON.stringify(yearData);
  const finalHtml = template
    .replace('const yearData = [];', `const yearData = ${dataString};`)
    .replace('const year = "20XX";', `const year = "${year}";`)
    .replace('<!-- AUDIO_TAGS_HERE -->', audioHtml);

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
