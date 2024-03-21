const APP_ID = "a074be31475d4373b6363d9e1e2013be"; //set up the app_id from agora

let uid = sessionStorage.getItem("uid");

//generate uid if users don't have
if (!uid) {
  uid = String(Math.floor(Math.random() * 10000));
  sessionStorage.setItem("uid", uid);
}

//need a token for authentication
let token = null;

let client; //store information about the users like media dev info's

//create custom rooms
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let roomId = urlParams.get("room");

//we need to have a room id (room.html?room=123)
//if there is no room id should direct to lobby or main
if (!roomId) {
  roomId = "main";
}

//actual video/audio stream and store them in a variable remoteUsers
let localTracks = [];
let remoteUsers = {};

//user joining and displaying the screen
let joinRoom = async () => {
  //set up the client using agora SDk
  client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }); //live or rtc i mode
  await client.join(APP_ID, roomId, token, uid);

  joinStream();
};

let joinStream = async () => {
  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks(); //ask for media devices

  //create the container where players show
  let player = `<div class="video__container" id="user-container-${uid}">
                        <div class="video-player" id="user-${uid}"></div>
                    </div>`;

  document
    .getElementById("streams__container")
    .insertAdjacentHTML("beforeend", player);

  localTracks[1].play(`user-${uid}`);
};

joinRoom();
