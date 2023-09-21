const APP_ID = "a39bdeba8e97439586641d7af2c66192"
const CHANNEL = sessionStorage.getItem('Room')
const TOKEN = sessionStorage.getItem('token')
let UID = Number(sessionStorage.getItem('uid'))
let Username = sessionStorage.getItem('user')

const client = AgoraRTC.createClient({
    mode : "rtc",
    codec: "vp8",
});

let localTracks = [] ;// Storing the data of local Clients
let remoteUsers = {} ;// Storing the data of remote user in key value pairs

let joinAndDisplayLocalStream = async() =>{

    document.getElementById('room-name').innerHTML = `${CHANNEL}`
    
    // When a new user joins
    client.on('user-published', async (user, mediaType)=> {
            remoteUsers[user.uid] = user;

            await client.subscribe(user, mediaType);
            if(mediaType === "video"){

                let player = document.getElementById(`user-container-${user.uid}`)

                if (player != null){
                    player.remove();
                }

                let new_member = await getMember(user)

                // checking if that user does not already exists 
                if(player == null){
                    console.log("Player Created")
                    // Creating a new user 
                    player = `<div class="video-container" id="user-container-${user.uid}"> 
                        <div class="Username-wrapper">
                            <span class="Username">${new_member.name}<span>
                        </div>
                        <div class="video-player" id="user-${user.uid}">
                        </div>
                    </div>`

                    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
                }
                user.videoTrack.play(`user-${user.uid}`)
            }
            
            if(mediaType === "audio"){
                user.audioTrack.play()
            }
    });

    // When a user leaves the room
    client.on('user-left', async (user)=>{
        delete remoteUsers[user.uid]
        document.getElementById(`user-container-${user.uid}`).remove()
    });

// Setting up the rooom for the host uer
    try{
        UID = await client.join(APP_ID, CHANNEL, TOKEN, UID)
    }catch(error){
        console.log(error)
        window.open('/','_self')
    }

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()
    
    let member = await createUser()

    let player = `<div class="video-container" id="user-container-${UID}"> 
                <div class="Username-wrapper">
                    <span class="Username">${member.name}<span>
                </div>
                <div class="video-player" id="user-${UID}">
                </div>
            </div>`

    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player) // position, text
    //0 - audio Track
    //1 - video Track
    localTracks[1].play(`user-${UID}`)

    await client.publish([localTracks[0], localTracks[1]])
}

// Function that removes the player and redirects the control to lobby
let leaveAndExitRoom = async () => {
    for(let i = 0; i < localTracks.length; i++) {
        localTracks[i].stop();
        localTracks[i].close();
    }
    await client.leave()
    window.open('/', '_self')
}


// ToggleCamera 
let toggleCamera = async(e)=>{
    if (localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.background = "white"
    }
    else{
        await localTracks[1].setMuted(true)
        e.target.style.background = "rgba(255, 80, 80, 1)"
    }
}

let toggleAudio = async (e)=>{
    if (localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.background = "white"
    }else{
        await localTracks[0].setMuted(true)
        e.target.style.background = "rgba(255, 80, 80, 1)"
    }
}

let createUser = async ()=>{
    let response = await fetch('/createUser/', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'name':Username,
            'uid':UID,
            "roomName":CHANNEL,
        }),
    })
    let member = await response.json()
    return member
}


let getMember = async (user)=>{
    let response = await fetch(`/getMember/?uid=${user.uid}&room=${CHANNEL}`)
    let new_member = await response.json()
    console.log("Member : "+ new_member.name)
    return new_member
}


let delMember = async () =>{
    let response = await fetch(`/deleteMember/`,{
        method: 'POST',
        header:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                        'name':Username,
            'uid':UID,
            "roomName":CHANNEL,
        }),
    })
    let member = await response.json()
    print(member)
}

joinAndDisplayLocalStream()
document.getElementById('leave-btn').addEventListener('click', leaveAndExitRoom)
document.getElementById('video-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleAudio)