// Extra JS for feedback page: show count of feedback
document.addEventListener('DOMContentLoaded', ()=>{
  const badge = document.createElement('div'); badge.className='small-muted'; badge.style.marginTop='8px';
  const container = document.getElementById('fbMsg'); container?.parentElement?.appendChild(badge);
  function update(){ const list = JSON.parse(localStorage.getItem('readify-feedback')||'[]'); badge.textContent = list.length ? `Feedback submitted: ${list.length}` : 'No feedback yet.'; }
  update();
  document.getElementById('feedbackForm')?.addEventListener('submit', ()=>{ setTimeout(update, 150); });
  // Also listen for programmatic updates
  window.addEventListener('readify.feedback.updated', ()=>{ setTimeout(update, 50); });
});
