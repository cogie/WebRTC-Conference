let handleMemberJoined = async (MemberId) => {
  console.log("New member has joined the room:", MemberId);
  addMemberToDom(MemberId);

  let members = await channel.getMembers();
  updateMemberTotal(members);
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
      displaName: displayName,
    }),
  });
  e.target.reset();
};

//when users leave channle will trigger
let leaveChannel = async () => {
  await channel.leave();
  await rtmClient.logout();
};

let msgForm = document.getElementById("message__form");

window.addEventListener("beforeunload", leaveChannel);
msgForm.addEventListener("submit", sendMessage);
