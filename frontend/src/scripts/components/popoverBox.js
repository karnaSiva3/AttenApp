const profilePic = document.querySelector(".profile-pic");
const popOver = document.querySelector(".pop-over");
const closeBtn = document.querySelector(".close-btn");

profilePic.addEventListener("click", function () {
  popOver.style.display = "block";
});

closeBtn.addEventListener("click", function () {
  popOver.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target != profilePic && !popOver.contains(event.target)) {
    popOver.style.display = "none";
  }
});