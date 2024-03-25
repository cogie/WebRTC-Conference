let form = document.getElementById("lobby__form");

//get the name of the user via localStorage
let displayName = localStorage.getItem("display_name");
if (displayName) {
  form.name.value = displayName;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  //set the name value after submit it
  localStorage.setItem("display_name", e.target.name.value);

  //need to get the roomName
  let inviteCode = e.target.room.value;

  //checks
  if (!inviteCode) {
    inviteCode = String(Math.floor(Math.random() * 10000));
  }
  window.location = `room.html?room=${inviteCode}`;
});
