const tMenu=document.querySelector(".toggleMenu > a");
const navBar=document.querySelector("nav");

tMenu.addEventListener("click",function()
{
  navBar.classList.toggle("active");
  
  tMenu.classList.toggle("active");

});