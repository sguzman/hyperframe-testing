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
  const yearData = groupedData[year];
  
  // Generate dynamic audio tags based on price changes
  const timeOffset = 1;
  const availableDuration = yearData.length * 2;
  const totalDuration = timeOffset + availableDuration + 2;
  let audioHtml = '';
  let chunks = [];
  let currentChunk = null;

  yearData.forEach((d, i) => {
    const price = d[1];
    const prevPrice = i > 0 ? yearData[i-1][1] : price;
    const isUp = price >= prevPrice;
    const startTime = timeOffset + (i / yearData.length) * availableDuration;
    const endTime = timeOffset + ((i + 1) / yearData.length) * availableDuration;
    
    if (!currentChunk) {
      currentChunk = { isUp, start: startTime, end: endTime };
    } else if (currentChunk.isUp === isUp) {
      currentChunk.end = endTime;
    } else {
      chunks.push(currentChunk);
      currentChunk = { isUp, start: startTime, end: endTime };
    }
  });
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  // Audio logic fixes: accumulate play time for each track to avoid seeking past EOF
  let accumulatedUp = 0;
  let accumulatedDown = 0;
  const lenUp = 146.07;
  const lenDown = 179.46;

  // Prepend intro audio based on first chunk
  const firstUp = chunks.length > 0 ? chunks[0].isUp : true;
  const introSrc = firstUp ? 'Morning_Jumpstart.mp3' : 'Receipt_from_.mp3';
  let introStart = firstUp ? accumulatedUp : accumulatedDown;
  if (firstUp) accumulatedUp += timeOffset;
  else accumulatedDown += timeOffset;

  audioHtml += `<audio id="audio-intro" class="clip" src="../../assets/audio/${introSrc}" data-start="0" data-duration="${timeOffset}" data-media-start="${(introStart % (firstUp ? lenUp : lenDown)).toFixed(3)}"></audio>\n`;

  chunks.forEach((chunk, idx) => {
    const isUp = chunk.isUp;
    const src = isUp ? "Morning_Jumpstart.mp3" : "Receipt_from_.mp3";
    const duration = chunk.end - chunk.start;
    
    // ensure minimum duration for ffmpeg (e.g., 0.01s)
    if (duration > 0) {
      let mediaStart = isUp ? accumulatedUp : accumulatedDown;
      if (isUp) accumulatedUp += duration;
      else accumulatedDown += duration;
      
      const wrappedStart = mediaStart % (isUp ? lenUp : lenDown);
      audioHtml += `      <audio id="audio-chunk-${idx}" class="clip" src="../../assets/audio/${src}" data-start="${chunk.start.toFixed(3)}" data-duration="${duration.toFixed(3)}" data-media-start="${wrappedStart.toFixed(3)}"></audio>\n`;
    }
  });

  // Outro
  const lastUp = chunks.length > 0 ? chunks[chunks.length - 1].isUp : true;
  const outroDuration = totalDuration - (timeOffset + availableDuration);
  const outroSrc = lastUp ? 'Morning_Jumpstart.mp3' : 'Receipt_from_.mp3';
  let outroStart = lastUp ? accumulatedUp : accumulatedDown;
  
  audioHtml += `      <audio id="audio-outro" class="clip" src="../../assets/audio/${outroSrc}" data-start="${timeOffset + availableDuration}" data-duration="${outroDuration}" data-media-start="${(outroStart % (lastUp ? lenUp : lenDown)).toFixed(3)}"></audio>\n`;

  // Inject data into template
  const dataString = JSON.stringify(yearData);
  const finalHtml = template
    .replace('const yearData = [];', `const yearData = ${dataString};`)
    .replace('const year = "20XX";', `const year = "${year}";`)
    .replace('data-duration="15"', `data-duration="${totalDuration}"`)
    .replace('<!-- AUDIO_TAGS_HERE -->', audioHtml);

  fs.writeFileSync(path.join(yearDir, 'index.html'), finalHtml);

  // Create meta.json
  const meta = {
    id: `bitcoin-${year}`,
    title: `Bitcoin History - ${year}`,
    duration: totalDuration,
    width: 1920,
    height: 1080
  };
  fs.writeFileSync(path.join(yearDir, 'meta.json'), JSON.stringify(meta, null, 2));

  console.log(`Generated video act for ${year}`);
});
