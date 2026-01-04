// Readify app.js - shared JS for site

const Readify = (function(){
  // --- Sample data: books ---
  const books = [
    {
      id:'b1', title:'The Twilight Path', author:'E. Night', genre:'Fantasy', pages:420, length:'long', year:2018,
      synopsis:'A sweeping fantasy with a young protagonist who discovers ancient paths and forbidden magic.',
      sequels: ['b4'], cover:'assets/covers/b1.svg', coverColor:'#7e57c2',reviews:[{name:'Alice',rating:5,comment:'Enchanting!'}, {name:'Tom',rating:4,comment:'Great worldbuilding.'}]
    },
    {
      id:'b2', title:'Short Stories for Winter', author:'S. Wren', genre:'Fiction', pages:120, length:'short',year:2021,
      synopsis:'A collection of cozy slices of life to curl up with on chilly evenings.',
      sequels: [], cover:'assets/covers/b2.svg', coverColor:'#ff7043',reviews:[{name:'Maya',rating:4,comment:'Lovely little tales.'}]
    },
    {
      id:'b3', title:'Quantum Dawn', author:'I. T. Quark', genre:'Sci-Fi', pages:340, length:'medium',year:2019,
      synopsis:'Near-future sci-fi dealing with AI and human identity across the stars.',
      sequels:['b5'], cover:'assets/covers/b3.svg', coverColor:'#00897b',reviews:[{name:'Rex',rating:5,comment:'Mind-bending.'}], video:'https://www.youtube.com/embed/lz8sUiXAnbs'
    },
    {
      id:'b4', title:'The Twilight Path: Reckoning', author:'E. Night', genre:'Fantasy', pages:460,length:'long',year:2020,
      synopsis:'The thrilling follow-up where choices collide and destinies are made.',
      sequels: [], cover:'assets/covers/b4.svg', coverColor:'#6a1b9a',reviews:[{name:'Nora',rating:4,comment:'Stellar climax.'}]
    },
    {
      id:'b5', title:'Quantum Dusk', author:'I. T. Quark', genre:'Sci-Fi', pages:390,length:'long',year:2022,
      synopsis:'Sequel where the consequences of early experiments ripple into existence.',
      sequels: [], cover:'assets/covers/b5.svg', coverColor:'#0277bd',reviews:[{name:'Glen',rating:4,comment:'A great continuation.'}]
    }
  ];

  // --- Quotes ---
  const quotes = [
    {quote:"Reading is dreaming with open eyes.", book:'Unknown'},
    {quote:"We read to know we are not alone.", book:'C.S. Lewis'},
    {quote:"Books are a uniquely portable magic.", book:'Stephen King'},
    {quote:"A reader lives a thousand lives before he dies.", book:'George R.R. Martin'}
  ];

  // --- Utilities ---
  function qs(sel, ctx=document) {return ctx.querySelector(sel)}
  function qsa(sel, ctx=document) {return Array.from(ctx.querySelectorAll(sel))}

  // --- DOM: Nav HAMB/Toggle ---
  function initNav(){
    const root = document.documentElement;
    const menuBtn = qs('.hamburger');
    if(!menuBtn) return;
    menuBtn.addEventListener('click', ()=>{
      document.querySelector('.header').classList.toggle('open');
    });
  }

  // --- Hero: rotating quotes ---
  function initQuotes(){
    const quoteEl = qs('.quote');
    if(!quoteEl) return;
    let idx = 0;
    function show(){
      const q = quotes[idx];
      quoteEl.textContent = `"${q.quote}" — ${q.book}`;
      idx = (idx+1)%quotes.length;
    }
    show();
    setInterval(show, 5000);
  }

  // --- Author of the Day ---
  function authorOfDay(){
    const authors = [...new Set(books.map(b=>b.author))];
    const day = Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/1000/60/60/24);
    const idx = day % authors.length;
    return authors[idx];
  }
  function initAuthorOfDay(){
    const el = qs('.author-of-day'); if(!el) return;
    el.textContent = authorOfDay();
  }

  // --- Newsletter ---
  function initNewsletter(){
    const form = qs('#newsletterForm'); if(!form) return;
    const input = qs('#newsletterEmail');
    const message = qs('#newsletterMsg');
    input.value = localStorage.getItem('readify-news-email')||'';
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = input.value.trim();
      if(!/\S+@\S+\.\S+/.test(email)) {message.textContent='Please provide valid email.'; return;}
      localStorage.setItem('readify-news-email', email);
      message.textContent='Thanks! You are subscribed.';
      setTimeout(()=>message.textContent='',2500);
    });
  }

    // --- Header nav progress bar update ---
    function updateNavBar(){
      const state = JSON.parse(localStorage.getItem('readify-progress')||'{}');
      const bar = qs('.nav-progress');
      let pct = 0;
      if(state && state.total && state.total>0) {
        pct = Math.min(100, Math.round((state.read||0)/state.total*100));
      }
      if(bar){ bar.style.width = pct + '%'; bar.title = state && state.lastSaved ? `${pct}% — saved ${new Date(state.lastSaved).toLocaleString()}` : `${pct}%`; }
    }

  // --- Book Explorer ---
  function renderBookCards(list){
    const grid = qs('.books-grid'); if(!grid) return;
    grid.innerHTML = '';
    list.forEach(book=>{
      const div = document.createElement('div'); div.className='card';
      div.dataset.id = book.id;
      const coverHtml = book.cover ? `<img src="${book.cover}" alt="${book.title} cover">` : `<div style="height:160px;border-radius:8px;background:${book.coverColor};display:flex;align-items:end;padding:12px;color:white;font-weight:700">${book.title}</div>`;
      div.innerHTML = `
        ${coverHtml}
        <h3>${book.title}</h3>
        <p class="small">${book.author} • ${book.genre} • ${book.pages} pages</p>
      `;
      div.addEventListener('click', ()=>openBookModal(book.id));
      grid.appendChild(div);
    });
  }
  function openBookModal(id){
    const b = books.find(x=>x.id===id); if(!b) return;
    const modal = qs('#bookModal');
    qs('#modal-title').textContent = b.title;
    const modalCover = qs('#modal-cover'); if(modalCover){ if(b.cover){ modalCover.src = b.cover; modalCover.style.display='block'; } else { modalCover.style.display='none'; } }
    qs('#modal-author').textContent = b.author;
    qs('#modal-synopsis').textContent = b.synopsis;
    const ul = qs('#modal-sequels'); ul.innerHTML='';
    if(b.sequels && b.sequels.length){
      b.sequels.forEach(sid=>{ const sb = books.find(x=>x.id===sid); if(sb){ const li=document.createElement('li'); li.textContent = `${sb.title} (by ${sb.author})`; ul.appendChild(li)} });
    } else { ul.innerHTML='<li class="small-muted">None</li>' }
    const table = qs('#modal-reviews tbody'); table.innerHTML='';
    if(Array.isArray(b.reviews) && b.reviews.length){
      b.reviews.forEach(r=>{ const tr = document.createElement('tr'); tr.innerHTML = `<td>${r.name}</td><td>${'★'.repeat(r.rating)}</td><td>${r.comment}</td>`; table.appendChild(tr)});
    } else { table.innerHTML='<tr><td class="small-muted" colspan="3">Be the first to review</td></tr>' }
    modal.classList.add('open');
  }
  function closeModal(){ const modal = qs('#bookModal'); if(modal) modal.classList.remove('open'); }

  function initExplorer(){
    const genres = Array.from(new Set(books.map(b=>b.genre)));
    const genreSelect = qs('#filterGenre'); if(genreSelect){ genreSelect.innerHTML = '<option value="">All genres</option>' + genres.map(g=>`<option value="${g}">${g}</option>`).join(''); }
    renderBookCards(books);

    const search = qs('#filterSearch'); const authorSel = qs('#filterAuthor');
    if(authorSel){ const authors = Array.from(new Set(books.map(b=>b.author))); authorSel.innerHTML = '<option value="">All authors</option>' + authors.map(a=>`<option value="${a}">${a}</option>`).join(''); }
    const apply = ()=>{
      const q = search.value.trim().toLowerCase(); const g=genreSelect.value; const a=authorSel.value;
      const filtered = books.filter(b=>{
        if(g && b.genre!==g) return false;
        if(a && b.author!==a) return false;
        if(q && !(b.title.toLowerCase().includes(q)||b.author.toLowerCase().includes(q))) return false;
        return true;
      });
      renderBookCards(filtered);
    };
    [search, genreSelect, authorSel].forEach(el=>el && el.addEventListener('input', apply));
    // clear filters
    const clearBtn = qs('#clearFilters'); if(clearBtn) clearBtn.addEventListener('click', ()=>{ if(search) search.value=''; if(genreSelect) genreSelect.value=''; if(authorSel) authorSel.value=''; apply(); });

    const modalClose = qs('#modalClose'); if(modalClose) modalClose.addEventListener('click', closeModal);
    qs('#bookModal')?.addEventListener('click', (e)=>{ if(e.target.classList.contains('modal')) closeModal(); });
    // If a recommender wants to open a specific book, check localStorage
    const openTarget = localStorage.getItem('readify-open'); if(openTarget){ localStorage.removeItem('readify-open'); setTimeout(()=>{ openBookModal(openTarget); }, 200); }
  }

  // --- Progress Tracker ---
  function initProgress(){
    const form = qs('#progressForm'); if(!form) return;
    const totalIn = qs('#totalPages'); const readIn = qs('#pagesRead'); const speedIn = qs('#speedPerDay');
    const pctTxt = qs('#pctComplete'); const estTxt = qs('#estFinish'); const prog = qs('.progress-value'); const saveBtn = qs('#saveProgress');

    let prevPct = 0;
    function celebrateCompletion(){
      // Simple celebration: change background or add text
      const card = qs('.progress-tracker-card');
      if(card){
        card.style.animation = 'none';
        setTimeout(() => card.style.animation = 'completionCelebration 1s ease-in-out', 10);
      }
      // Perhaps add confetti effect, but for simplicity, just animation
    }
    function animatePercent(from, to){
      const start = performance.now();
      const dur = 600;
      function loop(now){
        const t = Math.min(1,(now-start)/dur);
        const v = Math.round(from + (to-from)*t);
        pctTxt.textContent = v + '%';
        if(t<1) requestAnimationFrame(loop);
        else {
          // Check if completed
          if(v === 100 && from < 100){
            celebrateCompletion();
          }
        }
      }
      requestAnimationFrame(loop);
    }

    function calc(){
      const total = parseInt(totalIn.value)||0; const read = parseInt(readIn.value)||0; const speed = parseInt(speedIn.value)||0;
      const pct = total>0 ? Math.min(100, Math.max(0, Math.round(read/total*100))) : 0;
      animatePercent(prevPct,pct); prevPct = pct;
      prog.style.width = pct+'%';
      if(pct === 100){
        prog.style.background = 'linear-gradient(90deg,#4caf50,#66bb6a)';
      } else {
        prog.style.background = 'linear-gradient(90deg,var(--accent),var(--accent-2))';
      }
      if(speed>0 && total>read){ const pagesLeft = total-read; const days = Math.ceil(pagesLeft/speed); estTxt.textContent = `${days} day(s)`; } else if(total===read) { estTxt.textContent='Done'; } else { estTxt.textContent='—'; }
    }
    [totalIn, readIn, speedIn].forEach(i=>i.addEventListener('input', calc));
    // Arrow buttons for increment/decrement
    qsa('.arrow-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const dir = parseInt(btn.dataset.dir);
        const input = qs('#' + targetId);
        if (input) {
          let val = parseInt(input.value) || 0;
          val += dir;
          if (val < 0) val = 0;
          input.value = val;
          calc();
        }
      });
    });
    // load saved
    const saveState = JSON.parse(localStorage.getItem('readify-progress')||'{}');
    if(saveState){ totalIn.value = saveState.total||''; readIn.value = saveState.read||''; speedIn.value=saveState.speed||''; calc(); }
    else { calc(); }
    // set prevPct to current displayed value so animation is smooth next time
    prevPct = parseInt((pctTxt.textContent||'0').replace('%',''))||0;
    saveBtn?.addEventListener('click', ()=>{
      const total = parseInt(totalIn.value)||0;
      const read = parseInt(readIn.value)||0;
      const speed = parseInt(speedIn.value)||0;
      // Validation
      if(total <= 0) { alert('Total pages must be greater than 0.'); return; }
      if(read < 0) { alert('Pages read cannot be negative.'); return; }
      if(read > total) { alert('Pages read cannot exceed total pages.'); return; }
      if(speed < 0) { alert('Speed cannot be negative.'); return; }
      const state = {total, read, speed, lastSaved:new Date().toISOString()};
      localStorage.setItem('readify-progress', JSON.stringify(state));
      saveBtn.textContent='Saved'; 
      saveBtn.classList.add('saved-animation');
      setTimeout(()=>{ saveBtn.textContent='Save Progress'; saveBtn.classList.remove('saved-animation'); },1500);
      updateNavBar();
      // re-run calculation to reflect any computed values
      calc();
    });
  }

  // --- Recommender ---
  function initRecommender(){
    const genreSel = qs('#recGenre'); const lenSel = qs('#recLength'); const btn = qs('#recPick'); const out = qs('#recResult'); const pickAgain = qs('#recPickAgain'); const saveBtn = qs('#saveRec');
    if(!genreSel || !lenSel || !btn || !out) return; // only run on recommender page
    // populate options
    const genres = [...new Set(books.map(b=>b.genre))]; genreSel.innerHTML = '<option value="">Any genre</option>'+genres.map(g=>`<option>${g}</option>`).join('');
    lenSel.innerHTML = '<option value="">Any length</option><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option>';

    function pick(){
      const g=genreSel.value; const l=lenSel.value;
      const candidates = books.filter(b=> (g?b.genre===g:true) && (l?b.length===l:true));
      if(!candidates.length){ out.textContent = 'No matches.'; return; }
      const choice = candidates[Math.floor(Math.random()*candidates.length)];
      const coverImg = choice.cover ? `<img src="${choice.cover}" alt="${choice.title} cover" style="width:72px;height:96px;object-fit:cover;border-radius:6px">` : `<div style="width:72px;height:96px;background:${choice.coverColor};border-radius:6px"></div>`;
      out.innerHTML = `<div class="recommender-result">${coverImg}<div><strong>${choice.title}</strong><div class="small-muted">${choice.author} • ${choice.pages} pages</div></div></div>`;
      // Add optional watch video action if the book has a video
      if(choice.video){
        const videoWrap = document.createElement('div'); videoWrap.style.marginTop='8px'; videoWrap.innerHTML = `<button id="watchVideo" class="secondary">Watch related video</button><div id="videoBox" style="display:none;margin-top:8px"><div class="video-embed-wrap"><iframe class="video-embed" src="${choice.video}" frameborder="0" allowfullscreen loading="lazy"></iframe></div></div>`;
        out.appendChild(videoWrap);
        videoWrap.querySelector('#watchVideo')?.addEventListener('click', ()=>{ const box = videoWrap.querySelector('#videoBox'); if(box.style.display==='none'){ box.style.display='block'; } else { box.style.display='none'; } });
      }
      // add action: view in explorer
      const actions = document.createElement('div'); actions.style.marginTop = '8px'; actions.innerHTML = `<button class="secondary view-in-explorer">View in Explorer</button>`;
      out.appendChild(actions);
      const expBtn = out.querySelector('.view-in-explorer'); expBtn?.addEventListener('click', ()=>{ localStorage.setItem('readify-open', choice.id); window.location.href = 'book-explorer.html'; });
      out.dataset.id = choice.id;
      // enable save and update button label depending on previous save state
      const list = JSON.parse(localStorage.getItem('readify-list')||'[]');
      if(saveBtn){ if(list.includes(choice.id)){ saveBtn.disabled = true; saveBtn.textContent = 'Saved'; } else { saveBtn.disabled = false; saveBtn.textContent='Save'; } }
    }
    btn?.addEventListener('click', ()=>{ pick(); btn.classList.add('pick-again'); setTimeout(()=>btn.classList.remove('pick-again'),340); });
    pickAgain?.addEventListener('click', ()=>{ pick(); pickAgain.classList.add('pick-again'); setTimeout(()=>pickAgain.classList.remove('pick-again'),340);});
    // Save the current recommended book id
    if(saveBtn) saveBtn.disabled = true; // start disabled until a pick
    // show initial summary
    const counterSummary = qs('#readingListSummary'); if(counterSummary){ const len = JSON.parse(localStorage.getItem('readify-list')||'[]').length; counterSummary.textContent = len ? `Saved items: ${len}` : 'No saved items yet.'; }
    saveBtn?.addEventListener('click', ()=>{
      const id = out.dataset.id; if(!id) return; const list = JSON.parse(localStorage.getItem('readify-list')||'[]'); if(list.includes(id)) { saveBtn.textContent='Already saved'; setTimeout(()=>saveBtn.textContent='Save',1400); return; } list.push(id); localStorage.setItem('readify-list', JSON.stringify(list)); saveBtn.textContent='Saved'; setTimeout(()=>saveBtn.textContent='Save',1400);
      saveBtn.disabled = true;
      // update the reading list UI if present
      const counter = qs('#readingList'); if(counter){ const withData = JSON.parse(localStorage.getItem('readify-list')||'[]').map(id=>books.find(b=>b.id===id)).filter(Boolean); counter.innerHTML = withData.map(b=>`${b.title} — ${b.author}`).join('<br>'); }
      const counterSummary = qs('#readingListSummary'); if(counterSummary){ const len = JSON.parse(localStorage.getItem('readify-list')||'[]').length; counterSummary.textContent = len ? `Saved items: ${len}` : 'No saved items yet.'; }
    });
  }

  // --- Reading Flow & sounds ---
  // Create audio element without a source; set when user selects a track.
  const audio = new Audio(); audio.loop = true; audio.preload = 'auto';
  const soundTracks = [
    { id:'cozy', label:'Cozy Lounge', src:'https://cdn.pixabay.com/download/audio/2021/08/04/audio_4d44386fae.mp3?filename=cozy-lounge-10987.mp3' },
    { id:'rain', label:'Gentle Rain', src:'https://cdn.pixabay.com/download/audio/2022/03/11/audio_7d7c1f2c59.mp3?filename=soft-rain-118933.mp3' },
    { id:'cafe', label:'Cafe Ambience', src:'https://cdn.pixabay.com/download/audio/2021/08/05/audio_5c0a9b4b2b.mp3?filename=cafe-ambience-11172.mp3' }
  ];
  function initReadingFlow(){
    const playBtn = qs('#soundPlay'); const select = qs('#soundSelect'); const volume = qs('#soundVolume'); const completeList = qs('#completedList');
    if(select){
      // populate select
      select.innerHTML = '<option value="none">None</option>' + soundTracks.map(t=>`<option value="${t.id}">${t.label}</option>`).join('');
    }
    // restore saved selection and volume
    const savedTrack = localStorage.getItem('readify-sound-choice') || 'none';
    const savedVol = parseFloat(localStorage.getItem('readify-sound-volume') || '0.6');
    if(select) select.value = savedTrack;
    if(volume) { volume.value = savedVol; audio.volume = savedVol; }
    function setTrack(trackId){
      if(!trackId || trackId === 'none'){ audio.pause(); audio.src = ''; return; }
      const track = soundTracks.find(t => t.id === trackId);
      if(!track) return; audio.src = track.src; try{ audio.load(); }catch(e){}
    }
    // keep play button enabled. If no track selected on click, we'll pick a default.
    function checkPlayEnabled(){ if(playBtn) playBtn.disabled = false; }
    checkPlayEnabled();
    // apply saved track
    setTrack(savedTrack);
    // if saved playing, try to start (requires a user gesture typically)
    const wasPlaying = localStorage.getItem('readify-sound-playing') === '1';
    if(wasPlaying && audio.src){ audio.play().catch(()=>{}); }
    checkPlayEnabled();
    updatePlayLabel();
    updateSoundInfoUI();
    // play/pause button logic
    function updatePlayLabel(){ if(playBtn) playBtn.textContent = audio.paused ? 'Play' : 'Pause'; }
    playBtn?.addEventListener('click', ()=>{
      if(!audio.src){ // no track selected - choose default (cozy)
        const current = select?.value || 'none';
        if(current === 'none'){
          // pick the first actual track as default
          const defaultTrack = soundTracks.length ? soundTracks[0].id : 'none';
          if(defaultTrack !== 'none'){ select.value = defaultTrack; setTrack(defaultTrack); localStorage.setItem('readify-sound-choice', defaultTrack); }
          else { select?.focus(); return; }
        } else { setTrack(current); }
      }
      if(audio.paused){ audio.play().then(()=>{ updatePlayLabel(); localStorage.setItem('readify-sound-choice', select?.value || 'none'); localStorage.setItem('readify-sound-playing', '1'); updateSoundInfoUI(); }).catch(()=>{ /* ignore play error */ }); } else { audio.pause(); updatePlayLabel(); localStorage.setItem('readify-sound-playing', '0'); updateSoundInfoUI(); }
    });
    // update label on audio events
    audio.addEventListener('play', ()=>{ updatePlayLabel(); localStorage.setItem('readify-sound-playing', '1'); qs('#equalizer')?.classList.add('active'); });
    audio.addEventListener('pause', ()=>{ updatePlayLabel(); localStorage.setItem('readify-sound-playing', '0'); qs('#equalizer')?.classList.remove('active'); });
    // update sound info UI (same-tab updates)
    function updateSoundInfoUI(){
      const info = qs('#soundInfo'); const sel = select; const vol = volume; const playing = localStorage.getItem('readify-sound-playing') === '1';
      const trackText = sel && sel.value !== 'none' ? sel.options[sel.selectedIndex].text : 'No sound';
      const volP = vol ? Math.round(parseFloat(vol.value)*100) : 0;
      if(info) info.textContent = `${trackText} • Vol ${volP}% • ${playing ? 'Playing' : 'Paused'}`;
    }
    // select change
    select?.addEventListener('change', ()=>{ const v = select.value; localStorage.setItem('readify-sound-choice', v); setTrack(v); checkPlayEnabled(); if(!audio.paused && audio.src){ audio.play().catch(()=>{}); } updatePlayLabel(); updateSoundInfoUI(); });
    // volume change
    volume?.addEventListener('input', ()=>{ const v = parseFloat(volume.value); audio.volume = v; localStorage.setItem('readify-sound-volume', v); updateSoundInfoUI(); });
    // Load completed
    const comps = JSON.parse(localStorage.getItem('readify-completed')||'[]'); renderCompleted(comps);
    qs('#markCompleted')?.addEventListener('click', ()=>{
      const ref = qs('#completeBookId'); const id = ref.value.trim(); if(!id) return; const b = books.find(x=>x.id===id); if(!b) return; const comps = JSON.parse(localStorage.getItem('readify-completed')||'[]'); if(!comps.includes(id)){ comps.push(id); localStorage.setItem('readify-completed', JSON.stringify(comps)); renderCompleted(comps); }
    });
    function renderCompleted(arr){ completeList.innerHTML=''; arr.forEach(id=>{ const b = books.find(x=>x.id===id); if(!b) return; const li=document.createElement('li'); li.textContent = `${b.title} by ${b.author}`; completeList.appendChild(li); }); }
  }

  // --- Feedback form & FAQ ---
  function initFeedback(){
    const form = qs('#feedbackForm'); if(!form) return;
    const name = qs('#fbName'); const email = qs('#fbEmail'); const msg = qs('#fbMessage'); const out = qs('#fbMsg');
    form.addEventListener('submit', (e)=>{
      e.preventDefault(); out.textContent=''; out.classList.remove('msg-success','msg-error');
      const submitBtn = qs('button[type="submit"]', form);
      submitBtn.textContent = 'Sending...'; submitBtn.disabled = true;
      // Validation
      if(!name.value.trim()) { out.classList.add('msg-error'); out.textContent='Name required'; setTimeout(()=>{ out.classList.remove('msg-error'); submitBtn.textContent='📤 Send Feedback'; submitBtn.disabled=false; },3000); return; }
      if(!/\S+@\S+/.test(email.value)) { out.classList.add('msg-error'); out.textContent='Valid email required'; setTimeout(()=>{ out.classList.remove('msg-error'); submitBtn.textContent='📤 Send Feedback'; submitBtn.disabled=false; },3000); return; }
      if(msg.value.trim().length<10) { out.classList.add('msg-error'); out.textContent='Message too short'; setTimeout(()=>{ out.classList.remove('msg-error'); submitBtn.textContent='📤 Send Feedback'; submitBtn.disabled=false; },3000); return; }
      // Save feedback
      const list = JSON.parse(localStorage.getItem('readify-feedback')||'[]');
      list.push({name:name.value.trim(), email:email.value.trim(), message:msg.value.trim(), at:new Date().toISOString()});
      localStorage.setItem('readify-feedback', JSON.stringify(list));
      form.reset(); out.classList.add('msg-success'); out.textContent='Message is sent correctly';
      submitBtn.textContent='Sent!'; setTimeout(()=>{ submitBtn.textContent='📤 Send Feedback'; submitBtn.disabled=false; },3000);
      // Clear the message after a short while and remove success class
      setTimeout(()=>{ out.textContent=''; out.classList.remove('msg-success'); },3000);
      // Update any UI hooks that show the number of feedbacks
      window.dispatchEvent(new Event('readify.feedback.updated'));
    });
    // FAQ accordion
    qsa('.accordion .accordion-title').forEach(title=>{ title.addEventListener('click', ()=>{
      const item = title.parentElement; item.classList.toggle('open');
    }); });
  }

  // --- Init all pages ---
  function init(){
    document.documentElement.lang = 'en';
    initNav(); initQuotes(); initAuthorOfDay(); initNewsletter(); initExplorer(); initProgress(); initRecommender(); initReadingFlow(); initFeedback();
      // Update nav progress bar
      updateNavBar();
      // Update when other tabs modify localStorage
      window.addEventListener('storage', (e)=>{ if(e.key==='readify-progress') updateNavBar(); });
    // Save book data for other pages to read optionally
    try{ localStorage.setItem('readify-books', JSON.stringify(books)); }catch(e){}
  }

  return { init, books };
})();

window.addEventListener('DOMContentLoaded', ()=>{ Readify.init(); });
