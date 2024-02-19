
import TrackPlaylist from "./trackPlaylist.js";

const headerInfor = $('.playlist_header-infor');
const allTracks = $('.active-show');
const tracksSingle = $('.all_tracks-single');
const tracksFanLikeWrap = $('.album_fan-wrap');


const TopTracksSingle = {
    tracksInfor: [],
    tracksFanLike: [],
    currentIndex: 0,
    dataSong: [],
    oldIndex: 0,
    handleTracks: async function (props) {
        console.log("props", props)
        if (props.type === "infor-Single") {
            this.dataSong = props.dataSong;
            let dataInforSingle = props.dataInforSingle;
            let _this = this

            // header title tracksSingle
            const htmlsTracksAlbum = `
                <div class="playlist__header">
                    <div class="playlist_img">
                        <img src="${dataInforSingle.thumbnailM}"
                            alt="">
                    </div>
                    <div class="categories_descr">
                        <p class="name_playlist">Nghệ sĩ</p>
                        <h1 class="playlist__title-header">${dataInforSingle.name}</h1>
                    </div
                    `
            headerInfor.innerHTML = htmlsTracksAlbum;

            const htmlsTracks = _this.dataSong.map((item, index) => {
                // // total time music
                let time = Math.floor(item.duration)
                let totalHours = parseInt(time / 3600);
                let totalMinutes = parseInt((time - (totalHours * 3600)) / 60);
                let totalSeconds = Math.floor((time - ((totalHours * 3600) + (totalMinutes * 60))));
                let totalNumberOftotalSeconds = (totalMinutes < 10 ? "0" + totalMinutes : totalMinutes) + ":" + (totalSeconds < 10 ? "0" + totalSeconds : totalSeconds);

                return `
                <div class="content_tracks-single" data-Index=${index}>
                    <div class="descr_sing-single-search">
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
                        <div class="name_album">${item.album.title}</div>
                    </div>
                    <div class="list_clock">
                        <i class="fa-regular fa-heart"></i>
                        <div class="time-clock">${totalNumberOftotalSeconds}</div>
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
                `
            })
            tracksSingle.innerHTML = htmlsTracks.join("");

            // click top tracks
            $$('.content_tracks-single').forEach((element, index) => {
                let orderNumber = element.querySelector('.order_number');
                let iconPlay = element.querySelector('.icon_play-tracks');
                let toolplay = element.querySelector('.play_track-play-main');
                let iconPause = element.querySelector('.icon_pause-tracks');
                element.onclick = function (e) {
                    // click different song
                    const songIndex = e.target.closest('.content_tracks-single:not(.active_playing-track)');
                    if (songIndex) {
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.isPlaying = true;
                        element.classList.add('active_playing-track');
                        console.log(_this.currentIndex)
                        console.log(_this.oldIndex)
                        if (_this.currentIndex !== _this.oldIndex) {
                            $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                            $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                            $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                            _this.oldIndex = Number(element.getAttribute('data-Index'));
                        }
                        _this.dataTrackPlaying = _this.dataSong[_this.currentIndex];
                        let dataTrack = _this.dataSong[_this.currentIndex];

                        // show descr song
                        $('.name__music').style.display = "block";
                        $('.img__played').style.display = "block";

                        // show icon
                        toolplay.style.display = "block";
                        iconPlay.style.display = "none";
                        iconPause.style.display = "block";

                        // change icon play
                        $('.play_track-play-main').classList.add('playing');
                       TrackPlaylist.loadCurrentSong({ type: "infor-single-track", dataTrack });
                    }
                    else {
                        // click to pause
                        let dataTrack = _this.dataSong[_this.currentIndex];
                        if (_this.isPlaying) {
                            _this.isPlaying = false;
                            orderNumber.style.display = "none";
                            toolplay.style.display = "block";
                            iconPlay.style.display = "block";
                            iconPause.style.display = "none";
                            element.classList.remove('active_playing-track');
                            TrackPlaylist.loadCurrentSong({ type: "single-track-play", dataTrack, status: "pause" });
                        }
                    }
                }
            })

            // hover tracks to prepair play
            $$('.content_tracks-single').forEach((element, index) => {
                let orderNumber = element.querySelector('.order_number');
                let iconPlay = element.querySelector('.icon_play-tracks');
                let iconPause = element.querySelector('.icon_pause-tracks');
                let toolplay = element.querySelector('.play_track-play-main');
                let valueSingPlaying = element.querySelector('.name_sing').textContent;

                element.onmouseover = function (e) {
                    _this.currentIndex = Number(element.getAttribute('data-Index'))
                    if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                        toolplay.style.display = "block";
                        iconPlay.style.display = "none";
                        iconPause.style.display = "block";
                    orderNumber.style.display = "none";
                    } else {
                        toolplay.style.display = "block";
                        iconPlay.style.display = "block";
                    orderNumber.style.display = "none";
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

            // // fan so like
            // await fetch('https://api.spotify.com/v1/artists/' + artistID + '/related-artists' + '?market=VN', artistParameters)
            //     .then(response => response.json())
            //     .then(data => {
            //         return _this.tracksFanLike = data.artists
            //     })
            //     .catch(error => console.error("error", error))

            // const htmlTracksFanLike = _this.tracksFanLike.slice(0, 6).map((item, index) => {
            //     return `
            //     <div class="card_box-sing playlist__search">
            //         <img class="img_singgle" src="${item.images[0].url}" alt="">
            //          <p class="title_singgle">${item.name}</p>
            //     </div>
            //     `
            // })

            // tracksFanLikeWrap.innerHTML = htmlTracksFanLike.join("");

        } else if (props.type === "infor-RelateSingle") {
            let tilteArtistRelate = props.tilteArtistRelate;
            console.log(tilteArtistRelate)
            console.log(props.itemSingle)
            let artistParameters = props.artistParameters;
            let artistRelate = props.artistRelate;
            let _this = this;
            let nameArtistRelate = artistRelate.filter((item) => item.name === tilteArtistRelate);
            console.log(nameArtistRelate)
            await fetch('https://api.spotify.com/v1/artists/' + nameArtistRelate[0].id + '/top-tracks' + '?market=VN&limit=50', artistParameters)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    return _this.tracksInfor = data.tracks;

                })
                .catch(error => console.error('Error:', error))
            // header title tracksSingle
            const htmlsTracksAlbum = `
               <div class="playlist__header">
                   <div class="playlist_img">
                       <img src="${_this.tracksInfor[0].album.images[0].url}"
                           alt="">
                   </div>
                   <div class="categories_descr">
                       <p class="name_playlist">${_this.tracksInfor[0].type}</p>
                       <h1 class="playlist__title-header">${_this.tracksInfor[0].artists[0].name}</h1>
                   </div
                   `
            headerInfor.innerHTML = htmlsTracksAlbum;

            const htmlsTracks = _this.tracksInfor.map((item, index) => {
                return `
               <div class="content_tracks-single">
                   <div class="descr_sing-single-search">
                       <div class="list__title_sing">
                           <div class="order_number">${index + 1}</div>
                           <div class="img_title_sing">
                               <img src="${item.album.images[0].url}"
                                   alt="">
                           </div>
                           <div class="list__sing-singgle">
                               <p class="name_sing">${item.name}</p>
                               <p class="name_single">${item.artists[0].name}</p>
                           </div>
                       </div>
                   </div>
                   <div class="list_album">
                       <div class="name_album">${item.album.name}</div>
                   </div>
                   <div class="list_clock">
                       <i class="fa-regular fa-heart"></i>
                       <div class="time-clock">2 phút</div>
                       <i class="fa-solid fa-ellipsis"></i>
                   </div>
               </div>
               `
            })
            tracksSingle.innerHTML = htmlsTracks.join("");

            // fan so like
            await fetch('https://api.spotify.com/v1/artists/' + nameArtistRelate[0].id + '/related-artists' + '?market=VN', artistParameters)
                .then(response => response.json())
                .then(data => {
                    return _this.tracksFanLike = data.artists
                })
                .catch(error => console.error("error", error))

            const htmlTracksFanLike = _this.tracksFanLike.slice(0, 6).map((item, index) => {
                return `
               <div class="card_box-sing playlist__search">
                   <img class="img_singgle" src="${item.images[0].url}" alt="">
                    <p class="title_singgle">${item.name}</p>
               </div>
               `
            })

            tracksFanLikeWrap.innerHTML = htmlTracksFanLike.join("");
        }

    }
}

export default TopTracksSingle;