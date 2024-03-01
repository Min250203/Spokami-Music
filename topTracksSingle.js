
import TrackPlaylist from "./trackPlaylist.js";

const headerInfor = $('.playlist_header-infor');
const allTracks = $('.active-show');
const tracksSingle = $('.all_tracks-single');
const artistRelateWrap = $('.hot_music-inforSingle');
const tracksFanLikeWrap = $('.album_fan-wrap');
const contentSearch = $('.content_search');
const iconHeadLeft = $('.left');
const mainContent = $('.desc__contentmain');
const mainInforTracks = $('.all__tracks-main');

const END_POINT = window.env.API_URL;


const TopTracksSingle = {
    tracksInfor: [],
    dataFanSoLike: [],
    currentIndex: 0,
    dataSong: [],
    dataAppearSingle: [],
    dataHotAppearMusic: {},
    dataPlaylist: {},
    oldIndex: 0,
    tracksHotAppearMusic: [],
    tracksfanSoLikeMusic: [],
    handleTracks: async function (props) {
        if (props.type === "infor-Single") {
            this.dataSong = props.dataSong;
            this.dataFanSoLike = props.dataFanSoLike;
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
                        <div class="name_album">${item?.album?.title}</div>
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

            // render fan so like
            const htmlTracksFanLike = _this.dataFanSoLike[0].items.slice(0, 6).map((item, index) => {
                return `
                <div class="card_box-sing playlist__search playlist_fan-like">
                    <img class="img_singgle" src="${item.thumbnailM}" alt="">
                     <p class="title_singgle">${item.name}</p>
                </div>
                `
            })
            tracksFanLikeWrap.innerHTML = htmlTracksFanLike.join("");

            // click fan so like
            $$('.album_fan-wrap').forEach((element, index) => {
                element.onclick = async function (e) {
                    $('.container__maincontent').style.display = "none";
                    $('.img_updating').style.display = "flex";
                    $('.img_updating').innerHTML = ` <img src="./assets/updating.svg" class="img_updating-tracks" alt=""> `;
                    $('.none_of_none-img').style.display = "block";
                    $('.icon__home-main').onclick = function () {
                        $('.img_updating').style.display = "none";
                        mainContent.style.display = "block";
                        mainInforTracks.style.display = "none";
                        $('.content').style.display = "block";
                        $('.container__maincontent').style.display = "block";
                    }
                    // const tracksPlaylist = e.target.closest('.playlist_fan-like');
                    // let titlePlaylist = tracksPlaylist.querySelector('.title_singgle').innerText;
                    // let idDetailPlaylist = _this.dataFanSoLike[0].items.filter(item => item.name === titlePlaylist)
                    // await fetch(END_POINT + `/api/detailplaylist?id=${idDetailPlaylist[0].id}`)
                    //     .then(respone => respone.json())
                    //     .then(data => {
                    //         _this.tracksfanSoLikeMusic = data.data;
                    //     })
                    // iconHeadLeft.style.color = "#fff";
                    // _this.status = 1;
                    // // icon left
                    // iconHeadLeft.onclick = function () {
                    //     if (_this.status === 1) {
                    //         iconHeadLeft.style.color = "#fff";
                    //         contentSearch.style.display = "block";
                    //         allTracks.style.display = "none";
                    //         _this.status = 0;
                    //     } else {
                    //         iconHeadLeft.style.color = "#9c9c9c";
                    //         mainContent.style.display = "block";
                    //         $('.content_search').style.display = "none";
                    //         mainInforTracks.style.display = "none";
                    //     }
                    // }
                    // contentSearch.style.display = "none";
                    // allTracks.style.display = "block";
                    // $('.list__Playlist').style.display = "none";
                    // $('.list_Tracks-single').style.display = "flex";
                    // $('.album_relate-active').style.display = "block";
                    // $('.fan_like-tracks').style.display = "none";
                    // $('.album_relate-active').style.display = "none";
                }
            })

            // render music hot appear
            const htmlsHotAppearForMusic = props.dataHotAppearMusic.map((item, index) => {
                return ` 
                        <div class="card_box-sing playlist__search hot_music-appear slide_banner" data-Index=${index}>
                            <img class="img_singgle img_slide-banner"src="${item.thumbnailM}" alt="">
                        </div>
                    </div>
                        `
            })
            artistRelateWrap.innerHTML = htmlsHotAppearForMusic.join("");

            // click hot appear for music
            $$('.artist_box-wrap').forEach((element, index) => {
                element.onclick = async function (e) {
                    const tracksHotAppear = e.target.closest('.hot_music-appear');
                    let titlePlaylist = tracksHotAppear.querySelector('.img_slide-banner').src;
                    let idDetailPlaylist = props.dataHotAppearMusic.filter(item => item.thumbnailM === titlePlaylist)
                    await fetch(END_POINT + `/api/detailplaylist?id=${idDetailPlaylist[0].encodeId}`)
                        .then(respone => respone.json())
                        .then(data => {
                            _this.tracksHotAppearMusic = data.data;
                        })
                    iconHeadLeft.style.color = "#fff";
                    _this.status = 1;
                    // icon left
                    iconHeadLeft.onclick = function () {
                        if (_this.status === 1) {
                            iconHeadLeft.style.color = "#fff";
                            contentSearch.style.display = "block";
                            allTracks.style.display = "none";
                            _this.status = 0;
                        } else {
                            iconHeadLeft.style.color = "#9c9c9c";
                            mainContent.style.display = "block";
                            $('.content_search').style.display = "none";
                            mainInforTracks.style.display = "none";
                        }
                    }
                    let type = "hotAppear-Single";
                    let dataHotAppearMusic = _this.tracksHotAppearMusic;
                    contentSearch.style.display = "none";
                    allTracks.style.display = "block";
                    $('.list__Playlist').style.display = "none";
                    $('.list_Tracks-single').style.display = "flex";
                    $('.album_relate-active').style.display = "block";
                    $('.fan_like-tracks').style.display = "none";
                    $('.album_relate-active').style.display = "none";
                }
            })

        }
        else if (props.type === "appear-Single") {
            this.dataAppearSingle = props.dataAppearSingle;
            let dataInforSingle = props.dataInforSingle;

            let _this = this
            // header title tracksSingle
            const htmlsTracksAppearSingle = `
                    <div class="playlist__header">
                        <div class="playlist_img">
                            <img src="${_this.dataAppearSingle[0].thumbnailM}"
                                alt="">
                        </div>
                        <div class="categories_descr">
                            <p class="name_playlist">Nghệ sĩ</p>
                            <h1 class="playlist__title-header">${_this.dataAppearSingle[0].title}</h1>
                        </div
                        `
            headerInfor.innerHTML = htmlsTracksAppearSingle;

            const htmlsTracks = _this.dataAppearSingle.map((item, index) => {
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
                        if (_this.currentIndex !== _this.oldIndex) {
                            $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                            $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                            $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                            _this.oldIndex = Number(element.getAttribute('data-Index'));
                        }
                        _this.dataTrackPlaying = _this.dataAppearSingle[_this.currentIndex];
                        let dataTrack = _this.dataAppearSingle[_this.currentIndex];

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
                        let dataTrack = _this.dataAppearSingle[_this.currentIndex];
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
        }
        else if (props.type === "hotAppear-Single") {
            this.dataHotAppearMusic = props.dataHotAppearMusic;
            let dataInforSingle = props.dataInforSingle;

            let _this = this
            // header title tracksSingle
            const htmlsTracksAppearSingle = `
                    <div class="playlist__header">
                        <div class="playlist_img">
                            <img src="${_this.dataHotAppearMusic.thumbnailM}"
                                alt="">
                        </div>
                        <div class="categories_descr">
                            <p class="name_playlist">Nghệ sĩ</p>
                            <h1 class="playlist__title-header">${_this.dataHotAppearMusic.title}</h1>
                        </div
                        `
            headerInfor.innerHTML = htmlsTracksAppearSingle;

            const htmlsTracks = _this.dataHotAppearMusic.song.items.map((item, index) => {
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
                        if (_this.currentIndex !== _this.oldIndex) {
                            $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                            $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                            $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                            _this.oldIndex = Number(element.getAttribute('data-Index'));
                        }
                        _this.dataTrackPlaying = _this.dataHotAppearMusic[_this.currentIndex];
                        let dataTrack = _this.dataHotAppearMusic[_this.currentIndex];

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
                        let dataTrack = _this.dataHotAppearMusic[_this.currentIndex];
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
        }
        else if (props.type === "playlist-Single") {
            this.dataPlaylist = props.dataPlaylist;
            let dataInforSingle = props.dataInforSingle;

            let _this = this
            // header title tracksSingle
            const htmlsTracksAppearSingle = `
                    <div class="playlist__header">
                        <div class="playlist_img">
                            <img src="${_this.dataPlaylist.thumbnailM}"
                                alt="">
                        </div>
                        <div class="categories_descr">
                            <p class="name_playlist">${_this.dataPlaylist.sectionId}</p>
                            <h1 class="playlist__title-header">${_this.dataPlaylist.title}</h1>
                        </div
                        `
            headerInfor.innerHTML = htmlsTracksAppearSingle;

            const htmlsTracks = _this.dataPlaylist.song.items.map((item, index) => {
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
                        <div class="name_album">${item.album?.title}</div>
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
                        if (_this.currentIndex !== _this.oldIndex) {
                            $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                            $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                            $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                            _this.oldIndex = Number(element.getAttribute('data-Index'));
                        }
                        _this.dataTrackPlaying = _this.dataPlaylist.song.items[_this.currentIndex];
                        let dataTrack = _this.dataPlaylist.song.items[_this.currentIndex];

                        // show descr song
                        $('.name__music').style.display = "block";
                        $('.img__played').style.display = "block";

                        // show icon
                        toolplay.style.display = "block";
                        iconPlay.style.display = "none";
                        iconPause.style.display = "block";

                        // change icon play
                        $('.play_track-play-main').classList.add('playing');
                        TrackPlaylist.loadCurrentSong({ type: "playlist-track", dataTrack });
                    }
                    else {
                        // click to pause
                        let dataTrack = _this.dataPlaylist.song.items[_this.currentIndex];
                        if (_this.isPlaying) {
                            _this.isPlaying = false;
                            orderNumber.style.display = "none";
                            toolplay.style.display = "block";
                            iconPlay.style.display = "block";
                            iconPause.style.display = "none";
                            element.classList.remove('active_playing-track');
                            TrackPlaylist.loadCurrentSong({ type: "playlist-play", dataTrack, status: "pause" });
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
        }
        else if (props.type === "infor-RelateSingle") {
            let tilteArtistRelate = props.tilteArtistRelate;
            let artistParameters = props.artistParameters;
            let artistRelate = props.artistRelate;
            let _this = this;
            let nameArtistRelate = artistRelate.filter((item) => item.name === tilteArtistRelate);
            await fetch('https://api.spotify.com/v1/artists/' + nameArtistRelate[0].id + '/top-tracks' + '?market=VN&limit=50', artistParameters)
                .then(response => response.json())
                .then(data => {
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
    },
    // handleTracksFanLike: async function() {

    // }
}

export default TopTracksSingle;