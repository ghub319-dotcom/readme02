// Extra behaviors for the Book Explorer page
document.addEventListener('DOMContentLoaded', ()=>{
  // Ensure images are loaded and give them rounded corners
  document.querySelectorAll('.books-grid img').forEach(img=>{
    img.style.borderRadius = '8px';
    img.style.height = '160px';
    img.style.width = '100%';
    img.style.objectFit = 'cover';
  });
});
