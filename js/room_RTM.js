let handleMemberJoined = async (MemberId) => {
  console.log("New member has joined the room:", MemberId);
  addMemberToDom(MemberId);
};

//shows the memberId to participant section later will then change to name of users
let addMemberToDom = async (MemberId) => {
  let membersWrap = document.getElementById("member__list");
  let memberItem = `<div class="member__wrapper" id="member__${MemberId}__wrapper">
                    <span class="green__icon"></span>
                    <p class="member_name">${MemberId}</p>
                    </div>`;

  membersWrap.insertAdjacentHTML("beforeend", memberItem);
};

let handleMemberLeft = async (MemberId) => {
  removeMemberFromDOM(MemberId);
};

let removeMemberFromDOM = async (MemberId) => {
  //get the specific id from the DOM
  let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`);
  memberWrapper.remove();
};

//when users leave channle will trigger
let leaveChannel = async () => {
  await channel.leave();
  await rtmClient.logout();
};

window.addEventListener("beforeunload", leaveChannel);
