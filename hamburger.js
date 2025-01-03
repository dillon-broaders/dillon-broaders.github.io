const hamburger = document.querySelector('.hamburger');
const closeMenu = document.querySelector('.close-menu');
const header = document.querySelector('.header');

hamburger.addEventListener('click', () => {
  header.classList.add('active');  
});

closeMenu.addEventListener('click', () => {
  header.classList.remove('active');  
});