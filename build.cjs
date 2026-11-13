const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
for (const f of ['index.html', 'style.css', 'app.js', 'questions.js', 'questions-gre6.js', 'exams.js']) fs.copyFileSync(path.join(root,f),path.join(root,'dist',f));
fs.cpSync(path.join(root,'assets'),path.join(root,'dist','assets'),{recursive:true});
console.log('Built dist/ — static files ready for deployment.');
