const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const portArg=process.argv.indexOf('--port');
const port=portArg>=0?Number(process.argv[portArg+1]):Number(process.env.PORT)||3000;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp'};
http.createServer((req,res)=>{
 let relative;
 try { relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400); res.end(); return; }
 if(relative==='/')relative='/index.html';
 const file=path.resolve(root,'.'+relative);
 if(!file.startsWith(root+path.sep)||!['.html','.js','.css','.webp'].includes(path.extname(file))){res.writeHead(404);res.end('Not found');return;}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)],'X-Content-Type-Options':'nosniff'});res.end(data)});
}).listen(port,'0.0.0.0',()=>console.log('GRE Practice server ready'));
