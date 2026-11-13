const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={console,setInterval:()=>{},setTimeout:()=>{},document:{querySelector:s=>s==='#app'?{innerHTML:''}:s==='#dialog'?{open:false,showModal(){this.open=true},close(){this.open=false}}:null,addEventListener:()=>{}},localStorage:{getItem:()=>null,setItem:()=>{}}};
vm.createContext(context);vm.runInContext(['questions.js','questions-gre6.js','exams.js','app.js'].map(f=>fs.readFileSync(__dirname+'/'+f,'utf8')).join('\n'),context);
const run=s=>vm.runInContext(s,context);
assert.equal(run('SECTIONS.length'),5);
assert.equal(run('SECTIONS.reduce((n,s)=>n+s.minutes,0)'),118);
assert.equal(run('SECTIONS.slice(1).reduce((n,s)=>n+s.questions.length,0)'),54);
run('state=fresh()');
for(let si=1;si<5;si++){
 const n=run(`SECTIONS[${si}].questions.length`);
 for(let qi=0;qi<n;qi++){
  const q=JSON.parse(run(`JSON.stringify(SECTIONS[${si}].questions[${qi}])`));
  assert.ok(fs.existsSync(__dirname+`/assets/q${String(q.page).padStart(2,'0')}.webp`));
  let perfect=q.type==='blanks'?Object.fromEntries(q.key.split('').map((x,i)=>[i,x])):q.type==='multi'?q.key.split(''):q.type==='fraction'?q.key.split('/'):q.key;
  assert.equal(run(`isCorrect(SECTIONS[${si}].questions[${qi}],${JSON.stringify(perfect)})`),true,`Perfect answer rejected ${si}:${qi}`);
  run(`state.answers[${si}][${qi}]=${JSON.stringify(perfect)}`);
  assert.equal(run(`answered(${si},${qi})`),true);
  if(q.type==='blanks'){
   for(let col=0;col<q.key.length;col++)assert.ok(q.zones.some(z=>z.group===col&&z.value===q.key[col]));
  }else if(q.zones.length){for(let char of q.key)assert.ok(q.zones.some(z=>z.value===char))}
  for(let z of q.zones){const [x,y,w,h]=z.rect;assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=100.01&&y+h<=100.01,`Invalid hotspot ${q.page}`)}
 }
 assert.equal(run(`score(${si})`),n);
}
assert.equal(run("isCorrect(SECTIONS[4].questions[14],['206','406'])"),true,'Equivalent fractions');
assert.equal(run("isCorrect(SECTIONS[4].questions[14],['103','0'])"),false,'Zero denominator');
assert.equal(run("isCorrect(SECTIONS[2].questions[10],'6.0')"),true,'Equivalent decimal');
assert.equal(run("isCorrect(SECTIONS[1].questions[5],['B'])"),false,'Incomplete multiselect');
assert.equal(run("isCorrect(SECTIONS[1].questions[5],['B','D','F'])"),false,'Extra multiselect');
assert.equal(run("isCorrect(SECTIONS[1].questions[1],{0:'C'})"),false,'Incomplete blanks');
for(const [expr,result] of [['2+3*4',14],['(2+3)*4',20],['−3×4+2',-10],['1÷4',.25],['0.1+0.2',.3]])assert.equal(run(`evaluate(${JSON.stringify(expr)})`),result);
for(const expr of ['1/0','2+','alert(1)','2**3',''])assert.throws(()=>run(`evaluate(${JSON.stringify(expr)})`));
run('state=fresh();state.deadline=Date.now()-1000');assert.equal(run('remaining()'),0);
console.log('PASS: 54 answer keys, hotspot bounds, 118-minute structure, numeric equivalence, multiselect completeness, calculator safety, timer expiry.');
// Regression coverage for standalone sections and score-estimate scope.
context.document.querySelector=s=>s==='#app'?{innerHTML:''}:s==='#dialog'?{open:false,showModal(){this.open=true},close(){this.open=false}}:s==='#result-table'?{innerHTML:''}:null;
run('state.completed=[1,2,3,4].map(section=>({section}))');
run('for(let si=1;si<5;si++)for(let qi=0;qi<SECTIONS[si].questions.length;qi++){const q=SECTIONS[si].questions[qi];state.answers[si][qi]=q.type==="blanks"?Object.fromEntries(q.key.split("").map((v,j)=>[j,v])):q.type==="multi"?q.key.split(""):q.type==="fraction"?q.key.split("/"):q.key}');
assert.equal(run('estimates().total'),340);
assert.equal(run('reportData().responses.length'),54);
run('state=fresh();state.mode="single";state.section=1;state.completed=[{section:1}];state.answers[1][0]="C"');
assert.equal(run('estimates().verbal.total'),12);
assert.equal(run('estimates().verbal.correct'),1);
assert.equal(run('estimates().verbal.estimate'),133);
assert.equal(run('estimates().quant.estimate'),null);
assert.equal(run('estimates().total'),null);
assert.equal(run('reportData().rawScores.quant'),null);
assert.equal(run('reportData().responses.length'),12);
run('state=fresh();state.completed=[{section:1}]');
assert.equal(run('estimates().verbal.estimate'),null,'No score for zero responses');
run('state=fresh();state.completed=[{section:1}];for(let i=0;i<9;i++){let q=SECTIONS[1].questions[i];state.answers[1][i]=q.type==="blanks"?Object.fromEntries(q.key.split("").map((v,j)=>[j,v])):q.type==="multi"?q.key.split(""):q.key}');
assert.equal(run('estimates().verbal.estimate'),160,'9/12 example matches displayed formula');
for(let i=0;i<5;i++){
 run(`startSectionPractice(${i})`);
 assert.equal(run('state.section'),i);
 assert.equal(run('state.mode'),'single');
 assert.equal(run('state.remaining'),run(`SECTIONS[${i}].minutes*60`));
 assert.equal(run('state.deadline'),null,'Instructions must be untimed');
 run('finishSection(true)');
 assert.equal(run('state.done'),true,`Standalone section ${i} must finish directly`);
 assert.equal(run('state.section'),i,'Must not advance to another section');
 assert.equal(run('state.completed.length'),1);
 assert.equal(run('state.completed[0].timedOut'),true);
 assert.equal(run('state.deadline'),null);
}
run('state=fresh();finishSection()');
assert.equal(run('state.section'),1,'Full test must still advance normally');
assert.equal(run('state.done'),false);
run('state=fresh();delete state.mode;finishSection()');
assert.equal(run('state.section'),1,'Existing saved sessions remain compatible');
console.log('PASS: all five standalone sections, direct completion/timeout, correct timers, legacy sessions, full-test progression, estimates, no-response/untaken handling, export scope.');

