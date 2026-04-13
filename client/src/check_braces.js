const fs = require('fs');
const content = fs.readFileSync('c:/Users/Admin/Documents/Solar-power/client/src/App.jsx', 'utf8');
let balance = 0;
for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') balance++;
    if (content[i] === '}') balance--;
}
console.log('Balance:', balance);
