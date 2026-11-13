'use strict';
const EXAMS = [
  {id:'gre1',name:'GRE 1',label:'Test 01',sections:SECTIONS,store:'gre-practice-v1',prompt:[
    'The effectiveness of a country’s leaders is best measured by examining the well-being of that country’s citizens.',
    'Write a response in which you discuss the extent to which you agree or disagree with the claim. In developing and supporting your position, be sure to address the most compelling reasons and/or examples that could be used to challenge your position.'
  ]},
  {id:'gre6',name:'GRE 6',label:'Test 06',sections:GRE6_SECTIONS,store:'gre-practice-gre6-v1',prompt:[
    'Claim: Group assignments that students must work together to complete should replace a substantial amount of traditional lecture-based instruction in college and university courses.',
    'Reason: It is vital for students to gain experience collaborating with peers to study a topic and to achieve a common goal.',
    'Write a response in which you discuss the extent to which you agree or disagree with the claim and the reason on which that claim is based.'
  ]}
];
let activeExam=EXAMS[0];
try { activeExam=EXAMS.find(e=>e.id===localStorage.getItem('gre-selected-exam'))||EXAMS[0]; } catch {}
SECTIONS=activeExam.sections;
