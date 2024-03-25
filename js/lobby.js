let form = document.getElementById("lobby__form");

form.addEventListener("submit", (e) => {
  e.prevenDefault();

  //need to get the roomName
  let inviteCode = e.target.room.value;

  //checks
  if (!inviteCode) {
    inviteCode = String(Math.floor(Math.random() * 10000));
  }
  window.location = `room.html?room${inviteCode}`;
});
