let handleMemberJoined = async (MemberId) => {
  console.log("New member has joined the room:", MemberId);
  addMemberToDom(MemberId);

  let members = await channel.getMembers();
  updateMemberTotal(members);

  let { name } = await rtmClient.getUserAttributesByKeys(MemberId, ["name"]);
  addBotMessageToDOM(`Welcome Aboard ${name}! 👋`);
};

//shows the memberId to participant section later will then change to name of users
let addMemberToDom = async (MemberId) => {
  let { name } = await rtmClient.getUserAttributesByKeys(MemberId, ["name"]);

  let membersWrap = document.getElementById("member__list");
  let memberItem = `<div class="member__wrapper" id="member__${MemberId}__wrapper">
                    <span class="green__icon"></span>
                    <p class="member_name">${name}</p>
                    </div>`;

  membersWrap.insertAdjacentHTML("beforeend", memberItem);
};

let updateMemberTotal = async (members) => {
  let total = document.getElementById("members__count");
  total.innerText = members.length;
};

let handleMemberLeft = async (MemberId) => {
  removeMemberFromDOM(MemberId);

  let members = await channel.getMembers();
  updateMemberTotal(members);
};

let removeMemberFromDOM = async (MemberId) => {
  //get the specific id from the DOM
  let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`);
  let name = memberWrapper.getElementsByClassName("member_name")[0].textContent;
  addBotMessageToDOM(`${name} has left.`);
  memberWrapper.remove();
};

//get all member ID and display to DOM realtime
let getMembers = async () => {
  let members = await channel.getMembers();
  updateMemberTotal(members);
  for (let i = 0; members.length > i; i++) {
    addMemberToDom(members[i]);
  }
};

//handles the message from the channel = diff users
let handleChannelMessage = async (MessageData, MemberId) => {
  console.log("New message recieved!");

  //parse the data since it was strigyfied
  let data = JSON.parse(MessageData.text);
  console.log("Message:", data);

  //check and show message to the channel multi users
  if (data.type === "chat") {
    addMessageToDOM(data.displayName, data.message);
  }

  if (data.type === "user_left") {
    document.getElementById(`user-container-${data.uid}`).remove();

    if (userIdInDisplayFrame === `user-container-${uid}`) {
      displayFrame.style.display = null;

      //loop through vidFrames
      for (let i = 0; vidFrames.length > i; i++) {
        vidFrames[i].style.height = "300px";
        vidFrames[i].style.width = "300px";
      }
    }
  }
};

//trigger when sending messages
let sendMessage = async (e) => {
  e.preventDefault();

  //get the message from the form
  let message = e.target.message.value;
  channel.sendMessage({
    text: JSON.stringify({
      type: "chat",
      message: message,
      displayName: displayName,
    }),
  });
  addMessageToDOM(displayName, message);
  e.target.reset();
};

//show message to DOM
let addMessageToDOM = async (name, message) => {
  let messageWrapper = document.getElementById("messages");

  let newMessage = `<div class="message__wrapper">
                        <div class="message__body">
                            <strong class="message__author">${name}</strong>
                            <p class="message__text">${message}</p>
                        </div>
                    </div>`;

  messageWrapper.insertAdjacentHTML("beforeend", newMessage);

  let lastMessage = document.querySelector(
    "#messages .message__wrapper:last-child"
  );
  //check
  if (lastMessage) {
    lastMessage.scrollIntoView();
  }
};

//add both that notify when new users joined the channel
let addBotMessageToDOM = async (botMessage) => {
  let messageWrapper = document.getElementById("messages");

  let newMessage = `<div class="message__wrapper">
                        <div class="message__body__bot">
                            <strong class="message__author__bot">🤖 Maco Bot</strong>
                            <p class="message__text__bot">${botMessage}</p>
                        </div>
                    </div>`;

  messageWrapper.insertAdjacentHTML("beforeend", newMessage);

  let lastMessage = document.querySelector(
    "#messages .message__wrapper:last-child"
  );
  //check
  if (lastMessage) {
    lastMessage.scrollIntoView();
  }
};

//when users leave channle will trigger
let leaveChannel = async () => {
  await channel.leave();
  await rtmClient.logout();
};

let msgForm = document.getElementById("message__form");

window.addEventListener("beforeunload", leaveChannel);
msgForm.addEventListener("submit", sendMessage);