// Separate exam stores must preserve legacy GRE 1 and isolate GRE 6 attempts.
const saves=new Map();
context.localStorage.getItem=k=>saves.get(k)||null;
context.localStorage.setItem=(k,v)=>saves.set(k,v);
run('state=fresh();state.essay="Original draft";save();selectExam("gre6")');
assert.equal(run('activeExam.id'),'gre6');
assert.equal(run('state'),null);
assert.equal(run('SECTIONS.reduce((n,s)=>n+s.minutes,0)'),118);
assert.equal(run('SECTIONS.slice(1).reduce((n,s)=>n+s.questions.length,0)'),54);
run('state=fresh();state.essay="New exam draft";save()');
const expectedKeys=[['C','BB','BAB','C','B','AE','AE','CE','AD','C','A','E'],['A','B','D','C','B','D','B','E','E','C','10','ACD'],['C','D','AA','ABB','B','AC','A','E','C','DF','BD','BF','E','C','E'],['D','D','B','C','C','B','C','E','C','D','A','18','A','CD','103/203']];
for(let si=1;si<5;si++){
 const qs=JSON.parse(run(`JSON.stringify(SECTIONS[${si}].questions)`));
 assert.deepEqual(qs.map(q=>q.key),expectedKeys[si-1]);
 for(let qi=0;qi<qs.length;qi++){
  const q=qs[qi];assert.ok(fs.existsSync(__dirname+'/'+q.image));
  const perfect=q.type==='blanks'?Object.fromEntries(q.key.split('').map((v,i)=>[i,v])):q.type==='multi'?q.key.split(''):q.type==='fraction'?q.key.split('/'):q.key;
  run(`state.answers[${si}][${qi}]=${JSON.stringify(perfect)}`);
  assert.equal(run(`answered(${si},${qi})`),true);
  assert.equal(run(`isCorrect(SECTIONS[${si}].questions[${qi}],state.answers[${si}][${qi}])`),true);
  for(const z of q.zones){
   const [x,y,w,h]=z.rect;assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=100.01&&y+h<=100.01);
  }
  if(q.type==='blanks')q.key.split('').forEach((v,i)=>assert.ok(q.zones.some(z=>z.group===i&&z.value===v)));
  else if(q.zones.length)q.key.split('').forEach(v=>assert.ok(q.zones.some(z=>z.value===v)));
  for(const [x,y,w,h] of q.fields||[])assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=100&&y+h<=100);
  assert.ok(run(`questionBody(${si},${qi},true)`).includes(q.image));
 }
 assert.equal(run(`score(${si})`),qs.length);
}
run('state.completed=[1,2,3,4].map(section=>({section}));save()');
assert.equal(run('estimates().total'),340);
assert.equal(run('reportData().test'),'GRE 6');
assert.equal(run('reportData().examId'),'gre6');
run('selectExam("gre1")');
assert.equal(run('state.essay'),'Original draft');
assert.equal(run('SECTIONS===EXAMS[0].sections'),true);
run('selectExam("gre6")');
assert.equal(run('state.essay'),'New exam draft');
assert.equal(run('estimates().total'),340);
for(let i=0;i<5;i++){
 run(`startSectionPractice(${i});finishSection(true)`);
 assert.equal(run('state.done'),true);
 assert.equal(run('state.completed[0].section'),i);
}
// A new page load restores the selected exam and its saved attempt.
const reloaded={...context};vm.createContext(reloaded);
vm.runInContext(['questions.js','questions-gre6.js','exams.js','app.js'].map(f=>fs.readFileSync(__dirname+'/'+f,'utf8')).join('\n'),reloaded);
assert.equal(vm.runInContext('activeExam.id',reloaded),'gre6');
assert.equal(vm.runInContext('state.section',reloaded),4);
assert.equal(vm.runInContext('state.done',reloaded),true);
console.log('PASS: GRE 6 keys/assets/controls, all section timers, scoring, report identity, isolated storage, legacy GRE 1 preservation, selected-exam reload.');
