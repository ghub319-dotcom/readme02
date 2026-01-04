// Extra JS for home page (animations and small UX)
document.addEventListener('DOMContentLoaded', ()=>{
  const hero = document.querySelector('.hero-left');
  if(hero){ hero.animate([{transform:'translateY(6px)', opacity:0.98},{transform:'translateY(0px)', opacity:1}],{duration:700, easing:'ease-out'}); }
  // Apply background image class for the homepage and ensure focus order
  document.documentElement.lang = document.documentElement.lang || 'en';
});
