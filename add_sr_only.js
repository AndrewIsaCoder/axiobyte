const fs = require('fs');
const cssPath = 'd:/PROGRAMARE/Axiobyte/css/style.css';

const srOnlyCss = `
/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`;

fs.appendFileSync(cssPath, srOnlyCss);
console.log('Appended .sr-only class');
