const headerInfor = $('.playlist_header-infor');
const allTracksPlaylist = $('.all_tracks');

const END_POINT = "http://localhost:3000/api/";

const TrackPlaylist = {
    allTracksPlaylist: [],
    allTracks: [],
    handleRenderTracksForU: async function (prop) {
        let _this = this;
        let playlistID = prop.categoriesIDMusicForU;
        let playlisMusicForU = prop.playlisMusicForU;
        let categoriesParameters = prop.categoriesParameters;
        let titlePlaylist = prop.titlePlaylist;
        // get alltracksplaylist
        await fetch(END_POINT + '/top100', categoriesParameters)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.playlists.items;
            })
            .catch(error => console.error(error))
        const tracksPlaylist = _this.allTracksPlaylist.filter(item => item.name === titlePlaylist)
        //   inforHeader playlist
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${tracksPlaylist[0].images[0].url}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${tracksPlaylist[0].type}</p>
                    <h1 class="playlist__title-header">${tracksPlaylist[0].name}</h1>
                    <p class="playlist_descr"> ${tracksPlaylist[0].description}</p>
                </div>
            </div>
            `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        await fetch('https://api.spotify.com/v1/playlists/' + tracksPlaylist[0].id + '/tracks', categoriesParameters)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                return _this.allTracks = data.items
            })
            .catch(error => console.error(error))

        const htmlsAllTracks = _this.allTracks.map((item, index) => {
            return `
            <div class="content__sing-wrap content-wrap">
                <div class="descr_sing-single">
                    <div class="list__title_sing">
                        <div class="order_number">${index + 1}</div>
                        <div class="img_title_sing">
                            <img src="${item.track.album.images[0].url}"
                                alt="">
                        </div>
                        <div class="list__sing-singgle">
                            <p class="name_sing">${item.track.name}</p>
                            <p class="name_single">${item.track.artists[0].name}</p>
                        </div>
                    </div>
                </div>
                <div class="list_album">
                    <div class="name_album">${item.track.album.name}</div>
                </div>
                <div class="list_add-time">
                    <div class="time-added">1 tuần trước</div>
                </div>
                <div class="list_clock">
                    <div class="icon_like-mobile">
                        <i class="fa-regular fa-heart icon_like-mobile"></i>
                    </div>
                    <div class="time-clock">2 phút</div>
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        })
        allTracksPlaylist.innerHTML = htmlsAllTracks.join('');
    },
    handleRenderTracksMood: async function (prop) {
        let _this = this;
        let playlistID = prop.categoriesIDMood;
        let playlistMusicMood = prop.playlistMusicMood;
        let categoriesParameters = prop.categoriesParameters;
        let titlePlaylist = prop.titlePlaylist;

        await fetch('https://api.spotify.com/v1/browse/categories/' + playlistID + '/playlists', categoriesParameters)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.playlists.items;
            })
            .catch(error => console.error("error", error))

        const tracksPlaylist = _this.allTracksPlaylist.filter(item => item.name === titlePlaylist)
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${tracksPlaylist[0].images[0].url}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${tracksPlaylist[0].type}</p>
                    <h1 class="playlist__title-header">${tracksPlaylist[0].name}</h1>
                    <p class="playlist_descr"> ${tracksPlaylist[0].description}</p>
                </div
                `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        await fetch('https://api.spotify.com/v1/playlists/' + tracksPlaylist[0].id + '/tracks', categoriesParameters)
            .then(response => response.json())
            .then(data => {
                return _this.allTracks = data.items
            })
            .catch(error => console.error("error", error))

        const htmlsAllTracks = _this.allTracks.map((item, index) => {
            return `
            <div class="content__sing-wrap content-wrap">
                <div class="descr_sing-single">
                    <div class="list__title_sing">
                        <div class="order_number">${index + 1}</div>
                        <div class="img_title_sing">
                            <img src="${item.track.album.images[0].url}"
                                alt="">
                        </div>
                        <div class="list__sing-singgle">
                            <p class="name_sing">${item.track.name}</p>
                            <p class="name_single">${item.track.artists[0].name}</p>
                        </div>
                    </div>
                </div>
                <div class="list_album">
                    <div class="name_album">${item.track.album.name}</div>
                </div>
                <div class="list_add-time">
                    <div class="time-added">1 tuần trước</div>
                </div>
               <div class="list_clock">
                    <div class="icon_like-mobile">
                        <i class="fa-regular fa-heart icon_like-mobile"></i>
                    </div>
                    <div class="time-clock">2 phút</div>
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        })
        allTracksPlaylist.innerHTML = htmlsAllTracks.join('');

    },
    handleRenderTracksHealth: async function (prop) {
        let _this = this;
        let playlistID = prop.categoriesIDHealth;
        let playlistMusicMood = prop.playlistMusicHealth;
        let categoriesParameters = prop.categoriesParameters;
        let titlePlaylist = prop.titlePlaylist;

        await fetch('https://api.spotify.com/v1/browse/categories/' + playlistID + '/playlists', categoriesParameters)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.playlists.items;
            })
            .catch(error => console.error("error", error))

        const tracksPlaylist = _this.allTracksPlaylist.filter(item => item.name === titlePlaylist)
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${tracksPlaylist[0].images[0].url}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${tracksPlaylist[0].type}</p>
                    <h1 class="playlist__title-header">${tracksPlaylist[0].name}</h1>
                    <p class="playlist_descr"> ${tracksPlaylist[0].description}</p>
                </div
                `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        await fetch('https://api.spotify.com/v1/playlists/' + tracksPlaylist[0].id + '/tracks', categoriesParameters)
            .then(response => response.json())
            .then(data => {
                return _this.allTracks = data.items
            })
            .catch(error => console.error("error", error))

        const htmlsAllTracks = _this.allTracks.map((item, index) => {
            return `
            <div class="content__sing-wrap content-wrap">
                <div class="descr_sing-single">
                    <div class="list__title_sing">
                        <div class="order_number">${index + 1}</div>
                        <div class="img_title_sing">
                            <img src="${item.track.album.images[0].url}"
                                alt="">
                        </div>
                        <div class="list__sing-singgle">
                            <p class="name_sing">${item.track.name}</p>
                            <p class="name_single">${item.track.artists[0].name}</p>
                        </div>
                    </div>
                </div>
                <div class="list_album">
                    <div class="name_album">${item.track.album.name}</div>
                </div>
                <div class="list_add-time">
                    <div class="time-added">1 tuần trước</div>
                </div>
                <div class="list_clock">
                    <div class="icon_like-mobile">
                        <i class="fa-regular fa-heart icon_like-mobile"></i>
                    </div>
                    <div class="time-clock">2 phút</div>
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        })
        allTracksPlaylist.innerHTML = htmlsAllTracks.join('');

    },
    handleRenderTracksAccoustic: async function (prop) {
        let _this = this;
        let playlistID = prop.categoriesIDAcoustic;
        let playlistMusicAcoustic = prop.playlistMusicAcoustic;
        let categoriesParameters = prop.categoriesParameters;
        let titlePlaylist = prop.titlePlaylist;

        await fetch('https://api.spotify.com/v1/browse/categories/' + playlistID + '/playlists', categoriesParameters)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.playlists.items;
            })
            .catch(error => console.error("error", error))

        const tracksPlaylist = _this.allTracksPlaylist.filter(item => item.name === titlePlaylist)
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${tracksPlaylist[0].images[0].url}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${tracksPlaylist[0].type}</p>
                    <h1 class="playlist__title-header">${tracksPlaylist[0].name}</h1>
                    <p class="playlist_descr"> ${tracksPlaylist[0].description}</p>
                </div
                `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        await fetch('https://api.spotify.com/v1/playlists/' + tracksPlaylist[0].id + '/tracks', categoriesParameters)
            .then(response => response.json())
            .then(data => {
                return _this.allTracks = data.items
            })
            .catch(error => console.error("error", error))

        const htmlsAllTracks = _this.allTracks.map((item, index) => {
            return `
            <div class="content__sing-wrap content-wrap">
                <div class="descr_sing-single">
                    <div class="list__title_sing">
                        <div class="order_number">${index + 1}</div>
                        <div class="img_title_sing">
                            <img src="${item.track.album.images[0].url}"
                                alt="">
                        </div>
                        <div class="list__sing-singgle">
                            <p class="name_sing">${item.track.name}</p>
                            <p class="name_single">${item.track.artists[0].name}</p>
                        </div>
                    </div>
                </div>
                <div class="list_album">
                    <div class="name_album">${item.track.album.name}</div>
                </div>
                <div class="list_add-time">
                    <div class="time-added">1 tuần trước</div>
                </div>
               <div class="list_clock">
                    <div class="icon_like-mobile">
                        <i class="fa-regular fa-heart icon_like-mobile"></i>
                    </div>
                    <div class="time-clock">2 phút</div>
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        })
        allTracksPlaylist.innerHTML = htmlsAllTracks.join('');

    }
};

export default TrackPlaylist;