// event listner for hamburger menu
import $ from "jquery";

$(document).add("DomContentLoaded", () => {
  const navBtn = $(".nav-btn");
});
navBtn.on("click", () => {
  this.classList.toggle("toggled");
});
