import SearchMusic from "./searchMusic.js";
import TrackPlaylist from "./trackPlaylist.js";

const headerInfor = $('.playlist_header-infor');
const allTracksPlaylist = $('.all_tracks');
const albumsRelate = $('.list_albums-relate');
const albumsInforSearch = $$('.content__infor-albums');
const contentSearch = $('.content_search');
const allTracks = $('.active-show');
const albumRelateSearch = $('.relate_albums-search');

const titleRelate = $('.head__title-relate');

const END_POINT = "http://localhost:3000/api/";


const TracksAlbum = {
    tracksAlbum: [],
    type: '',
    currentIndex: 0,
    oldIndex: 0,
    handleRenderTracks: async function (props) {
        let _this = this;
        console.log("props", props)
        let dataAlbum = props.dataAlbum;
        let titlePlaylist = props.titlePlaylist;
        const tracksAlbumdata = dataAlbum.filter((item) => item.title === titlePlaylist);
        console.log(tracksAlbumdata)
        
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

        await fetch(END_POINT + `detailplaylist?id=${tracksAlbumdata[0].encodeId}`)
            .then(respone => respone.json())
            .then(data => {
                console.log(data)
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
                element.onclick = function (e) {
                    // click different song
                    const songIndex = e.target.closest('.content__sing-wrap:not(.active_playing-track)');
                    if (songIndex) {
                        let orderNumber = element.querySelector('.order_number');
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.isPlaying = true;
                        element.classList.add('active_playing-track');
                        if (_this.currentIndex !== _this.oldIndex) {
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                            $(`.content__sing-wrap[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                            _this.oldIndex = Number(element.getAttribute('data-Index'));
                        }
                        _this.dataTrackPlaying = _this.tracksAlbum[_this.currentIndex];
                        let dataTrack = _this.tracksAlbum[_this.currentIndex];
                        // show descr song
                        $('.name__music').style.display = "block";
                        $('.img__played').style.display = "block";

                        // show icon
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "none";
                        iconPause.style.display = "block";

                        // change icon play
                        $('.play_track-play-main').classList.add('playing');
                        TrackPlaylist.loadCurrentSong({ type: "tracks-play", dataTrack });
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

        // show albums relate with artist
        albumRelateSearch.style.display = "block";
        const htmltitle = `<div class="head_title-relate">Album khác của ${tracksAlbumdata[0].artistsNames}</div>`
        titleRelate.innerHTML = htmltitle;
        SearchMusic.handleRelateAlubms(props.relateAlbum);
    },

}

export default TracksAlbum;