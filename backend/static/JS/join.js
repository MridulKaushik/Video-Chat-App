let form = document.getElementById("form")

let TitleCase = (str) =>{
    return str.toLowerCase().split(' ').map((word)=>{
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

let handelSubmit = async (e) =>{
    e.preventDefault()
    let room = TitleCase(e.target.room.value)
    let response = await fetch(`/getToken/?channelName=${room}`)
    let data = await response.json()
    let username = e.target.name.value

    sessionStorage.setItem('uid', data.uid)
    sessionStorage.setItem('token', data.token)
    sessionStorage.setItem('Room', room)
    sessionStorage.setItem('user', username)
    
    window.open(`/room/${room}`, "_self")

}

form.addEventListener('submit', handelSubmit)
