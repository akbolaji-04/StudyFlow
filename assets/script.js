// Theme toggle with persistence and simple AI typing demo
(function(){
  const THEME_KEY = 'studyflow-theme';
  const body = document.body;
  const toggle = document.getElementById('theme-toggle');
  const summarizeBtn = document.getElementById('summarize-btn');
  const demoToggle = document.getElementById('demo-toggle');
  const noteInput = document.getElementById('note-input');
  const messyEl = document.getElementById('messy');
  const summaryEl = document.getElementById('summary');
  const overlay = document.getElementById('summary-overlay');

  let autoDemo = true;

  function applyTheme(theme){
    if(theme === 'dark') body.classList.add('dark'); else body.classList.remove('dark');
    toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // initialize theme
  const saved = localStorage.getItem(THEME_KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  applyTheme(saved);

  toggle.addEventListener('click', ()=>{
    const next = body.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  // basic helpers
  function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
  async function typeText(el, text, speed=30){
    el.textContent = '';
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = reduce ? 0 : 1;
    if(step === 0){ el.textContent = text; return; }
    for(let i=0;i<text.length;i++){
      el.textContent += text[i];
      el.scrollTop = el.scrollHeight;
      await sleep(speed + (Math.random()*10));
    }
  }

  // demo content
  const messyText = `Lecture 9: Cellular respiration notes\n- mitochondria = powerhouse\n- steps: glycolysis -> pyruvate -> Krebs -> ETC\n- net ATP ~36 (varies)\nnotes on membranes, NADH, O2`;
  const summaryText = `Cellular respiration (summary):\n- Glycolysis: glucose → pyruvate.\n- Krebs cycle: generates NADH/FADH2.\n- ETC + O2: produces most ATP.\n- Net ATP ≈ 36. Focus: ATP, NADH, O2.`;

  async function runAutoDemoLoop(){
    while(autoDemo){
      noteInput.style.display = 'none';
      messyEl.style.display = 'block';
      await typeText(messyEl, messyText, 16);
      await sleep(600);
      overlay.style.display = 'flex';
      summaryEl.textContent = '';
      await sleep(200);
      await typeText(summaryEl, summaryText, 20);
      overlay.style.display = 'none';
      await sleep(2400);
      messyEl.textContent = '';
      summaryEl.textContent = '';
      noteInput.style.display = 'block';
      await sleep(400);
    }
  }

  demoToggle.addEventListener('click', ()=>{
    autoDemo = !autoDemo;
    demoToggle.textContent = autoDemo ? 'Auto demo' : 'Manual';
    if(autoDemo) runAutoDemoLoop();
  });

  // Call server summarization endpoint
  async function summarizeWithServer(text){
    const url = '/api/summarize';
    const resp = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({text})
    });
    if(!resp.ok){
      const txt = await resp.text();
      throw new Error(`Server error: ${resp.status} ${txt}`);
    }
    const data = await resp.json();
    return data.summary || data.result || '';
  }

  async function doSummarize(){
    const text = noteInput.value.trim();
    if(!text){
      // nothing entered — run demo snippet
      noteInput.placeholder = 'Paste notes or try the demo';
      return;
    }
    // UI
    overlay.style.display = 'flex';
    summaryEl.textContent = '';
    try{
      // try server
      const result = await summarizeWithServer(text);
      // type result
      overlay.style.display = 'none';
      await typeText(summaryEl, result, 18);
    }catch(err){
      // fallback to local simulated summary with an inline message
      console.warn('Summarize failed:', err);
      overlay.style.display = 'none';
      const fallback = '⚠️ Summarization service unavailable. Showing local simulated summary:\n\n' + summaryText;
      await typeText(summaryEl, fallback, 18);
    }
  }

  summarizeBtn.addEventListener('click', async (e)=>{
    e.preventDefault();
    autoDemo = false;
    demoToggle.textContent = 'Manual';
    // animate transition icon
    const icon = document.getElementById('transition-icon');
    if(icon){ icon.classList.add('animating'); }
    await doSummarize();
    if(icon){ setTimeout(()=>icon.classList.remove('animating'), 900); }
  });

  // init
  document.addEventListener('DOMContentLoaded', ()=>{
    // start auto demo by default unless small screen
    const small = window.matchMedia && window.matchMedia('(max-width:560px)').matches;
    if(!small) runAutoDemoLoop();
  });

  // Background blob parallax on pointer move (subtle)
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduceMotion){
    const blobs = Array.from(document.querySelectorAll('.blob'));
    window.addEventListener('pointermove', (e) => {
      const cx = window.innerWidth/2;
      const cy = window.innerHeight/2;
      const dx = (e.clientX - cx) / cx; // -1..1
      const dy = (e.clientY - cy) / cy;
      blobs.forEach((b, i) => {
        const depth = (i+1) * 8; // different movement per blob
        const tx = dx * depth;
        const ty = dy * depth * 0.6;
        b.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        b.setAttribute('data-offset','true');
      });
    }, {passive:true});
    // reset on leave
    window.addEventListener('pointerleave', ()=>{ document.querySelectorAll('.blob').forEach(b => { b.style.transform=''; }); });
  }

  // Navbar preview removed - no runtime toolbar

  // Admin UI removed — no runtime credential input.

})();
