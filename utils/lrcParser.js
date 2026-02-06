// utils/lrcParser.js
export function parseLRC(lrcText) {
  const lines = lrcText.split('\n');
  const lyrics = [];

  const timeTagRegex = /\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\]/;

  for (const line of lines) {
    const match = timeTagRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0;

      const time = minutes * 60 + seconds + milliseconds / 1000;

      const text = line.replace(timeTagRegex, '').trim();

      lyrics.push({ time, text });
    }
  }

  return lyrics;
}


