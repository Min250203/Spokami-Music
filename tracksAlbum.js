import SearchMusic from "./searchMusic.js";
import TrackPlaylist from "./trackPlaylist.js";

const headerInfor = $('.playlist_header-infor');
const allTracksPlaylist = $('.all_tracks');
const albumsRelate = $('.list_albums-relate');
const albumsInforSearch = $$('.content__infor-albums');
const contentSearch = $('.content_search');
const allTracks = $('.active-show');
const albumRelateSearch = $('.relate_albums-search');
const allMainContent = $('.container__maincontent');
const iconHeadLeft = $('.left');
const tracksHeaderInfor = $('.tracks_header-infor');
const allMainInforSingle = $('.container__infor_tracks-playing');



const titleRelate = $('.head__title-relate');

const END_POINT = window.env.API_URL;

const TracksAlbum = {
    tracksAlbum: [],
    type: '',
    currentIndex: 0,
    oldIndex: 0,
    fullLyric: {},
    showLyric: [],
    handleRenderTracks: async function (props) {
        let _this = this;
        let dataAlbum = props.dataAlbum;
        let titlePlaylist = props.titlePlaylist;
        const tracksAlbumdata = dataAlbum.filter((item) => item.title === titlePlaylist);

        const htmlsTracksAlbum = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${tracksAlbumdata[0].thumbnailM}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${tracksAlbumdata[0].textType}</p>
                    <h1 class="playlist__title-header">${tracksAlbumdata[0].title}</h1>
                </div
                `
        headerInfor.innerHTML = htmlsTracksAlbum;

        await fetch(END_POINT + `/api/detailplaylist?id=${tracksAlbumdata[0].encodeId}`)
            .then(respone => respone.json())
            .then(data => {
                _this.tracksAlbum = data.data.song.items;
            })
        const htmlsAllTracks = _this.tracksAlbum.map((item, index) => {
            // // total time music
            let time = Math.floor(item.duration)
            let totalHours = parseInt(time / 3600);
            let totalMinutes = parseInt((time - (totalHours * 3600)) / 60);
            let totalSeconds = Math.floor((time - ((totalHours * 3600) + (totalMinutes * 60))));
            let totalNumberOftotalSeconds = (totalMinutes < 10 ? "0" + totalMinutes : totalMinutes) + ":" + (totalSeconds < 10 ? "0" + totalSeconds : totalSeconds);

            return `
            <div class="content__sing-wrap content-wrap tracks_album-search">
                <div class="descr_sing-single">
                    <div class="list__title_sing">
                        <div class="order_number">${index + 1}</div>
                        <div class="play_track-play-main">
                            <i class="fa-solid fa-play icon_play-tracks"></i>
                            <i class="fas fa-pause icon_pause-tracks"></i>
                        </div>
                        <div class="list__sing-singgle">
                            <p class="name_sing">${item.title}</p>
                            <p class="name_single">${item.artistsNames}</p>
                        </div>
                    </div>
                </div>
                <div class="list_clock">
                <i class="fa-regular fa-heart"></i>
                <div class="time-clock">${totalNumberOftotalSeconds}</div>
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
                    let orderNumber = element.querySelector('.order_number');
                    // GET infor artist
                    _this.currentIndex = Number(element.getAttribute('data-Index'));
                    _this.dataTrackPlaying = _this.tracksAlbum[_this.currentIndex];
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
                        _this.dataTrackPlaying = _this.tracksAlbum[_this.currentIndex];
                        let dataTrack = _this.tracksAlbum[_this.currentIndex];
                        let dataAllTrack = _this.tracksAlbum;
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
                        _this.dataTrackPlaying = _this.tracksAlbum[_this.currentIndex];
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
                    let dataTrack = _this.tracksAlbum[_this.currentIndex];
                    if (_this.isPlaying) {
                        _this.isPlaying = false;
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "block";
                        iconPause.style.display = "none";
                        element.classList.remove('active_playing-track');
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack, status: "pause" });
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
                _this.currentIndex = Number(element.getAttribute('data-Index'))
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                } else {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "block";
                    iconPause.style.display = "none";
                }
            }

            element.onmouseout = function (e) {
                _this.currentIndex = Number(element.getAttribute('data-Index'))
                let valueSingPlaying = element.querySelector('.name_sing').textContent;
                if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                    orderNumber.style.display = "none";
                    toolplay.style.display = "block";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "block";
                } else {
                    orderNumber.style.display = "block";
                    toolplay.style.display = "none";
                    iconPlay.style.display = "none";
                    iconPause.style.display = "none";
                }
            }
        })

        // click close tab infor tracks
        $('.icon__close-tab_infor').onclick = function () {
            $('.container__infor_tracks-playing').style.display = "none";
            allMainContent.style.width = "85%";
            allMainContent.style.margin = "auto";
        }

        // show albums relate with artist
        albumRelateSearch.style.display = "block";
        const htmltitle = `<div class="head_title-relate">Album khác của ${tracksAlbumdata[0].artistsNames}</div>`
        titleRelate.innerHTML = htmltitle;
        SearchMusic.handleRelateAlubms(props.relateAlbum);
    },

}

export default TracksAlbum;