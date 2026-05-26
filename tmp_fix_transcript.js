const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'components', 'resume', 'EducationSection.jsx');
let text = fs.readFileSync(file, 'utf8');
const startMarker = '                {/* ── Transcript toggle inside the card ── */}';
const endMarker = '                {/* end transcript section */}';
const start = text.indexOf(startMarker);
const end = text.indexOf(endMarker, start);
if (start === -1 || end === -1) {
  throw new Error(`Marker not found: start=${start}, end=${end}`);
}
const endLine = text.indexOf('\n', end);
text = text.slice(0, start) + text.slice(endLine + 1);
fs.writeFileSync(file, text, 'utf8');
console.log('Removed old transcript block successfully');
