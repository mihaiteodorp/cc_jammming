
let accessToken;
const clientID="df3f7a26ab27492f94bd8f055f2ced7a";
const redirectURL="http://localhost:3000/";


const Spotify={
    getAccessToken(){
        if (accessToken) return accessToken;
        const tokenInURL = window.location.href.match(/access_token=([^&]*)/);

        const expiryTime = window.location.href.match(/expires_in=([^&]*)/);

        if(tokenInURL && expiryTime){
            accessToken=tokenInURL[1];
            const expiresIn = Number(expiryTime[1]);

        window.setTimeout(()=>(accessToken=""),expiresIn*1000);

        window.history.pushState("Access token", null, "/")

        return accessToken;
        }

        const redirect=`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`;
        window.location = redirect;
    },

    async search(term){
        accessToken=Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            method: 'GET',
            headers: {Authorization:`Bearer ${accessToken}`}

        }).then(response=>response.json())
        .then(jsonResponse=>{
            if(!jsonResponse){
                console.error("Response error")
            }
            return jsonResponse.tracks.items.map( t =>({
                id: t.id,
                name: t.name,
                artist: t.artists[0].name,
                album: t.album.name,
                uri: t.uri
            }))
        })
    },

    async savePlaylist(name , trackUris){
        if (!name || !trackUris) return;
        const aToken = Spotify.getAccessToken();
        const header= {Authorization: `Bearer ${aToken}`};
        let userId;
        const response = await fetch(`https://api.spotify.com/v1/me`, { headers: header });
        const jsonResponse = await response.json();
        userId = jsonResponse.id;
        let playlistId;
        const response_1 = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: header,
            method: "post",
            body: JSON.stringify({ name: name }),
        });
        const jsonResponse_1 = await response_1.json();
        playlistId = jsonResponse_1.id;
        return await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: header,
            method: "post",
            body: JSON.stringify({ uris: trackUris }),
        });
}

    


}



export {Spotify};