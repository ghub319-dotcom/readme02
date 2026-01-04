// Extra JS for the Recommender page: auto-show saver count
document.addEventListener('DOMContentLoaded', ()=>{
  const counter = document.getElementById('readingListSummary');
  function update(){ const list = JSON.parse(localStorage.getItem('readify-list')||'[]'); counter.textContent = list.length ? `Saved items: ${list.length}` : 'No saved items yet.'; }
  update();
  document.querySelector('#saveRec')?.addEventListener('click', update);

  // Recommendation history
  function updateHistory(){
    const history = JSON.parse(localStorage.getItem('readify-rec-history') || '[]');
    const list = document.getElementById('recHistory');
    list.innerHTML = '';
    if(history.length === 0){
      list.innerHTML = '<li class="small-muted">No recommendations yet.</li>';
    } else {
      history.slice(-10).reverse().forEach(rec => {
        const li = document.createElement('li');
        const date = new Date(rec.date).toLocaleDateString();
        li.innerHTML = `<strong>${rec.title}</strong> by ${rec.author} (${rec.genre}) <small class="small-muted">- ${date}</small>`;
        list.appendChild(li);
      });
    }
  }

  // Favorite genres
  function updateFavorites(){
    const history = JSON.parse(localStorage.getItem('readify-rec-history') || '[]');
    const genres = {};
    history.forEach(rec => {
      genres[rec.genre] = (genres[rec.genre] || 0) + 1;
    });
    const sorted = Object.entries(genres).sort((a,b)=>b[1]-a[1]);
    const fav = document.getElementById('favoriteGenres');
    if(sorted.length === 0){
      fav.textContent = 'No data yet.';
    } else {
      fav.textContent = sorted.slice(0,3).map(([g,c])=>`${g} (${c})`).join(', ');
    }
  }

  // Modify save to add to history
  const originalSave = document.querySelector('#saveRec')?.addEventListener;
  document.querySelector('#saveRec')?.addEventListener('click', () => {
    setTimeout(() => {
      const result = document.getElementById('recResult');
      if(result && result.innerHTML){
        // Extract book info, assuming it's displayed
        // Since the result is set in app.js, we need to get the current book
        // For simplicity, assume we can get from result text
        const text = result.textContent;
        const match = text.match(/(.+) by (.+) \((.+)\)/);
        if(match){
          const [,title,author,genre] = match;
          const history = JSON.parse(localStorage.getItem('readify-rec-history') || '[]');
          history.push({title, author, genre, date: new Date().toISOString()});
          localStorage.setItem('readify-rec-history', JSON.stringify(history));
          updateHistory();
          updateFavorites();
        }
      }
    }, 200);
  });

  // Initial load
  updateHistory();
  updateFavorites();
});
