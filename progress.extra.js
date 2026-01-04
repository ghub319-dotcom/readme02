// Extra JS for Progress page: show saved time in a friendly format
document.addEventListener('DOMContentLoaded', ()=>{
  const saveBtn = document.getElementById('saveProgress');
  const progressMsg = document.createElement('div'); progressMsg.className='small-muted';
  saveBtn?.parentElement?.appendChild(progressMsg);
  // show last saved info from storage
  const saved = JSON.parse(localStorage.getItem('readify-progress')||'{}');
  if(saved && saved.lastSaved){ progressMsg.textContent = `Last save: ${new Date(saved.lastSaved).toLocaleString()}`; }
  saveBtn?.addEventListener('click', ()=>{ setTimeout(()=>{ const s = JSON.parse(localStorage.getItem('readify-progress')||'{}'); if(s && s.lastSaved) progressMsg.textContent = `Last save: ${new Date(s.lastSaved).toLocaleString()}`; },200); });

  // Goals
  const dailyGoal = document.getElementById('dailyPagesGoal');
  const weeklyGoal = document.getElementById('weeklyBooksGoal');
  const monthlyGoal = document.getElementById('monthlyPagesGoal');
  const saveGoalsBtn = document.getElementById('saveGoals');

  // Load saved goals
  const goals = JSON.parse(localStorage.getItem('readify-goals') || '{}');
  if(dailyGoal) dailyGoal.value = goals.daily || '';
  if(weeklyGoal) weeklyGoal.value = goals.weekly || '';
  if(monthlyGoal) monthlyGoal.value = goals.monthly || '';

  saveGoalsBtn?.addEventListener('click', ()=>{
    const g = {
      daily: parseInt(dailyGoal.value) || 0,
      weekly: parseInt(weeklyGoal.value) || 0,
      monthly: parseInt(monthlyGoal.value) || 0
    };
    localStorage.setItem('readify-goals', JSON.stringify(g));
    saveGoalsBtn.textContent = 'Saved';
    saveGoalsBtn.classList.add('saved-animation');
    setTimeout(() => {
      saveGoalsBtn.textContent = 'Save Goals';
      saveGoalsBtn.classList.remove('saved-animation');
    }, 1500);
  });

  // Animate number function
  function animateNumber(element, from, to, duration = 1000) {
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(from + (to - from) * progress);
      element.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Stats
  let currentPeriod = 'all';
  function updateStats(period = 'all'){
    currentPeriod = period;
    const history = JSON.parse(localStorage.getItem('readify-progress-history') || '[]');
    const completed = JSON.parse(localStorage.getItem('readify-completed') || '[]');

    // Filter history by period
    const now = new Date();
    let filteredHistory = history;
    if(period === 'week'){
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredHistory = history.filter(entry => new Date(entry.date) >= weekAgo);
    } else if(period === 'month'){
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filteredHistory = history.filter(entry => new Date(entry.date) >= monthAgo);
    }

    // Total pages read from filtered history
    const totalPages = filteredHistory.reduce((sum, entry) => sum + (entry.read || 0), 0);
    const totalPagesEl = document.getElementById('totalPagesRead');
    animateNumber(totalPagesEl, parseInt(totalPagesEl.textContent) || 0, totalPages);

    // Books completed (all time, since completed is cumulative)
    const booksEl = document.getElementById('totalBooksCompleted');
    animateNumber(booksEl, parseInt(booksEl.textContent) || 0, completed.length);

    // Average speed from filtered
    const speeds = filteredHistory.filter(entry => entry.speed > 0).map(entry => entry.speed);
    const avgSpeed = speeds.length ? Math.round(speeds.reduce((a,b)=>a+b,0)/speeds.length) : 0;
    const speedEl = document.getElementById('averageSpeed');
    animateNumber(speedEl, parseInt(speedEl.textContent) || 0, avgSpeed);

    // Reading streak (unique dates in filtered)
    const dates = filteredHistory.map(entry => new Date(entry.date).toDateString());
    const uniqueDates = [...new Set(dates)];
    const streakEl = document.getElementById('readingStreak');
    animateNumber(streakEl, parseInt(streakEl.textContent) || 0, uniqueDates.length);
  }

  // Filter buttons
  document.querySelectorAll('.stat-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stat-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateStats(btn.dataset.period);
    });
  });

  // Reset stats
  document.getElementById('resetStats')?.addEventListener('click', () => {
    if(confirm('Are you sure you want to reset all statistics and history? This cannot be undone.')){
      localStorage.removeItem('readify-progress-history');
      updateStats(currentPeriod);
      updateHistory();
    }
  });

  // Calculate stats
  document.getElementById('calculateStats')?.addEventListener('click', () => {
    const btn = document.getElementById('calculateStats');
    btn.textContent = 'Calculating...';
    btn.disabled = true;
    updateStats(currentPeriod);
    setTimeout(() => {
      btn.textContent = '🔄 Calculate';
      btn.disabled = false;
    }, 1000);
  });

  // Progress History
  function updateHistory(){
    const history = JSON.parse(localStorage.getItem('readify-progress-history') || '[]');
    const list = document.getElementById('progressHistory');
    list.innerHTML = '';
    if(history.length === 0){
      list.innerHTML = '<li class="small-muted">No progress entries yet.</li>';
    } else {
      history.slice(-10).reverse().forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.book || 'Book'}: ${entry.read}/${entry.total} pages (${new Date(entry.date).toLocaleDateString()})`;
        list.appendChild(li);
      });
    }
  }

  // Modify save to add to history
  const originalSave = saveBtn?.addEventListener;
  saveBtn?.addEventListener('click', () => {
    setTimeout(() => {
      const progress = JSON.parse(localStorage.getItem('readify-progress') || '{}');
      if(progress.lastSaved){
        const history = JSON.parse(localStorage.getItem('readify-progress-history') || '[]');
        const bookTitle = document.getElementById('bookTitle').value || 'Untitled';
        history.push({
          book: bookTitle,
          total: progress.total,
          read: progress.read,
          speed: progress.speed,
          date: progress.lastSaved
        });
        localStorage.setItem('readify-progress-history', JSON.stringify(history));
        updateStats();
        updateHistory();
      }
    }, 300);
  });

  // Initial load
  updateStats('all');
  updateHistory();
});
