// Extra JS for Reading Flow: small instructions
document.addEventListener('DOMContentLoaded', ()=>{
  // Sample data: books (copied from app.js for reliability)
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

  const ref = document.getElementById('completeBookId'); if(ref) ref.placeholder = 'e.g. b1, b3';
  const select = document.getElementById('soundSelect'); const volume = document.getElementById('soundVolume'); const info = document.getElementById('soundInfo');
  function showInfo(){
    const trackText = select && select.value !== 'none' ? select.options[select.selectedIndex].text : 'No sound';
    const vol = volume ? parseFloat(volume.value) : 0; const playing = localStorage.getItem('readify-sound-playing') === '1';
    if(info) info.textContent = `${trackText} • Vol ${(vol*100).toFixed(0)}% • ${playing? 'Playing' : 'Paused'}`;
  }
  showInfo();
  select?.addEventListener('change', showInfo); volume?.addEventListener('input', showInfo);
  window.addEventListener('storage', (e)=>{ if(['readify-sound-choice','readify-sound-volume','readify-sound-playing'].includes(e.key)) showInfo(); });
  
  // Clear completed books button
  const clearBtn = document.getElementById('clearCompleted');
  clearBtn?.addEventListener('click', ()=>{
    localStorage.removeItem('readify-completed');
    document.getElementById('completeBookId').value = '';
    const completedList = document.getElementById('completedList');
    if(completedList) completedList.innerHTML = '<li style="color:var(--muted)">No books completed yet.</li>';
  });

  // Sound functionality using Web Audio API
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);
  let oscillator = null;
  let isPlaying = false;

  const soundTracks = [
    { id:'cozy', label:'Cozy Lounge', freq: 200 },
    { id:'rain', label:'Gentle Rain', freq: 100 },
    { id:'cafe', label:'Cafe Ambience', freq: 300 }
  ];

  const playBtn = document.getElementById('soundPlay');
  const completeList = document.getElementById('completedList');

  if(select){
    select.innerHTML = '<option value="none">🔇 None</option>' + soundTracks.map(t=>`<option value="${t.id}">${t.label}</option>`).join('');
  }

  const savedTrack = localStorage.getItem('readify-sound-choice') || 'none';
  const savedVol = parseFloat(localStorage.getItem('readify-sound-volume') || '0.6');
  if(select) select.value = savedTrack;
  if(volume) { volume.value = savedVol; gainNode.gain.setValueAtTime(savedVol, audioContext.currentTime); }

  function setTrack(trackId){
    if(oscillator) {
      oscillator.stop();
      oscillator = null;
    }
    if(trackId && trackId !== 'none'){
      const track = soundTracks.find(t => t.id === trackId);
      if(track){
        oscillator = audioContext.createOscillator();
        oscillator.frequency.setValueAtTime(track.freq, audioContext.currentTime);
        oscillator.connect(gainNode);
        if(isPlaying) oscillator.start();
      }
    }
  }

  const wasPlaying = localStorage.getItem('readify-sound-playing') === '1';
  if(wasPlaying && savedTrack !== 'none'){
    setTrack(savedTrack);
    isPlaying = true;
  }
  updatePlayLabel();
  showInfo();

  function updatePlayLabel(){ if(playBtn) playBtn.textContent = isPlaying ? '⏸️ Pause' : '▶️ Play'; }

  playBtn?.addEventListener('click', ()=>{
    console.log('Play button clicked, isPlaying:', isPlaying);
    if(!isPlaying){
      if(!oscillator){
        const current = select?.value || 'none';
        if(current === 'none'){
          const defaultTrack = soundTracks.length ? soundTracks[0].id : 'none';
          if(defaultTrack !== 'none'){ select.value = defaultTrack; setTrack(defaultTrack); localStorage.setItem('readify-sound-choice', defaultTrack); }
          else { select?.focus(); return; }
        } else { setTrack(current); }
      }
      if(oscillator){
        oscillator.start();
        isPlaying = true;
        console.log('Audio started');
        updatePlayLabel(); localStorage.setItem('readify-sound-choice', select?.value || 'none'); localStorage.setItem('readify-sound-playing', '1'); showInfo();
        document.getElementById('equalizer')?.classList.add('active');
      }
    } else {
      if(oscillator){
        oscillator.stop();
        oscillator = null;
        isPlaying = false;
        console.log('Audio stopped');
        updatePlayLabel(); localStorage.setItem('readify-sound-playing', '0'); showInfo();
        document.getElementById('equalizer')?.classList.remove('active');
      }
    }
  });

  select?.addEventListener('change', ()=>{ const v = select.value; localStorage.setItem('readify-sound-choice', v); setTrack(v); updatePlayLabel(); showInfo(); });
  volume?.addEventListener('input', ()=>{ const v = parseFloat(volume.value); gainNode.gain.setValueAtTime(v, audioContext.currentTime); localStorage.setItem('readify-sound-volume', v); showInfo(); });

  // Completed books functionality
  const comps = JSON.parse(localStorage.getItem('readify-completed')||'[]'); 
  renderCompleted(comps);

  document.getElementById('markCompleted')?.addEventListener('click', ()=>{
    const ref = document.getElementById('completeBookId'); const id = ref.value.trim(); if(!id) return; 
    const b = books.find(x=>x.id===id); if(!b) return; 
    const comps = JSON.parse(localStorage.getItem('readify-completed')||'[]'); 
    if(!comps.includes(id)){ comps.push(id); localStorage.setItem('readify-completed', JSON.stringify(comps)); renderCompleted(comps); }
    ref.value = '';
  });

  function renderCompleted(arr){ 
    completeList.innerHTML=''; 
    if(arr.length === 0){
      completeList.innerHTML = '<li style="color:var(--muted)">No books completed yet.</li>';
    } else {
      arr.forEach(id=>{ const b = books.find(x=>x.id===id); if(!b) return; const li=document.createElement('li'); li.textContent = `${b.title} by ${b.author}`; completeList.appendChild(li); }); 
    }
  }
});
