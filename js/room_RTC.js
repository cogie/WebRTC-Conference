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

  //call when users publish && left
  client.on("user-published", handleUserPublished);
  client.on("user-left", handleUserLeft);

  joinStream();
};

let joinStream = async () => {
  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks({}, {encoderConfig:{
    width:{min:640, ideal:1920, max:1920},
    height:{min:480, ideal:1080, max:1080}
  }}); //ask for media devices and set the resolution

  //create the container where players show
  let player = `<div class="video__container" id="user-container-${uid}">
                        <div class="video-player" id="user-${uid}"></div>
                    </div>`;

  document
    .getElementById("streams__container")
    .insertAdjacentHTML("beforeend", player); // add item to the DOM
  document
    .getElementById(`user-container-${uid}`)
    .addEventListener("click", expandVideoFrame);

  localTracks[1].play(`user-${uid}`); //plays the video since arr[0] = audio && arr[1] = video
  await client.publish([localTracks[0], localTracks[1]]); //both audio and video published
};

//publishing the stream
let handleUserPublished = async (user, mediaType) => {
  remoteUsers[user.uid] = user;

  await client.subscribe(user, mediaType); // subscribe to user track

  let player = document.getElementById(`user-container-${user.uid}`);

  //check for duplicates users
  if (player === null) {
    player = `<div class="video__container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div>
                    </div>`;

    document
      .getElementById("streams__container")
      .insertAdjacentHTML("beforeend", player);
    document
      .getElementById(`user-container-${user.uid}`)
      .addEventListener("click", expandVideoFrame);
  }

  //checks
  if (displayFrame.style.display) {
    player.style.height = "100px";
    player.style.width = "100px";
  }
  if (mediaType === "video") {
    user.videoTrack.play(`user-${user.uid}`);
  }

  if (mediaType === "audio") {
    user.audioTrack.play();
  }
};

//deletes the frame of user if it leaves the call
let handleUserLeft = async (user) => {
  delete remoteUsers[user.uid];
  document.getElementById(`user-container-${user.uid}`).remove();

  if (userIdInDisplayFrame === `user-container-${user.uid}`) {
    displayFrame.style.display = null;
  }

  let vidFrames = document.getElementById("video__container");

  for (let i = 0; vidFrames.length > i; i++) {
    vidFrames[i].style.height = "300px";
    vidFrames[i].style.width = "300px";
  }
};

//toggling mic
let toggleMic = async (e) => {
  let button = e.currentTarget;

  if (localTracks[0].muted) {
    await localTracks[0].setMuted(false);
    button.classList.add('active');
    console.log('Microphone on')
  } else {
    await localTracks[0].setMuted(true);
    button.classList.remove('active');
    console.log('Microphone off');
  }
}

//toggling camera
let toggleCamera = async (e) => {
  let button = e.currentTarget;

  if (localTracks[1].muted) {
    await localTracks[1].setMuted(false);
    button.classList.add('active')
    console.log('Camera on')
  } else {
    await localTracks[1].setMuted(true);
    button.classList.remove('active')
    console.log('Camera off')
  }
}


document.getElementById('mic-btn').addEventListener('click', toggleMic);
document.getElementById('camera-btn').addEventListener('click', toggleCamera);

joinRoom();
