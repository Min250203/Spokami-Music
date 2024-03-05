const headerInfor = $('.playlist_header-infor');
const tracksHeaderInfor = $('.tracks_header-infor');
const allTracksPlaylist = $('.all_tracks');
const audio = $('#audio');
const progress = $('#progress');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const playBtn = $(".btn-toggle-play");
const srcAudio = $(".src-audio");
const listNewlyTracks = $('.list_musicNewly');
const mainContent = $('.desc__contentmain');
const mainInforTracks = $('.all__tracks-main');
const allTracks = $('.active-show');
const btnRandom = $('.btn-random');
const allMainContent = $('.container__maincontent');
const allMainInforSingle = $('.container__infor_tracks-playing');
const btnRepeat = $('.btn-repeat');
const elLyric = document.querySelector(".render_lyric");
const iconHeadLeft = $('.left');

const END_POINT = window.env.API_URL;
const TrackPlaylist = {
    allTracksPlaylist: [],
    allTracks: [],
    indexTracksPlaylist: 0,
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    fullLyric: {},
    showLyric: [],
    indexLyric: 0,
    currentLyric: null,
    track: '',
    dataAllTracks: [],
    oldIndex: 0,
    isRandom: false,
    isRepeat: false,
    message: '',
    sentences: [],
    status: 0,
    inforArtist: {},
    dataNewlyLunched: {},
    handleRenderTracksForU: async function (props) {
        let _this = this;
        let PlaylistForU = props.playlistMusicForU[0].items.filter((item) => item.banner === props.titlePlaylist)
        // get alltracksplaylist
        await fetch(END_POINT + `/api/detailplaylist?id=${PlaylistForU[0].encodeId}`)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.data;
                _this.message = data.msg;
            })
            .catch(error => console.error(error))

        //   inforHeader playlist
        if (_this.message === "Success") {
            mainInforTracks.style.display = "block";
            $('.content').style.display = "block";
            allTracks.style.display = "block";
            const htmlsInforPlaylistHeader = `
                <div class="playlist__header">
                    <div class="playlist_img">
                        <img src="${PlaylistForU[0].banner}"
                            alt="">
                    </div>
                    <div class="categories_descr">
                        <p class="name_playlist">${_this.allTracksPlaylist.textType}</p>
                        <h1 class="playlist__title-header">${_this.allTracksPlaylist.title}</h1>
                        <p class="playlist_descr"> ${_this.allTracksPlaylist.description}</p>
                    </div>
                </div>
                `
            headerInfor.innerHTML = htmlsInforPlaylistHeader;

            // render tracks
            const htmlsAllTracks = _this.allTracksPlaylist.song.items.map((item, index) => {
                // // total time music
                let time = Math.floor(item.duration)
                let totalHours = parseInt(time / 3600);
                let totalMinutes = parseInt((time - (totalHours * 3600)) / 60);
                let totalSeconds = Math.floor((time - ((totalHours * 3600) + (totalMinutes * 60))));
                let totalNumberOftotalSeconds = (totalMinutes < 10 ? "0" + totalMinutes : totalMinutes) + ":" + (totalSeconds < 10 ? "0" + totalSeconds : totalSeconds);
                return `
                <div class="content__sing-wrap content-wrap" data-Index=${index}>
                    <div class="descr_sing-single">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                            <div class="play_track-play-main">
                            <i class="fa-solid fa-play icon_play-tracks"></i>
                            <i class="fas fa-pause icon_pause-tracks"></i>
                            </div>
                            <div class="img_title_sing">
                                <img src="${item.thumbnailM}"
                                    alt="">
                            </div>
                            <div class="list__sing-singgle">
                                <p class="name_sing">${item.title}</p>
                                <p class="name_single">${item.artistsNames}</p>
                            </div>
                        </div>
                    </div>
                    <div class="list_album">
                        <div class="name_album">${item?.album ? item.album.title : "Album chưa được cập nhật..."}</div>
                    </div>
                    <div class="list_clock">
                        <div class="icon_like-mobile">
                            <i class="fa-regular fa-heart icon_like-mobile"></i>
                        </div>
                        <div class="time-clock">${totalNumberOftotalSeconds}</div>
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
                `
            })
            allTracksPlaylist.innerHTML = htmlsAllTracks.join('');
            $('.icon__home-main').onclick = function () {
                mainContent.style.display = "block";
                mainInforTracks.style.display = "none";
                $('.content').style.display = "block";
            }
        } else {
            $('.img_not-function').style.display = "flex";
            $('.img_not-function').innerHTML = ` <img src="./assets/workTime.svg" class="img_working" alt=""> `;
            $('.none_of_none-img').style.display = "block";
            $('.icon__home-main').onclick = function () {
                $('.img_not-function').style.display = "none";
                mainContent.style.display = "block";
                mainInforTracks.style.display = "none";
                $('.content').style.display = "block";
                $('.container__maincontent').style.display = "block";
            }
        }

        // play tracks when click
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            element.onclick = async function (e) {
                // click different song
                const songIndex = e.target.closest('.content__sing-wrap:not(.active_playing-track)');
                if (songIndex || e.target.closest('.name_sing')) {
                    // GET infor artist
                    _this.currentIndex = Number(element.getAttribute('data-Index'));
                    _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                    await fetch(END_POINT + `/api/artist?name=${_this.dataTrackPlaying.artists[0].alias}`)
                        .then(respone => respone.json())
                        .then(data => {
                            _this.inforArtist = data.data;
                        })

                    // render lyric
                    await fetch(END_POINT + `/api/lyric?id=${_this.dataTrackPlaying.encodeId}`)
                        .then(response => response.json())
                        .then(data => {
                            _this.sentences = data.data.sentences;
                            _this.fullLyric = {};
                        })
                        .catch(error => console.error(error))

                    if (songIndex && !e.target.closest('.name_sing')) {
                        let orderNumber = element.querySelector('.order_number');
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.isPlaying = true;
                        element.classList.add('active_playing-track');
                        if (_this.currentIndex !== _this.oldIndex) {
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.name_sing').style.color = "#fff";
                            _this.oldIndex = Number(element.getAttribute('data-Index'));
                        }
                        _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        let dataTrack = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        let dataAllTrack = _this.allTracksPlaylist.song.items;
                        // show descr song
                        $('.name__music').style.display = "block";
                        $('.img__played').style.display = "block";

                        // show descr single when playing
                        // css for main content
                        allMainInforSingle.style.display = "block";
                        allMainContent.style.width = "75%";
                        allMainContent.style.margin = "0";
                        $('.icon__close-tab_infor').style.display = "block";
                        $('.infor__playlist').style.display = "flex";
                        $('.img__album_tracks-playing').innerHTML = `<img class="img__album-playing"src=${_this.dataTrackPlaying.thumbnailM} alt="">`
                        $('.img__infor_artist-playing').innerHTML = `<img class="img__album-playing"src=${_this.inforArtist.thumbnailM} alt="">`
                        $('.name__album_tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.album.title}</p>`;
                        $('.name__sing_tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.title}</p>`;
                        $('.name__artist-tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.artistsNames}</p>`;
                        $('.name__artist-playing').innerHTML = `<p>${_this.dataTrackPlaying.artistsNames}</p>`;
                        $('.name__album_artist-playing').innerHTML = `<p>${_this.dataTrackPlaying.album.title}</p>`;

                        // show icon
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "none";
                        iconPause.style.display = "block";

                        // change color name sing
                        let nameTracks = element.querySelector('.name_sing');
                        nameTracks.style.color = "#1ed760";


                        // change icon play
                        $('.play_track-play-main').classList.add('playing');
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack, dataAllTrack });

                        // render lyric
                        _this.sentences.map((sentence) => {
                            const words = sentence.words;
                            let key;
                            let lyric = "";

                            words.map((word, index) => {
                                if (index === 0) {
                                    key = Math.floor(word.startTime / 1000);
                                }
                                lyric += `${word.data} `
                            })

                            _this.fullLyric[key] = lyric;
                            _this.showLyric.push(key)
                        })
                        // render lyric control
                        const htmRenderlLyric = Object.entries(_this.fullLyric).map(([key, item]) => (
                            `<p class="lyric_control_${key} content__lyric_control" data-time = ${key}>${item}</p>`
                        ))
                        // const htmRenderlLyric = _this.showLyric.slice(_this.indexLyric, _this.indexLyric + 2).map(key => (
                        //     `<p class="lyric_control_${key} content__lyric_control" data-time = ${key}>${_this.fullLyric[key]}</p>`
                        // ))
                        // _this.indexLyric = 
                        $('.render__lyric_control').innerHTML = htmRenderlLyric.join('');

                    }

                    if (e.target.closest('.name_sing')) {
                        $('.content__lyric').style.display = "flex";
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        _this.status = 1;
                        // icon left
                        iconHeadLeft.onclick = function () {
                            if (_this.status === 1) {
                                iconHeadLeft.style.color = "#fff";
                                $('.infor__lyric').style.display = "none";
                                headerInfor.style.display = "block";
                                tracksHeaderInfor.style.display = "none";
                                $('.playlist__sings-wrap').style.display = "grid";
                                $('.action-right').style.display = "flex";
                                // close tab infor single
                                $('.container__infor_tracks-playing').style.display = "none";
                                allMainContent.style.width = "85%";
                                allMainContent.style.margin = "auto";
                                $('.content__lyric').style.display = "none";
                                _this.status = 0;
                            } else {
                                $('.content__lyric').style.display = "none";
                                iconHeadLeft.style.color = "#fff";
                                mainContent.style.display = "block";
                                $('.all__tracks-main ').style.display = "none";
                                // close tab infor single
                                $('.container__infor_tracks-playing').style.display = "none";
                                allMainContent.style.width = "85%";
                                allMainContent.style.margin = "auto";

                            }
                        }
                        $('.infor__lyric').style.display = "block"
                        $('.playlist__sings-wrap').style.display = "none";
                        $('.action-right').style.display = "none";
                        $('.infor__artist_lyric-wrap').style.display = "block";
                        headerInfor.style.display = "none";
                        tracksHeaderInfor.style.display = "block";
                        let yearAlbum = _this.dataTrackPlaying.album.releaseDate.split("/");
                        const htmlsInforPlaylistHeader = `
                                <div class="playlist__header">
                                    <div class="playlist_img">
                                        <img src="${_this.dataTrackPlaying.thumbnailM}"
                                            alt="">
                                    </div>
                                    <div class="categories_descr">
                                        <p class="name_playlist">Bài hát</p>
                                        <h1 class="playlist__title-header">${_this.dataTrackPlaying.title}</h1>
                                        <p class="playlist_descr"> ${_this.dataTrackPlaying.artistsNames + " • " + _this.dataTrackPlaying.album.title + " • " + yearAlbum[2]}</p>
                                    </div>
                                </div>
                                `
                        tracksHeaderInfor.innerHTML = htmlsInforPlaylistHeader;

                        // render lyric
                        _this.sentences.map((sentence) => {
                            const words = sentence.words;
                            let key;
                            let lyric = "";

                            words.map((word, index) => {
                                if (index === 0) {
                                    key = Math.floor(word.startTime / 1000);
                                }
                                lyric += `${word.data} `
                            })

                            _this.fullLyric[key] = lyric;
                        })
                        const htmlLyric = Object.entries(_this.fullLyric).map(([key, item]) => (
                            `<p class="lyric_${key}">${item}</p>`
                        ))

                        elLyric.innerHTML = htmlLyric.join("");

                        // render infor artist
                        $('.img__artist_lyric').innerHTML = `<img class="img__artist_" src=${_this.inforArtist.thumbnailM} alt="">`;
                        $('.name__artist_lyric').innerHTML = `<p class="name__artist_">${_this.inforArtist.name}</p>`

                    }
                }
                else {
                    // click to pause
                    let dataTrack = _this.allTracksPlaylist.song.items[_this.currentIndex];
                    let dataAllTrack = _this.allTracksPlaylist.song.items;
                    if (_this.isPlaying) {
                        _this.isPlaying = false;
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "block";
                        iconPause.style.display = "none";
                        playBtn.classList.remove('playing');
                        element.classList.remove('active_playing-track');
                        _this.isPlaying = false;
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack, dataAllTrack, status: "pause" });
                    }
                }

            }
        })

        // hover tracks when play
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            let valueSingPlaying = element.querySelector('.name_sing').textContent;

            element.onmouseover = function (e) {
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                    element.querySelector('.name_single').style.color = "#fff";
                    element.querySelector('.name_album').style.color = "#fff";
                } else {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "block";
                    iconPause.style.display = "none";
                    element.querySelector('.name_single').style.color = "#fff";
                    element.querySelector('.name_album').style.color = "#fff";
                }
            }

            element.onmouseout = function (e) {
                let valueSingPlaying = element.querySelector('.name_sing').textContent;
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                    element.querySelector('.name_single').style.color = "#848484";
                    element.querySelector('.name_album').style.color = "#848484";
                    toolplay.style.display = "none";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "none";
                    element.querySelector('.name_single').style.color = "#848484";
                    element.querySelector('.name_album').style.color = "#848484";
                }
            }
        })

        // click close tab infor tracks
        $('.icon__close-tab_infor').onclick = function () {
            $('.container__infor_tracks-playing').style.display = "none";
            allMainContent.style.width = "85%";
            allMainContent.style.margin = "auto";
        }




    },
    handleRenderTracksTab1: async function (props) {
        let _this = this;
        let PlaylistTab1 = props.playlistMusicTab1.items.filter((item) => item.title === props.titlePlaylist)
        // get alltracksplaylist
        await fetch(END_POINT + `/api/detailplaylist?id=${PlaylistTab1[0].encodeId}`)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.data;
            })
            .catch(error => console.error(error))

        //   inforHeader playlist
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${PlaylistTab1[0].thumbnailM}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${_this.allTracksPlaylist.textType}</p>
                    <h1 class="playlist__title-header">${_this.allTracksPlaylist.title}</h1>
                    <p class="playlist_descr"> ${_this.allTracksPlaylist.description}</p>
                </div>
                `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        //    render Tracks
        const htmlsAllTracks = _this.allTracksPlaylist.song.items.map((item, index) => {
            return `
                <div class="content__sing-wrap content-wrap" data-Index=${index}>
                    <div class="descr_sing-single">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                            <div class="play_track-play-main">
                            <i class="fa-solid fa-play icon_play-tracks"></i>
                            <i class="fas fa-pause icon_pause-tracks"></i>
                            </div>
                        <div class="img_title_sing">
                                <img src="${item.thumbnailM}"
                                    alt="">
                            </div>
                            <div class="list__sing-singgle">
                                <p class="name_sing">${item.title}</p>
                                <p class="name_single">${item.artistsNames}</p>
                            </div>
                        </div>
                    </div>
                    <div class="list_album">
                    <div class="name_album">${item?.album ? item.album.title : "Album chưa được cập nhật..."}</div>
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

        // play tracks when click
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            element.onclick = async function (e) {
                // click different song
                const songIndex = e.target.closest('.content__sing-wrap:not(.active_playing-track)');
                if (songIndex || e.target.closest('.name_sing')) {
                    // GET infor artist
                    _this.currentIndex = Number(element.getAttribute('data-Index'));
                    _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                    await fetch(END_POINT + `/api/artist?name=${_this.dataTrackPlaying.artists[0].alias}`)
                        .then(respone => respone.json())
                        .then(data => {
                            _this.inforArtist = data.data;
                        })

                    // render lyric
                    await fetch(END_POINT + `/api/lyric?id=${_this.dataTrackPlaying.encodeId}`)
                        .then(response => response.json())
                        .then(data => {
                            _this.sentences = data.data.sentences;
                            _this.fullLyric = {};
                        })
                        .catch(error => console.error(error))
                    if (songIndex && !e.target.closest('.name_sing')) {
                        let orderNumber = element.querySelector('.order_number');
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.isPlaying = true;
                        element.classList.add('active_playing-track');
                        if (_this.currentIndex !== _this.oldIndex) {
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.name_sing').style.color = "#fff";
                            _this.oldIndex = Number(element.getAttribute('data-Index'));
                        }
                        _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        let dataTrack = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        let dataAllTrack = _this.allTracksPlaylist.song.items;
                        // show descr song
                        $('.name__music').style.display = "block";
                        $('.img__played').style.display = "block";

                        // show descr single when playing
                        // css for main content
                        allMainInforSingle.style.display = "block";
                        allMainContent.style.width = "75%";
                        allMainContent.style.margin = "0";
                        $('.icon__close-tab_infor').style.display = "block";
                        $('.infor__playlist').style.display = "flex";
                        $('.img__album_tracks-playing').innerHTML = `<img class="img__album-playing"src=${_this.dataTrackPlaying.thumbnailM} alt="">`
                        $('.img__infor_artist-playing').innerHTML = `<img class="img__album-playing"src=${_this.inforArtist.thumbnailM} alt="">`
                        $('.name__album_tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.album.title}</p>`;
                        $('.name__sing_tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.title}</p>`;
                        $('.name__artist-tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.artistsNames}</p>`;
                        $('.name__artist-playing').innerHTML = `<p>${_this.dataTrackPlaying.artistsNames}</p>`;
                        $('.name__album_artist-playing').innerHTML = `<p>${_this.dataTrackPlaying.album.title}</p>`;

                        // show icon
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "none";
                        iconPause.style.display = "block";

                        // change color name sing
                        let nameTracks = element.querySelector('.name_sing');
                        nameTracks.style.color = "#1ed760";

                        // change icon play
                        $('.play_track-play-main').classList.add('playing');
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack, dataAllTrack });

                        // render lyric
                        _this.sentences.map((sentence) => {
                            const words = sentence.words;
                            let key;
                            let lyric = "";

                            words.map((word, index) => {
                                if (index === 0) {
                                    key = Math.floor(word.startTime / 1000);
                                }
                                lyric += `${word.data} `
                            })

                            _this.fullLyric[key] = lyric;
                        })
                        // render lyric control
                        const htmRenderlLyric = Object.entries(_this.fullLyric).map(([key, item]) => (
                            `<p class="lyric_control_${key} content__lyric_control" data-time = ${key}>${item}</p>`
                        ))
                        $('.render__lyric_control').innerHTML = htmRenderlLyric.join('');

                    }

                    if (e.target.closest('.name_sing')) {
                        $('.content__lyric').style.display = "flex";
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        _this.status = 1;
                        // icon left
                        iconHeadLeft.onclick = function () {
                            if (_this.status === 1) {
                                iconHeadLeft.style.color = "#fff";
                                $('.infor__lyric').style.display = "none";
                                headerInfor.style.display = "block";
                                tracksHeaderInfor.style.display = "none";
                                $('.playlist__sings-wrap').style.display = "grid";
                                $('.action-right').style.display = "flex";
                                // close tab infor single
                                $('.container__infor_tracks-playing').style.display = "none";
                                allMainContent.style.width = "85%";
                                allMainContent.style.margin = "auto";
                                $('.content__lyric').style.display = "none";
                                _this.status = 0;
                            } else {
                                $('.content__lyric').style.display = "none";
                                iconHeadLeft.style.color = "#fff";
                                mainContent.style.display = "block";
                                $('.all__tracks-main ').style.display = "none";
                                // close tab infor single
                                $('.container__infor_tracks-playing').style.display = "none";
                                allMainContent.style.width = "85%";
                                allMainContent.style.margin = "auto";

                            }
                        }
                        $('.infor__lyric').style.display = "block"
                        $('.playlist__sings-wrap').style.display = "none";
                        $('.action-right').style.display = "none";
                        $('.infor__artist_lyric-wrap').style.display = "block";
                        headerInfor.style.display = "none";
                        tracksHeaderInfor.style.display = "block";
                        let yearAlbum = _this.dataTrackPlaying.album.releaseDate.split("/");
                        const htmlsInforPlaylistHeader = `
                                <div class="playlist__header">
                                    <div class="playlist_img">
                                        <img src="${_this.dataTrackPlaying.thumbnailM}"
                                            alt="">
                                    </div>
                                    <div class="categories_descr">
                                        <p class="name_playlist">Bài hát</p>
                                        <h1 class="playlist__title-header">${_this.dataTrackPlaying.title}</h1>
                                        <p class="playlist_descr"> ${_this.dataTrackPlaying.artistsNames + " • " + _this.dataTrackPlaying.album.title + " • " + yearAlbum[2]}</p>
                                    </div>
                                </div>
                                `
                        tracksHeaderInfor.innerHTML = htmlsInforPlaylistHeader;

                        // render lyric
                        _this.sentences.map((sentence) => {
                            const words = sentence.words;
                            let key;
                            let lyric = "";

                            words.map((word, index) => {
                                if (index === 0) {
                                    key = Math.floor(word.startTime / 1000);
                                }
                                lyric += `${word.data} `
                            })

                            _this.fullLyric[key] = lyric;
                        })
                        const htmlLyric = Object.entries(_this.fullLyric).map(([key, item]) => (
                            `<p class="lyric_${key}">${item}</p>`
                        ))

                        elLyric.innerHTML = htmlLyric.join("");

                        // render infor artist
                        $('.img__artist_lyric').innerHTML = `<img class="img__artist_" src=${_this.inforArtist.thumbnailM} alt="">`;
                        $('.name__artist_lyric').innerHTML = `<p class="name__artist_">${_this.inforArtist.name}</p>`

                    }

                }
                else {
                    // click to pause
                    let dataTrack = _this.allTracksPlaylist.song.items[_this.currentIndex];
                    let dataAllTrack = _this.allTracksPlaylist.song.items;
                    if (_this.isPlaying) {
                        _this.isPlaying = false;
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "block";
                        iconPause.style.display = "none";
                        element.classList.remove('active_playing-track');
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack, dataAllTrack, status: "pause" });
                    }
                }

            }

        })

        // hover tracks when play
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            let valueSingPlaying = element.querySelector('.name_sing').textContent;

            element.onmouseover = function (e) {
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                    element.querySelector('.name_single').style.color = "#fff";
                    element.querySelector('.name_album').style.color = "#fff";
                } else {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "block";
                    iconPause.style.display = "none";
                    element.querySelector('.name_single').style.color = "#fff";
                    element.querySelector('.name_album').style.color = "#fff";
                }
            }

            element.onmouseout = function (e) {
                let valueSingPlaying = element.querySelector('.name_sing').textContent;
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                    element.querySelector('.name_single').style.color = "#848484";
                    element.querySelector('.name_album').style.color = "#848484";
                } else {
                    orderNumber.style.display = "block";
                    toolplay.style.display = "none";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "none";
                    element.querySelector('.name_single').style.color = "#848484";
                    element.querySelector('.name_album').style.color = "#848484";

                }
            }
        })

    },
    handleRenderTracksTab2: async function (props) {
        let _this = this;
        let PlaylistTab2 = props.playlistMusicTab2.items.filter((item) => item.title === props.titlePlaylist)
        // get alltracksplaylist
        await fetch(END_POINT + `/api/detailplaylist?id=${PlaylistTab2[0].encodeId}`)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.data;
            })
            .catch(error => console.error(error))

        //   inforHeader playlist
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${PlaylistTab2[0].thumbnailM}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${_this.allTracksPlaylist.textType}</p>
                    <h1 class="playlist__title-header">${_this.allTracksPlaylist.title}</h1>
                    <p class="playlist_descr"> ${_this.allTracksPlaylist.description}</p>
                </div>
                `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        //    render Tracks
        const htmlsAllTracks = _this.allTracksPlaylist.song.items.map((item, index) => {
            return `
                <div class="content__sing-wrap content-wrap" data-Index=${index}>
                    <div class="descr_sing-single">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                            <div class="play_track-play-main">
                            <i class="fa-solid fa-play icon_play-tracks"></i>
                            <i class="fas fa-pause icon_pause-tracks"></i>
                            </div>
                        <div class="img_title_sing">
                                <img src="${item.thumbnailM}"
                                    alt="">
                            </div>
                            <div class="list__sing-singgle">
                                <p class="name_sing">${item.title}</p>
                                <p class="name_single">${item.artistsNames}</p>
                            </div>
                        </div>
                    </div>
                    <div class="list_album">
                        <div class="name_album">${item?.album ? item.album.title : "Album chưa được cập nhật..."}</div>
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

        // play tracks when click
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            element.onclick = async function (e) {
                // click different song
                const songIndex = e.target.closest('.content__sing-wrap:not(.active_playing-track)');
                if (songIndex || e.target.closest('.name_sing')) {
                    // GET infor artist
                    _this.currentIndex = Number(element.getAttribute('data-Index'));
                    _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                    await fetch(END_POINT + `/api/artist?name=${_this.dataTrackPlaying.artists[0].alias}`)
                        .then(respone => respone.json())
                        .then(data => {
                            _this.inforArtist = data.data;
                        })

                    // render lyric
                    await fetch(END_POINT + `/api/lyric?id=${_this.dataTrackPlaying.encodeId}`)
                        .then(response => response.json())
                        .then(data => {
                            _this.sentences = data.data.sentences;
                            _this.fullLyric = {};
                        })
                        .catch(error => console.error(error))

                    if (songIndex && !e.target.closest('.name_sing')) {
                        let orderNumber = element.querySelector('.order_number');
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.isPlaying = true;
                        element.classList.add('active_playing-track');
                        if (_this.currentIndex !== _this.oldIndex) {
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.name_sing').style.color = "#fff";
                            _this.oldIndex = Number(element.getAttribute('data-Index'));
                        }
                        _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        let dataTrack = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        let dataAllTrack = _this.allTracksPlaylist.song.items;
                        // show descr song
                        $('.name__music').style.display = "block";
                        $('.img__played').style.display = "block";

                        // show descr single when playing
                        // css for main content
                        allMainInforSingle.style.display = "block";
                        allMainContent.style.width = "75%";
                        allMainContent.style.margin = "0";
                        $('.icon__close-tab_infor').style.display = "block";
                        $('.infor__playlist').style.display = "flex";
                        $('.img__album_tracks-playing').innerHTML = `<img class="img__album-playing"src=${_this.dataTrackPlaying.thumbnailM} alt="">`
                        $('.img__infor_artist-playing').innerHTML = `<img class="img__album-playing"src=${_this.inforArtist.thumbnailM} alt="">`
                        $('.name__album_tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.album.title}</p>`;
                        $('.name__sing_tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.title}</p>`;
                        $('.name__artist-tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.artistsNames}</p>`;
                        $('.name__artist-playing').innerHTML = `<p>${_this.dataTrackPlaying.artistsNames}</p>`;
                        $('.name__album_artist-playing').innerHTML = `<p>${_this.dataTrackPlaying.album.title}</p>`;

                        // show icon
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "none";
                        iconPause.style.display = "block";

                        // change color name sing
                        let nameTracks = element.querySelector('.name_sing');
                        nameTracks.style.color = "#1ed760";


                        // change icon play
                        $('.play_track-play-main').classList.add('playing');
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack, dataAllTrack });

                        // render lyric
                        _this.sentences.map((sentence) => {
                            const words = sentence.words;
                            let key;
                            let lyric = "";

                            words.map((word, index) => {
                                if (index === 0) {
                                    key = Math.floor(word.startTime / 1000);
                                }
                                lyric += `${word.data} `
                            })

                            _this.fullLyric[key] = lyric;
                        })
                        // render lyric control
                        const htmRenderlLyric = Object.entries(_this.fullLyric).map(([key, item]) => (
                            `<p class="lyric_control_${key} content__lyric_control" data-time = ${key}>${item}</p>`
                        ))
                        $('.render__lyric_control').innerHTML = htmRenderlLyric.join('');

                    }
                    if (e.target.closest('.name_sing')) {
                        $('.content__lyric').style.display = "flex";
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        _this.status = 1;
                        // icon left
                        iconHeadLeft.onclick = function () {
                            if (_this.status === 1) {
                                iconHeadLeft.style.color = "#fff";
                                $('.infor__lyric').style.display = "none";
                                headerInfor.style.display = "block";
                                tracksHeaderInfor.style.display = "none";
                                $('.playlist__sings-wrap').style.display = "grid";
                                $('.action-right').style.display = "flex";
                                // close tab infor single
                                $('.container__infor_tracks-playing').style.display = "none";
                                allMainContent.style.width = "85%";
                                allMainContent.style.margin = "auto";
                                $('.content__lyric').style.display = "none";
                                _this.status = 0;
                            } else {
                                $('.content__lyric').style.display = "none";
                                iconHeadLeft.style.color = "#fff";
                                mainContent.style.display = "block";
                                $('.all__tracks-main ').style.display = "none";
                                // close tab infor single
                                $('.container__infor_tracks-playing').style.display = "none";
                                allMainContent.style.width = "85%";
                                allMainContent.style.margin = "auto";

                            }
                        }
                        $('.infor__lyric').style.display = "block"
                        $('.playlist__sings-wrap').style.display = "none";
                        $('.action-right').style.display = "none";
                        $('.infor__artist_lyric-wrap').style.display = "block";
                        headerInfor.style.display = "none";
                        tracksHeaderInfor.style.display = "block";
                        let yearAlbum = _this.dataTrackPlaying.album.releaseDate.split("/");
                        const htmlsInforPlaylistHeader = `
                                <div class="playlist__header">
                                    <div class="playlist_img">
                                        <img src="${_this.dataTrackPlaying.thumbnailM}"
                                            alt="">
                                    </div>
                                    <div class="categories_descr">
                                        <p class="name_playlist">Bài hát</p>
                                        <h1 class="playlist__title-header">${_this.dataTrackPlaying.title}</h1>
                                        <p class="playlist_descr"> ${_this.dataTrackPlaying.artistsNames + " • " + _this.dataTrackPlaying.album.title + " • " + yearAlbum[2]}</p>
                                    </div>
                                </div>
                                `
                        tracksHeaderInfor.innerHTML = htmlsInforPlaylistHeader;

                        // render lyric
                        _this.sentences.map((sentence) => {
                            const words = sentence.words;
                            let key;
                            let lyric = "";

                            words.map((word, index) => {
                                if (index === 0) {
                                    key = Math.floor(word.startTime / 1000);
                                }
                                lyric += `${word.data} `
                            })

                            _this.fullLyric[key] = lyric;
                        })
                        const htmlLyric = Object.entries(_this.fullLyric).map(([key, item]) => (
                            `<p class="lyric_${key}">${item}</p>`
                        ))

                        elLyric.innerHTML = htmlLyric.join("");

                        // render infor artist
                        $('.img__artist_lyric').innerHTML = `<img class="img__artist_" src=${_this.inforArtist.thumbnailM} alt="">`;
                        $('.name__artist_lyric').innerHTML = `<p class="name__artist_">${_this.inforArtist.name}</p>`

                    }

                } else {
                    // click to pause
                    let dataTrack = _this.allTracksPlaylist.song.items[_this.currentIndex];
                    let dataAllTrack = _this.allTracksPlaylist.song.items;
                    if (_this.isPlaying) {
                        _this.isPlaying = false;
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "block";
                        iconPause.style.display = "none";
                        element.classList.remove('active_playing-track');
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack, dataAllTrack, status: "pause" });
                    }
                }

            }

        })

        // hover tracks when play
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            let valueSingPlaying = element.querySelector('.name_sing').textContent;

            element.onmouseover = function (e) {
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                    element.querySelector('.name_single').style.color = "#fff";
                    element.querySelector('.name_album').style.color = "#fff";
                } else {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "block";
                    iconPause.style.display = "none";
                    element.querySelector('.name_single').style.color = "#fff";
                    element.querySelector('.name_album').style.color = "#fff";
                }
            }

            element.onmouseout = function (e) {
                let valueSingPlaying = element.querySelector('.name_sing').textContent;
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                    element.querySelector('.name_single').style.color = "#848484";
                    element.querySelector('.name_album').style.color = "#848484";
                } else {
                    orderNumber.style.display = "block";
                    toolplay.style.display = "none";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "none";
                    element.querySelector('.name_single').style.color = "#848484";
                    element.querySelector('.name_album').style.color = "#848484";

                }
            }
        })

    },
    handleRenderTracksTab3: async function (props) {
        let _this = this;
        let PlaylistTab3 = props.playlistMusicTab3.items.filter((item) => item.title === props.titlePlaylist)
        // get alltracksplaylist
        await fetch(END_POINT + `/api/detailplaylist?id=${PlaylistTab3[0].encodeId}`)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.data;
            })
            .catch(error => console.error(error))

        //   inforHeader playlist
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${PlaylistTab3[0].thumbnailM}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${_this.allTracksPlaylist.textType}</p>
                    <h1 class="playlist__title-header">${_this.allTracksPlaylist.title}</h1>
                    <p class="playlist_descr"> ${_this.allTracksPlaylist.description}</p>
                </div>
                `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        //    render Tracks
        const htmlsAllTracks = _this.allTracksPlaylist.song.items.map((item, index) => {
            return `
                <div class="content__sing-wrap content-wrap" data-Index=${index}>
                    <div class="descr_sing-single">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                            <div class="play_track-play-main">
                            <i class="fa-solid fa-play icon_play-tracks"></i>
                            <i class="fas fa-pause icon_pause-tracks"></i>
                            </div>
                        <div class="img_title_sing">
                                <img src="${item.thumbnailM}"
                                    alt="">
                            </div>
                            <div class="list__sing-singgle">
                                <p class="name_sing">${item.title}</p>
                                <p class="name_single">${item.artistsNames}</p>
                            </div>
                        </div>
                    </div>
                    <div class="list_album">
                        <div class="name_album">${item?.album ? item.album.title : "Album chưa được cập nhật..."}</div>
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

        // play tracks when click
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            element.onclick = async function (e) {
                // click different song
                const songIndex = e.target.closest('.content__sing-wrap:not(.active_playing-track)');
                if (songIndex || e.target.closest('.name_sing')) {
                    // GET infor artist
                    _this.currentIndex = Number(element.getAttribute('data-Index'));
                    _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                    await fetch(END_POINT + `/api/artist?name=${_this.dataTrackPlaying.artists[0].alias}`)
                        .then(respone => respone.json())
                        .then(data => {
                            _this.inforArtist = data.data;
                        })

                    // render lyric
                    await fetch(END_POINT + `/api/lyric?id=${_this.dataTrackPlaying.encodeId}`)
                        .then(response => response.json())
                        .then(data => {
                            _this.sentences = data.data.sentences;
                            _this.fullLyric = {};
                        })
                        .catch(error => console.error(error))

                    if (songIndex && !e.target.closest('.name_sing')) {
                        let orderNumber = element.querySelector('.order_number');
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.isPlaying = true;
                        element.classList.add('active_playing-track');
                        if (_this.currentIndex !== _this.oldIndex) {
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.name_sing').style.color = "#fff";
                            _this.oldIndex = Number(element.getAttribute('data-Index'));
                        }
                        _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        let dataTrack = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        let dataAllTrack = _this.allTracksPlaylist.song.items;
                        // show descr song
                        $('.name__music').style.display = "block";
                        $('.img__played').style.display = "block";

                        // show descr single when playing
                        // css for main content
                        allMainInforSingle.style.display = "block";
                        allMainContent.style.width = "75%";
                        allMainContent.style.margin = "0";
                        $('.icon__close-tab_infor').style.display = "block";
                        $('.infor__playlist').style.display = "flex";
                        $('.img__album_tracks-playing').innerHTML = `<img class="img__album-playing"src=${_this.dataTrackPlaying.thumbnailM} alt="">`
                        $('.img__infor_artist-playing').innerHTML = `<img class="img__album-playing"src=${_this.inforArtist.thumbnailM} alt="">`
                        $('.name__album_tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.album.title}</p>`;
                        $('.name__sing_tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.title}</p>`;
                        $('.name__artist-tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.artistsNames}</p>`;
                        $('.name__artist-playing').innerHTML = `<p>${_this.dataTrackPlaying.artistsNames}</p>`;
                        $('.name__album_artist-playing').innerHTML = `<p>${_this.dataTrackPlaying.album.title}</p>`;

                        // show icon
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "none";
                        iconPause.style.display = "block";

                        // change color name sing
                        let nameTracks = element.querySelector('.name_sing');
                        nameTracks.style.color = "#1ed760";


                        // change icon play
                        $('.play_track-play-main').classList.add('playing');
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack, dataAllTrack });

                        // render lyric
                        _this.sentences.map((sentence) => {
                            const words = sentence.words;
                            let key;
                            let lyric = "";

                            words.map((word, index) => {
                                if (index === 0) {
                                    key = Math.floor(word.startTime / 1000);
                                }
                                lyric += `${word.data} `
                            })

                            _this.fullLyric[key] = lyric;
                        })
                        // render lyric control
                        const htmRenderlLyric = Object.entries(_this.fullLyric).map(([key, item]) => (
                            `<p class="lyric_control_${key} content__lyric_control" data-time = ${key}>${item}</p>`
                        ))
                        $('.render__lyric_control').innerHTML = htmRenderlLyric.join('');

                    }
                    if (e.target.closest('.name_sing')) {
                        $('.content__lyric').style.display = "flex";
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        _this.status = 1;
                        // icon left
                        iconHeadLeft.onclick = function () {
                            if (_this.status === 1) {
                                iconHeadLeft.style.color = "#fff";
                                $('.infor__lyric').style.display = "none";
                                headerInfor.style.display = "block";
                                tracksHeaderInfor.style.display = "none";
                                $('.playlist__sings-wrap').style.display = "grid";
                                $('.action-right').style.display = "flex";
                                // close tab infor single
                                $('.container__infor_tracks-playing').style.display = "none";
                                allMainContent.style.width = "85%";
                                allMainContent.style.margin = "auto";
                                $('.content__lyric').style.display = "none";
                                _this.status = 0;
                            } else {
                                $('.content__lyric').style.display = "none";
                                iconHeadLeft.style.color = "#fff";
                                mainContent.style.display = "block";
                                $('.all__tracks-main ').style.display = "none";
                                // close tab infor single
                                $('.container__infor_tracks-playing').style.display = "none";
                                allMainContent.style.width = "85%";
                                allMainContent.style.margin = "auto";

                            }
                        }
                        $('.infor__lyric').style.display = "block"
                        $('.playlist__sings-wrap').style.display = "none";
                        $('.action-right').style.display = "none";
                        $('.infor__artist_lyric-wrap').style.display = "block";
                        headerInfor.style.display = "none";
                        tracksHeaderInfor.style.display = "block";
                        let yearAlbum = _this.dataTrackPlaying.album.releaseDate.split("/");
                        const htmlsInforPlaylistHeader = `
                                <div class="playlist__header">
                                    <div class="playlist_img">
                                        <img src="${_this.dataTrackPlaying.thumbnailM}"
                                            alt="">
                                    </div>
                                    <div class="categories_descr">
                                        <p class="name_playlist">Bài hát</p>
                                        <h1 class="playlist__title-header">${_this.dataTrackPlaying.title}</h1>
                                        <p class="playlist_descr"> ${_this.dataTrackPlaying.artistsNames + " • " + _this.dataTrackPlaying.album.title + " • " + yearAlbum[2]}</p>
                                    </div>
                                </div>
                                `
                        tracksHeaderInfor.innerHTML = htmlsInforPlaylistHeader;

                        // render lyric
                        _this.sentences.map((sentence) => {
                            const words = sentence.words;
                            let key;
                            let lyric = "";

                            words.map((word, index) => {
                                if (index === 0) {
                                    key = Math.floor(word.startTime / 1000);
                                }
                                lyric += `${word.data} `
                            })

                            _this.fullLyric[key] = lyric;
                        })
                        const htmlLyric = Object.entries(_this.fullLyric).map(([key, item]) => (
                            `<p class="lyric_${key}">${item}</p>`
                        ))

                        elLyric.innerHTML = htmlLyric.join("");

                        // render infor artist
                        $('.img__artist_lyric').innerHTML = `<img class="img__artist_" src=${_this.inforArtist.thumbnailM} alt="">`;
                        $('.name__artist_lyric').innerHTML = `<p class="name__artist_">${_this.inforArtist.name}</p>`

                    }
                }

                else {
                    // click to pause
                    let dataTrack = _this.allTracksPlaylist.song.items[_this.currentIndex];
                    let dataAllTrack = _this.allTracksPlaylist.song.items;
                    if (_this.isPlaying) {
                        _this.isPlaying = false;
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "block";
                        iconPause.style.display = "none";
                        element.classList.remove('active_playing-track');
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack, dataAllTrack, status: "pause" });
                    }
                }

            }

        })

        // hover tracks when play
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            let valueSingPlaying = element.querySelector('.name_sing').textContent;

            element.onmouseover = function (e) {
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                    element.querySelector('.name_single').style.color = "#fff";
                    element.querySelector('.name_album').style.color = "#fff";
                } else {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "block";
                    iconPause.style.display = "none";
                    element.querySelector('.name_single').style.color = "#fff";
                    element.querySelector('.name_album').style.color = "#fff";
                }
            }

            element.onmouseout = function (e) {
                let valueSingPlaying = element.querySelector('.name_sing').textContent;
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                    element.querySelector('.name_single').style.color = "#848484";
                    element.querySelector('.name_album').style.color = "#848484";
                } else {
                    orderNumber.style.display = "block";
                    toolplay.style.display = "none";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "none";
                    element.querySelector('.name_single').style.color = "#848484";
                    element.querySelector('.name_album').style.color = "#848484";

                }
            }
        })

    },
    handleRenderTracksTop: async function (props) {
        let _this = this;
        let PlaylistTop = props.playlistMusicTop[0].items.filter((item) => item.title === props.titlePlaylist)
        // get alltracksplaylist
        await fetch(END_POINT + `/api/detailplaylist?id=${PlaylistTop[0].encodeId}`)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.data;
            })
            .catch(error => console.error(error))

        //   inforHeader playlist
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${PlaylistTop[0].thumbnailM}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${_this.allTracksPlaylist.textType}</p>
                    <h1 class="playlist__title-header">${_this.allTracksPlaylist.title}</h1>
                    <p class="playlist_descr"> ${_this.allTracksPlaylist.description}</p>
                </div>
                `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        //    render Tracks
        const htmlsAllTracks = _this.allTracksPlaylist.song.items.map((item, index) => {
            return `
                <div class="content__sing-wrap content-wrap" data-Index=${index}>
                    <div class="descr_sing-single">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                            <div class="play_track-play-main">
                            <i class="fa-solid fa-play icon_play-tracks"></i>
                            <i class="fas fa-pause icon_pause-tracks"></i>
                            </div>
                        <div class="img_title_sing">
                                <img src="${item.thumbnailM}"
                                    alt="">
                            </div>
                            <div class="list__sing-singgle">
                                <p class="name_sing">${item.title}</p>
                                <p class="name_single">${item.artistsNames}</p>
                            </div>
                        </div>
                    </div>
                    <div class="list_album">
                        <div class="name_album">${item?.album ? item.album.title : "Album chưa được cập nhật..."}</div>
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

        // play tracks when click
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            element.onclick = async function (e) {
                // click different song
                const songIndex = e.target.closest('.content__sing-wrap:not(.active_playing-track)');
                if (songIndex || e.target.closest('.name_sing')) {
                    // GET infor artist
                    _this.currentIndex = Number(element.getAttribute('data-Index'));
                    _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                    await fetch(END_POINT + `/api/artist?name=${_this.dataTrackPlaying.artists[0].alias}`)
                        .then(respone => respone.json())
                        .then(data => {
                            _this.inforArtist = data.data;
                        })

                    // render lyric
                    await fetch(END_POINT + `/api/lyric?id=${_this.dataTrackPlaying.encodeId}`)
                        .then(response => response.json())
                        .then(data => {
                            _this.sentences = data.data.sentences;
                            _this.fullLyric = {};
                        })
                        .catch(error => console.error(error))
                    if (songIndex && !e.target.closest('.name_sing')) {
                        let orderNumber = element.querySelector('.order_number');
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.isPlaying = true;
                        element.classList.add('active_playing-track');
                        if (_this.currentIndex !== _this.oldIndex) {
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.name_sing').style.color = "#fff";
                            _this.oldIndex = Number(element.getAttribute('data-Index'));
                        }
                        _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        let dataTrack = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        let dataAllTrack = _this.allTracksPlaylist.song.items;
                        // show descr song
                        $('.name__music').style.display = "block";
                        $('.img__played').style.display = "block";

                        // show descr single when playing
                        // css for main content
                        allMainInforSingle.style.display = "block";
                        allMainContent.style.width = "75%";
                        allMainContent.style.margin = "0";
                        $('.icon__close-tab_infor').style.display = "block";
                        $('.infor__playlist').style.display = "flex";
                        $('.img__album_tracks-playing').innerHTML = `<img class="img__album-playing"src=${_this.dataTrackPlaying.thumbnailM} alt="">`
                        $('.img__infor_artist-playing').innerHTML = `<img class="img__album-playing"src=${_this.inforArtist.thumbnailM} alt="">`
                        $('.name__album_tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.album.title}</p>`;
                        $('.name__sing_tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.title}</p>`;
                        $('.name__artist-tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.artistsNames}</p>`;
                        $('.name__artist-playing').innerHTML = `<p>${_this.dataTrackPlaying.artistsNames}</p>`;
                        $('.name__album_artist-playing').innerHTML = `<p>${_this.dataTrackPlaying.album.title}</p>`;

                        // show icon
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "none";
                        iconPause.style.display = "block";

                        // change color name sing
                        let nameTracks = element.querySelector('.name_sing');
                        nameTracks.style.color = "#1ed760";


                        // change icon play
                        $('.play_track-play-main').classList.add('playing');
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack, dataAllTrack });

                        // render lyric
                        _this.sentences.map((sentence) => {
                            const words = sentence.words;
                            let key;
                            let lyric = "";

                            words.map((word, index) => {
                                if (index === 0) {
                                    key = Math.floor(word.startTime / 1000);
                                }
                                lyric += `${word.data} `
                            })

                            _this.fullLyric[key] = lyric;
                        })
                        // render lyric control
                        const htmRenderlLyric = Object.entries(_this.fullLyric).map(([key, item]) => (
                            `<p class="lyric_control_${key} content__lyric_control" data-time = ${key}>${item}</p>`
                        ))
                        $('.render__lyric_control').innerHTML = htmRenderlLyric.join('');

                    }
                    if (e.target.closest('.name_sing')) {
                        $('.content__lyric').style.display = "flex";
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        _this.status = 1;
                        // icon left
                        iconHeadLeft.onclick = function () {
                            if (_this.status === 1) {
                                iconHeadLeft.style.color = "#fff";
                                $('.infor__lyric').style.display = "none";
                                headerInfor.style.display = "block";
                                tracksHeaderInfor.style.display = "none";
                                $('.playlist__sings-wrap').style.display = "grid";
                                $('.action-right').style.display = "flex";
                                // close tab infor single
                                $('.container__infor_tracks-playing').style.display = "none";
                                allMainContent.style.width = "85%";
                                allMainContent.style.margin = "auto";
                                $('.content__lyric').style.display = "none";
                                _this.status = 0;
                            } else {
                                $('.content__lyric').style.display = "none";
                                iconHeadLeft.style.color = "#fff";
                                mainContent.style.display = "block";
                                $('.all__tracks-main ').style.display = "none";
                                // close tab infor single
                                $('.container__infor_tracks-playing').style.display = "none";
                                allMainContent.style.width = "85%";
                                allMainContent.style.margin = "auto";

                            }
                        }
                        $('.infor__lyric').style.display = "block"
                        $('.playlist__sings-wrap').style.display = "none";
                        $('.action-right').style.display = "none";
                        $('.infor__artist_lyric-wrap').style.display = "block";
                        headerInfor.style.display = "none";
                        tracksHeaderInfor.style.display = "block";
                        let yearAlbum = _this.dataTrackPlaying.album.releaseDate.split("/");
                        const htmlsInforPlaylistHeader = `
                                    <div class="playlist__header">
                                        <div class="playlist_img">
                                            <img src="${_this.dataTrackPlaying.thumbnailM}"
                                                alt="">
                                        </div>
                                        <div class="categories_descr">
                                            <p class="name_playlist">Bài hát</p>
                                            <h1 class="playlist__title-header">${_this.dataTrackPlaying.title}</h1>
                                            <p class="playlist_descr"> ${_this.dataTrackPlaying.artistsNames + " • " + _this.dataTrackPlaying.album.title + " • " + yearAlbum[2]}</p>
                                        </div>
                                    </div>
                                    `
                        tracksHeaderInfor.innerHTML = htmlsInforPlaylistHeader;

                        // render lyric
                        _this.sentences.map((sentence) => {
                            const words = sentence.words;
                            let key;
                            let lyric = "";

                            words.map((word, index) => {
                                if (index === 0) {
                                    key = Math.floor(word.startTime / 1000);
                                }
                                lyric += `${word.data} `
                            })

                            _this.fullLyric[key] = lyric;
                        })
                        const htmlLyric = Object.entries(_this.fullLyric).map(([key, item]) => (
                            `<p class="lyric_${key}">${item}</p>`
                        ))

                        elLyric.innerHTML = htmlLyric.join("");

                        // render infor artist
                        $('.img__artist_lyric').innerHTML = `<img class="img__artist_" src=${_this.inforArtist.thumbnailM} alt="">`;
                        $('.name__artist_lyric').innerHTML = `<p class="name__artist_">${_this.inforArtist.name}</p>`

                    }
                }
                else {
                    // click to pause
                    let dataTrack = _this.allTracksPlaylist.song.items[_this.currentIndex];
                    let dataAllTrack = _this.allTracksPlaylist.song.items;
                    if (_this.isPlaying) {
                        _this.isPlaying = false;
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "block";
                        iconPause.style.display = "none";
                        element.classList.remove('active_playing-track');
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack, dataAllTrack, status: "pause" });
                    }
                }

            }

        })

        // hover tracks when play
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            let valueSingPlaying = element.querySelector('.name_sing').textContent;

            element.onmouseover = function (e) {
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                    element.querySelector('.name_single').style.color = "#fff";
                    element.querySelector('.name_album').style.color = "#fff";
                } else {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "block";
                    iconPause.style.display = "none";
                    element.querySelector('.name_single').style.color = "#fff";
                    element.querySelector('.name_album').style.color = "#fff";
                }
            }

            element.onmouseout = function (e) {
                let valueSingPlaying = element.querySelector('.name_sing').textContent;
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                    element.querySelector('.name_single').style.color = "#848484";
                    element.querySelector('.name_album').style.color = "#848484";
                } else {
                    orderNumber.style.display = "block";
                    toolplay.style.display = "none";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "none";
                    element.querySelector('.name_single').style.color = "#848484";
                    element.querySelector('.name_album').style.color = "#848484";

                }
            }
        })

    },
    handleRenderTracksHot: async function (props) {
        let _this = this;
        let PlaylistHot = props.playlistMusicHot[0].items.filter((item) => item.title === props.titlePlaylist)
        // get alltracksplaylist
        await fetch(END_POINT + `/api/detailplaylist?id=${PlaylistHot[0].encodeId}`)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.data;
            })
            .catch(error => console.error(error))

        //   inforHeader playlist
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${PlaylistHot[0].thumbnailM}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${_this.allTracksPlaylist.textType}</p>
                    <h1 class="playlist__title-header">${_this.allTracksPlaylist.title}</h1>
                    <p class="playlist_descr"> ${_this.allTracksPlaylist.description}</p>
                </div>
                `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        //    render Tracks
        const htmlsAllTracks = _this.allTracksPlaylist.song.items.map((item, index) => {
            return `
                <div class="content__sing-wrap content-wrap" data-Index=${index}>
                    <div class="descr_sing-single">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                            <div class="play_track-play-main">
                            <i class="fa-solid fa-play icon_play-tracks"></i>
                            <i class="fas fa-pause icon_pause-tracks"></i>
                            </div>
                            <div class="img_title_sing">
                                <img src="${item.thumbnailM}"
                                    alt="">
                            </div>
                            <div class="list__sing-singgle">
                                <p class="name_sing">${item.title}</p>
                                <p class="name_single">${item.artistsNames}</p>
                            </div>
                        </div>
                    </div>
                    <div class="list_album">
                        <div class="name_album">${item?.album ? item.album.title : "Album chưa được cập nhật..."}</div>
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

        // play tracks when click
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            element.onclick = async function (e) {
                // click different song
                const songIndex = e.target.closest('.content__sing-wrap:not(.active_playing-track)');
                if (songIndex || e.target.closest('.name_sing')) {
                    // GET infor artist
                    _this.currentIndex = Number(element.getAttribute('data-Index'));
                    _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                    await fetch(END_POINT + `/api/artist?name=${_this.dataTrackPlaying.artists[0].alias}`)
                        .then(respone => respone.json())
                        .then(data => {
                            _this.inforArtist = data.data;
                        })

                    // render lyric
                    await fetch(END_POINT + `/api/lyric?id=${_this.dataTrackPlaying.encodeId}`)
                        .then(response => response.json())
                        .then(data => {
                            _this.sentences = data.data.sentences;
                            _this.fullLyric = {};
                        })
                        .catch(error => console.error(error))
                    if (songIndex && !e.target.closest('.name_sing')) {
                        let orderNumber = element.querySelector('.order_number');
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.isPlaying = true;
                        element.classList.add('active_playing-track');
                        if (_this.currentIndex !== _this.oldIndex) {
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.name_sing').style.color = "#fff";
                            _this.oldIndex = Number(element.getAttribute('data-Index'));
                        }
                        _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        let dataTrack = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        let dataAllTrack = _this.allTracksPlaylist.song.items;
                        // show descr song
                        $('.name__music').style.display = "block";
                        $('.img__played').style.display = "block";

                        // show descr single when playing
                        // css for main content
                        allMainInforSingle.style.display = "block";
                        allMainContent.style.width = "75%";
                        allMainContent.style.margin = "0";
                        $('.icon__close-tab_infor').style.display = "block";
                        $('.infor__playlist').style.display = "flex";
                        $('.img__album_tracks-playing').innerHTML = `<img class="img__album-playing"src=${_this.dataTrackPlaying.thumbnailM} alt="">`
                        $('.img__infor_artist-playing').innerHTML = `<img class="img__album-playing"src=${_this.inforArtist.thumbnailM} alt="">`
                        $('.name__album_tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.album.title}</p>`;
                        $('.name__sing_tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.title}</p>`;
                        $('.name__artist-tracks-playing').innerHTML = `<p>${_this.dataTrackPlaying.artistsNames}</p>`;
                        $('.name__artist-playing').innerHTML = `<p>${_this.dataTrackPlaying.artistsNames}</p>`;
                        $('.name__album_artist-playing').innerHTML = `<p>${_this.dataTrackPlaying.album.title}</p>`;

                        // show icon
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "none";
                        iconPause.style.display = "block";

                        // change color name sing
                        let nameTracks = element.querySelector('.name_sing');
                        nameTracks.style.color = "#1ed760";


                        // change icon play
                        $('.play_track-play-main').classList.add('playing');
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack, dataAllTrack });

                        // render lyric
                        _this.sentences.map((sentence) => {
                            const words = sentence.words;
                            let key;
                            let lyric = "";

                            words.map((word, index) => {
                                if (index === 0) {
                                    key = Math.floor(word.startTime / 1000);
                                }
                                lyric += `${word.data} `
                            })

                            _this.fullLyric[key] = lyric;
                        })
                        // render lyric control
                        const htmRenderlLyric = Object.entries(_this.fullLyric).map(([key, item]) => (
                            `<p class="lyric_control_${key} content__lyric_control" data-time = ${key}>${item}</p>`
                        ))
                        $('.render__lyric_control').innerHTML = htmRenderlLyric.join('');

                    }
                    if (e.target.closest('.name_sing')) {
                        $('.content__lyric').style.display = "flex";
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.dataTrackPlaying = _this.allTracksPlaylist.song.items[_this.currentIndex];
                        _this.status = 1;
                        // icon left
                        iconHeadLeft.onclick = function () {
                            if (_this.status === 1) {
                                iconHeadLeft.style.color = "#fff";
                                $('.infor__lyric').style.display = "none";
                                headerInfor.style.display = "block";
                                tracksHeaderInfor.style.display = "none";
                                $('.playlist__sings-wrap').style.display = "grid";
                                $('.action-right').style.display = "flex";
                                // close tab infor single
                                $('.container__infor_tracks-playing').style.display = "none";
                                allMainContent.style.width = "85%";
                                allMainContent.style.margin = "auto";
                                $('.content__lyric').style.display = "none";
                                _this.status = 0;
                            } else {
                                $('.content__lyric').style.display = "none";
                                iconHeadLeft.style.color = "#fff";
                                mainContent.style.display = "block";
                                $('.all__tracks-main ').style.display = "none";
                                // close tab infor single
                                $('.container__infor_tracks-playing').style.display = "none";
                                allMainContent.style.width = "85%";
                                allMainContent.style.margin = "auto";

                            }
                        }
                        $('.infor__lyric').style.display = "block"
                        $('.playlist__sings-wrap').style.display = "none";
                        $('.action-right').style.display = "none";
                        $('.infor__artist_lyric-wrap').style.display = "block";
                        headerInfor.style.display = "none";
                        tracksHeaderInfor.style.display = "block";
                        let yearAlbum = _this.dataTrackPlaying.album.releaseDate.split("/");
                        const htmlsInforPlaylistHeader = `
                                    <div class="playlist__header">
                                        <div class="playlist_img">
                                            <img src="${_this.dataTrackPlaying.thumbnailM}"
                                                alt="">
                                        </div>
                                        <div class="categories_descr">
                                            <p class="name_playlist">Bài hát</p>
                                            <h1 class="playlist__title-header">${_this.dataTrackPlaying.title}</h1>
                                            <p class="playlist_descr"> ${_this.dataTrackPlaying.artistsNames + " • " + _this.dataTrackPlaying.album.title + " • " + yearAlbum[2]}</p>
                                        </div>
                                    </div>
                                    `
                        tracksHeaderInfor.innerHTML = htmlsInforPlaylistHeader;

                        // render lyric
                        _this.sentences.map((sentence) => {
                            const words = sentence.words;
                            let key;
                            let lyric = "";

                            words.map((word, index) => {
                                if (index === 0) {
                                    key = Math.floor(word.startTime / 1000);
                                }
                                lyric += `${word.data} `
                            })

                            _this.fullLyric[key] = lyric;
                        })
                        const htmlLyric = Object.entries(_this.fullLyric).map(([key, item]) => (
                            `<p class="lyric_${key}">${item}</p>`
                        ))

                        elLyric.innerHTML = htmlLyric.join("");

                        // render infor artist
                        $('.img__artist_lyric').innerHTML = `<img class="img__artist_" src=${_this.inforArtist.thumbnailM} alt="">`;
                        $('.name__artist_lyric').innerHTML = `<p class="name__artist_">${_this.inforArtist.name}</p>`

                    }
                }
                else {
                    // click to pause
                    let dataTrack = _this.allTracksPlaylist.song.items[_this.currentIndex];
                    let dataAllTrack = _this.allTracksPlaylist.song.items;
                    if (_this.isPlaying) {
                        _this.isPlaying = false;
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "block";
                        iconPause.style.display = "none";
                        element.classList.remove('active_playing-track');
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack, dataAllTrack, status: "pause" });
                    }
                }

            }

        })

        // hover tracks when play
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            let valueSingPlaying = element.querySelector('.name_sing').textContent;

            element.onmouseover = function (e) {
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                    element.querySelector('.name_single').style.color = "#fff";
                    element.querySelector('.name_album').style.color = "#fff";
                } else {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "block";
                    iconPause.style.display = "none";
                    element.querySelector('.name_single').style.color = "#fff";
                    element.querySelector('.name_album').style.color = "#fff";
                }
            }

            element.onmouseout = function (e) {
                let valueSingPlaying = element.querySelector('.name_sing').textContent;
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                    element.querySelector('.name_single').style.color = "#848484";
                    element.querySelector('.name_album').style.color = "#848484";
                } else {
                    orderNumber.style.display = "block";
                    toolplay.style.display = "none";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "none";
                    element.querySelector('.name_single').style.color = "#848484";
                    element.querySelector('.name_album').style.color = "#848484";
                }
            }
        })

    },
    handlePlay: function (prop) {
        this.dataNewlyLunched = prop;
        let _this = this;
        // when click btn
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // play song
        audio.onplay = function (prop) {
            _this.isPlaying = true;
            playBtn.classList.add('playing');
            if (_this.dataNewlyLunched.type === "newly-play") {
            } else {
                $(`.content__sing-wrap[data-Index="${_this.currentIndex}"]`).querySelector('.icon_pause-tracks').style.display = "block";
                $(`.content__sing-wrap[data-Index="${_this.currentIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
            }
        };

        // pause song
        audio.onpause = function (prop) {
            _this.isPlaying = false;
            playBtn.classList.remove('playing');
            if (_this.dataNewlyLunched.type = "newly-play") {
            } else {
                $(`.content__sing-wrap[data-Index="${_this.currentIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                $(`.content__sing-wrap[data-Index="${_this.currentIndex}"]`).querySelector('.icon_play-tracks').style.display = "block";
            }
        };

        // update time for progress
        audio.ontimeupdate = function () {
            if (audio.duration) {
                // 
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;

                // current Time
                let timeCurrent = Math.floor(audio.currentTime)
                let currentHours = Math.floor(timeCurrent / 3600);
                let currentMinutes = Math.floor((timeCurrent - (currentHours * 3600)) / 60);
                let currentSeconds = Math.floor(timeCurrent - (currentHours * 3600) - (currentMinutes * 60));
                let totalNumberOfCurentSeconds = (currentMinutes < 10 ? "0" + currentMinutes : currentMinutes) + ":" + (currentSeconds < 10 ? "0" + currentSeconds : currentSeconds);
                $('.current_time').innerHTML = `<div class="current_time-play">${totalNumberOfCurentSeconds}</div>`;


                if (!_this.dataNewlyLunched.lyric) {
                    const isExitLyric = _this.fullLyric[timeCurrent];
                    const renderLyricControl = document.querySelector(`.lyric_control_${timeCurrent}`);
                    if (isExitLyric && timeCurrent !== _this.currentLyric) {
                        renderLyricControl.style.color = "#1ed760";
                        renderLyricControl.classList.add('isPlayed');
                        // const autoRemoveId = setTimeout(function () {
                        //     renderLyricControl.style.display = "none";
                        // }, timeCurrent + 6000);

                        // const htmRenderlLyric = _this.showLyric.slice(_this.indexLyric, _this.indexLyric + 2).map(key => (
                        //     `<p class="lyric_control_${key} content__lyric_control" data-time = ${key}>${_this.fullLyric[key]}</p>`
                        // ))
                        // $('.render__lyric_control').innerHTML = htmRenderlLyric.join('');

                        if (_this.indexLyric - 1 >= 0) {
                            const el = document.querySelector(`.lyric_control_${_this.showLyric[_this.indexLyric - 1]}`);
                            if (el) {
                                el.style.display = "none";
                            }
                        }
                        _this.currentLyric = timeCurrent;
                        _this.indexLyric++;
                    }
                } else {
                    const isExitLyric = _this.dataNewlyLunched.lyric[timeCurrent];
                    const renderLyricControl = document.querySelector(`.lyric_control_${timeCurrent}`);
                    if (isExitLyric && timeCurrent !== _this.currentLyric) {
                        renderLyricControl.style.color = "#1ed760";
                        renderLyricControl.classList.add('isPlayed');
                        // const autoRemoveId = setTimeout(function () {
                        //     renderLyricControl.style.display = "none";
                        // }, timeCurrent + 6000);

                        // const htmRenderlLyric = _this.showLyric.slice(_this.indexLyric, _this.indexLyric + 2).map(key => (
                        //     `<p class="lyric_control_${key} content__lyric_control" data-time = ${key}>${_this.fullLyric[key]}</p>`
                        // ))
                        // $('.render__lyric_control').innerHTML = htmRenderlLyric.join('');

                        if (_this.indexLyric - 1 >= 0) {
                            const el = document.querySelector(`.lyric_control_${_this.dataNewlyLunched.showLyric[_this.indexLyric - 1]}`);
                            if (el) {
                                el.style.display = "none";
                            }
                        }
                        _this.currentLyric = timeCurrent;
                        _this.indexLyric++;
                    }
                }

                // total time
                let time = Math.floor(audio.duration)
                let totalHours = parseInt(time / 3600);
                let totalMinutes = parseInt((time - (totalHours * 3600)) / 60);
                let totalSeconds = Math.floor((time - ((totalHours * 3600) + (totalMinutes * 60))));
                let totalNumberOftotalSeconds = (totalMinutes < 10 ? "0" + totalMinutes : totalMinutes) + ":" + (totalSeconds < 10 ? "0" + totalSeconds : totalSeconds);
                $('.total_time').innerHTML = `<div class="total_time-play">${totalNumberOftotalSeconds}</div>`;
            }
        };

        // khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        };

        // khi next bài hát
        btnNext.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();

        };

        // // khi prev bài hát
        btnPrev.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
        }

        // // khi random bài hát
        btnRandom.onclick = function () {
            if (!_this.isRandom) {
                _this.isRandom = true;
                btnRandom.classList.add("btnActive");
            } else {
                _this.isRandom = false;
                btnRandom.classList.remove("btnActive");
            }
        }

        // // Xử lý next song khi ended bài hát
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                _this.nextSong();
                audio.play();
            }
            // Hoặc dùng click --> btnNext.click(); --> vậy là nó tự động click luôn
        }


        // // Xử lý phats lại 1 bài hát
        btnRepeat.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            btnRepeat.classList.toggle('btnActive', _this.isRepeat);
        }

    },
    loadCurrentSong: async function (prop) {
        const desTrackPlay = `
        <div class="desc_song-play">
            <p class="title_song-play">${prop?.type ? prop.dataTrack.title : this.allTracksPlaylist.song.items[this.currentIndex].title}</p>
            <p class="title_single-play">${prop?.type ? prop.dataTrack.artistsNames : this.allTracksPlaylist.song.items[this.currentIndex].artistsNames}}</p>
            
        </div>
        `
        $('.name__music').innerHTML = desTrackPlay;
        $('.img__played').innerHTML = `<img class="img_song-play" src="${prop?.type ? prop.dataTrack.thumbnailM : this.allTracksPlaylist.song.items[this.currentIndex].thumbnailM}" alt="">`

        // when next track change focus and icon
        let trackNext = $(`.content__sing-wrap[data-Index="${this.currentIndex}"]`);
        $$('.content__sing-wrap').forEach((e, i) => {
            let trackIsPlaying = e.closest('.active_playing-track');
            if (trackIsPlaying) {
                this.oldIndex = Number(e.closest('.active_playing-track').getAttribute('data-Index'));
                if (this.currentIndex !== this.oldIndex) {
                    // oldTrack
                    trackIsPlaying.classList.remove('active_playing-track');
                    $(`.content__sing-wrap[data-Index="${this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                    $(`.content__sing-wrap[data-Index="${this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                    $(`.content__sing-wrap[data-Index="${this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                    // newTrack
                    trackNext.classList.add('active_playing-track');

                    $(`.content__sing-wrap[data-Index="${this.currentIndex}"]`).querySelector('.play_track-play-main').style.display = "block";
                    $(`.content__sing-wrap[data-Index="${this.currentIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                    $(`.content__sing-wrap[data-Index="${this.currentIndex}"]`).querySelector('.icon_pause-tracks').style.display = "block";
                    $(`.content__sing-wrap[data-Index="${this.currentIndex}"]`).querySelector('.order_number').style.display = "none";

                }
                return;
            }
        });

        // get song
        await fetch(END_POINT + `/api//song?id=${prop?.type ? prop.dataTrack.encodeId : this.allTracksPlaylist.song.items[this.currentIndex].encodeId}`)
            .then(respone => respone.json())
            .then(data => this.track = data["data"]["128"])
        audio.src = this.track;
        if (prop?.status === "pause") {
            audio.pause(prop?.iconTrackPlay ? prop.iconTrackPlay : '');
            playBtn.classList.remove('playing');
        }
        else {
            audio.play(prop?.iconTrackPause ? prop.iconTrackPause : '');
            playBtn.classList.add('playing');
            this.handlePlay(prop);
        }

    },
    nextSong: function () {
        this.dataAllTracks = this.allTracksPlaylist.song.items;
        this.currentIndex++;
        if (this.currentIndex >= this.dataAllTracks.length) {
            this.currentIndex = 0;
        }

        this.loadCurrentSong();
    },
    prevSong: function () {
        this.dataAllTracks = this.allTracksPlaylist.song.items;
        this.currentIndex--;

        if (this.currentIndex < 0) {
            this.currentIndex = this.dataAllTracks.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function () {
        this.dataAllTracks = this.allTracksPlaylist.song.items;
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.dataAllTracks.length);
        }
        while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
};

export default TrackPlaylist;