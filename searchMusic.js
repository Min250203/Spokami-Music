
import TracksAlbum from "./tracksAlbum.js";
import TopTracksSingle from "./topTracksSingle.js";
import TrackPlaylist from "./trackPlaylist.js";

const albumsInforSearch = $$('.content__infor-albums');
const tracksInforSearch = $('.tracks-search');
const allInforSearch = $('.content__infor-all');
const singleWrapSearch = $('.single_wrap-search');
const singWrapSearch = $('.sing_wrap-search');
const artistRelateWrap = $('.artist_box-wrap');
const playlistWrapSearch = $('.playlist_box-wrap');
const playlistInforSearch = $('.content__infor-playlist');
const appearSingleWrapSearch = $('.appear_single-wrap');
const albumsWrap = $('.album_box-wrap');
const mainInforTracks = $('.children__content-playlist');
const mainContent = $('.desc__contentmain');
const allTracks = $('.active-show');
const contentSearch = $('.content_search');
const albumRelateSearch = $('.relate_albums-search');
const iconHeadLeft = $('.left');
const cardSing = $$('.card_box-sing');
const musicFor = $('.list__musicForU');
const allMainContent = $('.container__maincontent');
const allMainInforSingle = $('.container__infor_tracks-playing');

const END_POINT = window.env.API_URL;

const SearchMusic = {
    tracksInfor: [],
    allInfor: [],
    tracksInforAllSearch: [],
    artistRelate: [],
    albumID: '',
    currentIndex: 0,
    albums: [],
    artistParameters: {},
    relateAlbum: false,
    type: '',
    itemSingle: {},
    dataValueSearch: {},
    artistSearch: [],
    appearSingle: [],
    indexTracksPlaylist: 0,
    oldIndex: 0,
    typeSearch: "artist",
    tracksAppearSingle: [],
    tracksHotAppearMusic: {},
    tracksPlaylist: {},
    status: 0,
    fullLyric: {},
    showLyric: [],
    handleSearch: async function (props) {
        let _this = this;
        if (props) {
            await fetch(END_POINT + `/api/search?keyword=${props.valueInput}`)
                .then(response => response.json())
                .then(data => {
                    _this.dataValueSearch = data.data;
                })
                .catch(error => console.error('Error:', error));

            // get with Artist IA all albums from that artist
            if (_this.type === "album") {
                const htmlsAlbumSearch = _this.dataValueSearch.artists[0].map((album, index) => {
                    let yearAlbum = album.release_date.split("-", 1);
                    return `
                <div class="card_box-sing playlist__search" data-Index=${index}>
                    <img class="img_singgle"
                        src="${album.images[0].url}"
                        alt="">
                        <div class="descr">
                        <p class="title_singgle">${album.name}</p>
                        <p class="desc_Singgle">${yearAlbum + " • " + album.artists[0].name}</p>
                        </div>
                </div>
                    `
                })
                albumsInforSearch.forEach(element => { element.innerHTML = htmlsAlbumSearch.join("") })
            } else if (props.type === "playlist") {
                const htmlsPlaylistSearch = _this.dataValueSearch.playlists.map((item, index) => {
                    return `
                        <div class="card_box-sing playlist__search" data-Index=${index}>
                            <img class="img_singgle" src="${item.thumbnailM}"alt="">
                            <div class="descr">
                                <p class="title_singgle">${item.title}</p>
                                <p class="desc_Singgle">${item.artistsNames}</p>
                            </div>
                        </div>
                    `
                })
                playlistInforSearch.innerHTML = htmlsPlaylistSearch.join("");

                // when click playlist
                $$('.content__infor-playlist').forEach((element, index) => {
                    element.onclick = function (e) {
                        const tracksPlaylist = e.target.closest('.card_box-sing');
                        let titlePlaylist = tracksPlaylist.querySelector('.title_singgle').innerText;
                        let dataPlaylist = _this.dataValueSearch.playlists
                        _this.handleEventInforSearch({ dataPlaylist, type: "tracksPlaylist", titlePlaylist });

                    }
                })
            } else if (props.type === "sing") {
                const htmlsTracks = _this.albums[0].items.map((item, index) => {
                    // // total time music
                    let time = Math.floor(item.duration)
                    let totalHours = parseInt(time / 3600);
                    let totalMinutes = parseInt((time - (totalHours * 3600)) / 60);
                    let totalSeconds = Math.floor((time - ((totalHours * 3600) + (totalMinutes * 60))));
                    let totalNumberOftotalSeconds = (totalMinutes < 10 ? "0" + totalMinutes : totalMinutes) + ":" + (totalSeconds < 10 ? "0" + totalSeconds : totalSeconds);

                    return `
                                <div class="content__sing-wrap-search" data-Index=${index}>
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
                                       <div class="name_album">${item?.album ? item.album.title : "Album chưa được cập nhật..."}</div>
                                    </div>
                                    <div class="list_clock">
                                        <div class="time-clock">${totalNumberOftotalSeconds}</div>
                                    </div>
                                </div>
                `
                })
                tracksInforSearch.innerHTML = htmlsTracks.join("");

                // play tracks when click
                $$('.content__sing-wrap-search').forEach((element, index) => {
                    let orderNumber = element.querySelector('.order_number');
                    let iconPlay = element.querySelector('.icon_play-tracks');
                    let iconPause = element.querySelector('.icon_pause-tracks');
                    let toolplay = element.querySelector('.play_track-play-main');
                    element.onclick = async function (e) {
                        // click different song
                        const songIndex = e.target.closest('.content__sing-wrap-search:not(.active_playing-track)');
                        if (songIndex || e.target.closest('.name_sing')) {
                            // GET infor artist
                            _this.currentIndex = Number(element.getAttribute('data-Index'));
                            _this.dataTrackPlaying = _this.albums[0].items[_this.currentIndex];
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
                                    $(`.content__sing-wrap-search[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                                    $(`.content__sing-wrap-search[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                                    $(`.content__sing-wrap-search[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                                    $(`.content__sing-wrap-search[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                                    $(`.content__sing-wrap-search[data-Index="${_this.oldIndex}"]`).querySelector('.name_sing').style.color = "#fff";
                                    _this.oldIndex = Number(element.getAttribute('data-Index'));
                                }
                                _this.dataTrackPlaying = _this.albums[0].items[_this.currentIndex];
                                let dataTrack = _this.albums[0].items[_this.currentIndex];
                                let dataAllTrack = _this.albums[0].items;
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
                                _this.dataTrackPlaying = _this.albums[0].items[_this.currentIndex];
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
                            let dataTrack = _this.albums[0].items[_this.currentIndex];
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
                $$('.content__sing-wrap-search').forEach((element, index) => {
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
            } else {
                // data Single for album and artist when search
                await fetch(END_POINT + `/api//artist?name=${_this.dataValueSearch.artists[0].alias}`)
                    .then(response => response.json())
                    .then(data => {
                        _this.albums = data.data.sections;

                    })
                    .catch(error => console.error('Error:', error))

                // data Single for appear single when search
                await fetch(END_POINT + `/api//artistsong?id=${_this.dataValueSearch.artists[0].id}&page=1&count=10`)
                    .then(response => response.json())
                    .then(data => {
                        _this.appearSingle = data.data.items;
                    })

                // inforSingle when search
                const htmlsInforSinglelSearch =
                    `
                    <div class="single-wrap head__infor-search">
                        <div class="img_single-search">
                            <img src="${_this.dataValueSearch.artists[0].thumbnailM}" alt="">
                        </div>
                        <p class="single-search">${_this.dataValueSearch.artists[0].name}</p>
                        <p class="artist-search">Nghệ sĩ</p>
                    </div>
                `
                singleWrapSearch.innerHTML = htmlsInforSinglelSearch;

                // when click infor single
                singleWrapSearch.onclick = function (e) {
                    const tracksSingle = e.target.closest('.single-wrap');
                    let dataSong = _this.dataValueSearch.songs
                    _this.handleEventInforSearch({ dataSong, type: "inforSingle", tracksSingle });
                }

                // top tracks when search single
                const htmlsTracksInforAllSearch = _this.dataValueSearch.songs.slice(0, 4).map((item, index) => {
                    // // total time music
                    let time = Math.floor(item.duration)
                    let totalHours = parseInt(time / 3600);
                    let totalMinutes = parseInt((time - (totalHours * 3600)) / 60);
                    let totalSeconds = Math.floor((time - ((totalHours * 3600) + (totalMinutes * 60))));
                    let totalNumberOftotalSeconds = (totalMinutes < 10 ? "0" + totalMinutes : totalMinutes) + ":" + (totalSeconds < 10 ? "0" + totalSeconds : totalSeconds);

                    return `
                        <div class="sing_wrap" data-Index=${index}>
                            <div class="list__title_sing">
                                <div class="play_track-play">
                                <i class="fa-solid fa-play icon_play-tracks"></i>
                                <i class="fas fa-pause icon_pause-tracks"></i>
                                </div>
                                <div class="img_title_sing">
                                    <img src="${item.thumbnailM}" alt="">
                                </div>
                                <div class="list__sing-search">
                                    <p class="name_sing">${item.title}</p>
                                    <p class="name_single">${item.artistsNames}</p>
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
                singWrapSearch.innerHTML = htmlsTracksInforAllSearch.join('');

                // click top tracks
                $$('.sing_wrap').forEach((element, index) => {
                    let orderNumber = element.querySelector('.order_number');
                    let iconPlay = element.querySelector('.icon_play-tracks');
                    let toolplay = element.querySelector('.play_track-play');
                    let iconPause = element.querySelector('.icon_pause-tracks');
                    element.onclick = async function (e) {
                        // click different song
                        const songIndex = e.target.closest('.sing_wrap:not(.active_playing-track)');
                        if (songIndex || e.target.closest('.name_single')) {
                            // GET infor artist
                            _this.currentIndex = Number(element.getAttribute('data-Index'));
                            _this.dataTrackPlaying = _this.dataValueSearch.songs[_this.currentIndex];
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
                            if (songIndex && !e.target.closest('.name_single')) {
                                let orderNumber = element.querySelector('.order_number');
                                _this.currentIndex = Number(element.getAttribute('data-Index'));
                                _this.isPlaying = true;
                                element.classList.add('active_playing-track');
                                if (_this.currentIndex !== _this.oldIndex) {
                                    $(`.sing_wrap[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                                    $(`.sing_wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                                    $(`.sing_wrap[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                                    $(`.sing_wrap[data-Index="${_this.oldIndex}"]`).querySelector('.name_sing').style.color = "#fff";
                                    _this.oldIndex = Number(element.getAttribute('data-Index'));
                                }
                                _this.dataTrackPlaying = _this.dataValueSearch.songs[_this.currentIndex];
                                let dataTrack = _this.dataValueSearch.songs[_this.currentIndex];
                                // show descr song
                                $('.name__music').style.display = "block";
                                $('.img__played').style.display = "block";

                                // show icon
                                toolplay.style.display = "block";
                                iconPlay.style.display = "none";
                                iconPause.style.display = "block";

                                // change color name sing
                                let nameTracks = element.querySelector('.name_sing');
                                nameTracks.style.color = "#1ed760";

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

                                // change icon play
                                $('.play_track-play-main').classList.add('playing');
                                let lyric = _this.fullLyric;
                                let showLyric = _this.showLyric;
                                TrackPlaylist.loadCurrentSong({ type: "top-tracks", dataTrack, lyric, showLyric });

                            }
                        }
                        else {
                            // click to pause
                            let dataTrack = _this.dataValueSearch.songs[_this.currentIndex];
                            if (_this.isPlaying) {
                                _this.isPlaying = false;
                                orderNumber.style.display = "none";
                                toolplay.style.display = "block";
                                iconPlay.style.display = "block";
                                iconPause.style.display = "none";
                                element.classList.remove('active_playing-track');
                                TrackPlaylist.loadCurrentSong({ type: "topTracks-play", dataTrack, status: "pause" });
                            }
                        }
                    }
                })

                // hover tracks to prepair play
                $$('.sing_wrap').forEach((element, index) => {
                    let iconPlay = element.querySelector('.icon_play-tracks');
                    let iconPause = element.querySelector('.icon_pause-tracks');
                    let toolplay = element.querySelector('.play_track-play');
                    let valueSingPlaying = element.querySelector('.name_sing').textContent;
                    element.onmouseover = function (e) {
                        _this.currentIndex = Number(element.getAttribute('data-Index'))
                        if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                            toolplay.style.display = "block";
                            iconPlay.style.display = "none";
                            iconPause.style.display = "block";
                        } else {
                            toolplay.style.display = "block";
                            iconPlay.style.display = "block";
                            iconPause.style.display = "none";
                        }
                    }

                    element.onmouseout = function (e) {
                        _this.currentIndex = Number(element.getAttribute('data-Index'))
                        let valueSingPlaying = element.querySelector('.name_sing').textContent;
                        if (_this.dataTrackPlaying?.title === valueSingPlaying && _this.isPlaying) {
                            // orderNumber.style.display = "none";
                            toolplay.style.display = "block";
                            iconPlay.style.display = "none";
                            iconPause.style.display = "block";
                        } else {
                            // orderNumber.style.display = "block";
                            toolplay.style.display = "none";
                            iconPlay.style.display = "none";
                            iconPause.style.display = "none";
                        }
                    }
                })

                // appear artist
                $('.title_appear-single').innerHTML = `<h2>Có sự xuất hiện của ${_this.dataValueSearch.artists[0].name}</h2>`
                const htmlsAppearSingleSearch = _this.appearSingle.slice(0, 6).map((item, index) => {
                    return `
                        <div class="card_box-sing playlist__search appear_single" data-Index=${index}>
                            <img class="img_singgle" src="${item.thumbnailM}"alt="">
                            <div class="descr">
                                <p class="title_singgle">${item.title}</p>
                                <p class="desc_Singgle">${item.artistsNames}</p>
                            </div>
                        </div>
                    `
                })
                appearSingleWrapSearch.innerHTML = htmlsAppearSingleSearch.join("");

                // click appear artist
                $$('.appear_single-wrap').forEach((element, index) => {
                    element.onclick = function (e) {
                        const tracksAppearSingle = e.target.closest('.appear_single');
                        let titlePlaylist = tracksAppearSingle.querySelector('.title_singgle').innerText;
                        let dataAppearSingle = _this.appearSingle;
                        _this.handleEventInforSearch({ dataAppearSingle, type: "appearSingle", titlePlaylist });

                    }
                })

                // hot appear for music
                const htmlsHotAppearForMusic = _this.albums[5].items.map((item, index) => {
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
                    element.onclick = function (e) {
                        const tracksHotAppear = e.target.closest('.hot_music-appear');
                        let titlePlaylist = tracksHotAppear.querySelector('.img_slide-banner').src;
                        let dataHotAppearForMusic = _this.albums[5].items
                        _this.handleEventInforSearch({ dataHotAppearForMusic, type: "hotMusicForSing", titlePlaylist });

                    }
                })

                // infor album when search all
                const htmlsAlbumSearch = _this.albums[1].items.slice(0, 6).map((item, index) => {
                    let yearAlbum = item.releaseDate.split("/");
                    return `
                        <div class="card_box-sing playlist__search" data-Index=${index}>
                            <img class="img_singgle" src="${item.thumbnailM}"alt="">
                            <div class="descr">
                                <p class="title_singgle">${item.title}</p>
                                <p class="desc_Singgle">${yearAlbum[2] + " • " + _this.dataValueSearch.artists[0].name}</p>
                            </div>
                        </div>
                    `
                })
                albumsInforSearch.forEach(element => { element.innerHTML = htmlsAlbumSearch.join("") });

                // infor playlist
                const htmlsArtistSearch = _this.dataValueSearch.playlists.slice(0, 6).map((item, index) => {
                    let yearAlbum = item.releaseDate.split("/");
                    return `
                        <div class="card_box-sing playlist__search" data-Index=${index}>
                            <img class="img_singgle" src="${item.thumbnailM}"alt="">
                            <div class="descr">
                                <p class="title_singgle">${item.title}</p>
                                <p class="desc_Singgle">${item.artistsNames}</p>
                            </div>
                        </div>
                    `
                })
                playlistWrapSearch.innerHTML = htmlsArtistSearch.join("");

                // when click playlist
                $$('.playlist_box-wrap').forEach((element, index) => {
                    element.onclick = function (e) {
                        const tracksPlaylist = e.target.closest('.card_box-sing');
                        let titlePlaylist = tracksPlaylist.querySelector('.title_singgle').innerText;
                        let dataPlaylist = _this.dataValueSearch.playlists
                        _this.handleEventInforSearch({ dataPlaylist, type: "tracksPlaylist", titlePlaylist });

                    }
                })
            }
        }
        // else {
        //     const htmlsAlbumSearch = _this.albums.slice(0, 5).map((album, index) => {
        //         let yearAlbum = album?.release_date?.split("-", 1);
        //         return `
        //     <div class="card_box-sing playlist__search" data-Index=${index}>
        //         <img class="img_singgle"
        //             src="${album.items[0].images[0].url}"
        //             alt="">
        //             <div class="descr">
        //             <p class="title_singgle">${album.name}</p>
        //             <p class="desc_Singgle">${yearAlbum + " • " + album.artists[0].name}</p>
        //             </div>
        //     </div>
        //         `
        //     })
        //     albumsInforSearch.forEach(element => { element.innerHTML = htmlsAlbumSearch.join("") })

        // }
    },
    handleRelateAlubms: function (prop) {
        if (prop === true) {
            this.handleSearch()
        }
    },
    handleEventAlbum: function () {
        let _this = this;
        // open tracks album
        albumsInforSearch.forEach(element => {
            element.onclick = function (e) {
                const tracksAlbum = e.target.closest('.playlist__search');
                let titlePlaylist = tracksAlbum.querySelector('.title_singgle').innerText;
                if (tracksAlbum) {
                    iconHeadLeft.style.color = "#fff";
                    _this.status = 1;

                    // icon left
                    iconHeadLeft.onclick = function () {
                        if (_this.status === 1) {
                            iconHeadLeft.style.color = "#fff";
                            contentSearch.style.display = "block";
                            allTracks.style.display = "none";
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
                            $('.content_search').style.display = "none";
                            allMainContent.style.width = "85%";
                            allMainContent.style.margin = "auto";

                        }
                    }
                    let dataAlbum = _this.albums[1].items;
                    let relateAlbum = true;
                    allTracks.style.display = "block";
                    contentSearch.style.display = "none";
                    $('.list__Playlist').style.display = "block";
                    $('.list_Tracks-single').style.display = "none";
                    $('.title_sing-wrap').style.display = 'none';
                    $('.title_sing-search').style.display = 'grid'
                    TracksAlbum.handleRenderTracks({ dataAlbum, type: "album-Single", titlePlaylist, relateAlbum })
                }
            }
        })

    },
    handleEventInforSearch: async function (props) {
        let _this = this;
        if (props.type === "inforSingle") {
            // infor single track
            if (props.tracksSingle) {
                iconHeadLeft.style.color = "#fff";
                _this.status = 1;
                // icon left
                iconHeadLeft.onclick = function () {
                    if (_this.status === 1) {
                        iconHeadLeft.style.color = "#fff";
                        contentSearch.style.display = "block";
                        allTracks.style.display = "none";
                        $('.list__Playlist').style.display = "block";
                        // close tab infor single
                        $('.container__infor_tracks-playing').style.display = "none";
                        allMainContent.style.width = "85%";
                        allMainContent.style.margin = "auto";
                        _this.status = 0;

                    } else {
                        iconHeadLeft.style.color = "#9c9c9c";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        // close tab infor single
                        $('.container__infor_tracks-playing').style.display = "none";
                        allMainContent.style.width = "85%";
                        allMainContent.style.margin = "auto";
                        // mainInforTracks.style.display = "none";
                    }
                }
                let type = "infor-Single";
                let dataInforSingle = _this.dataValueSearch.artists[0];
                let dataFanSoLike = _this.albums.filter((item) => item.sectionId === "aReArtist");
                let dataHotAppearMusic = _this.albums[5].items;
                let dataSong = props.dataSong
                contentSearch.style.display = "none";
                allTracks.style.display = "block";
                $('.list__Playlist').style.display = "none";
                $('.list_Tracks-single').style.display = "flex";
                $('.album_relate-active').style.display = "block";
                TopTracksSingle.handleTracks({ dataSong, type, dataInforSingle, dataFanSoLike, dataHotAppearMusic })
            }
        }
        else if (props.type === "appearSingle") {
            let idDetailPlaylist = _this.appearSingle.filter(item => item.title === props.titlePlaylist)
            await fetch(END_POINT + `/api/detailplaylist?id=${idDetailPlaylist[0].album.encodeId}`)
                .then(respone => respone.json())
                .then(data => {
                    _this.tracksAppearSingle = data.data.song.items;
                })
            iconHeadLeft.style.color = "#fff";
            _this.status = 1;
            // icon left
            iconHeadLeft.onclick = function () {
                if (_this.status === 1) {
                    iconHeadLeft.style.color = "#fff";
                    contentSearch.style.display = "block";
                    allTracks.style.display = "none";
                    // close tab infor single
                    $('.container__infor_tracks-playing').style.display = "none";
                    allMainContent.style.width = "85%";
                    allMainContent.style.margin = "auto";
                    _this.status = 0;
                } else {
                    iconHeadLeft.style.color = "#9c9c9c";
                    mainContent.style.display = "block";
                    $('.content_search').style.display = "none";
                    mainInforTracks.style.display = "none";
                    // close tab infor single
                    $('.container__infor_tracks-playing').style.display = "none";
                    allMainContent.style.width = "85%";
                    allMainContent.style.margin = "auto";
                }
            }
            let type = "appear-Single";
            let dataAppearSingle = _this.tracksAppearSingle;
            // let dataInforSingle = _this.dataValueSearch.artists[0];
            contentSearch.style.display = "none";
            allTracks.style.display = "block";
            $('.list__Playlist').style.display = "none";
            $('.list_Tracks-single').style.display = "flex";
            $('.album_relate-active').style.display = "block";
            $('.fan_like-tracks').style.display = "none";
            $('.album_relate-active').style.display = "none";
            TopTracksSingle.handleTracks({ dataAppearSingle, type })

        }
        else if (props.type === "hotMusicForSing") {
            let idDetailPlaylist = _this.albums[5].items.filter(item => item.thumbnailM === props.titlePlaylist)
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
                    // close tab infor single
                    $('.container__infor_tracks-playing').style.display = "none";
                    allMainContent.style.width = "85%";
                    allMainContent.style.margin = "auto";
                    _this.status = 0;
                } else {
                    iconHeadLeft.style.color = "#9c9c9c";
                    mainContent.style.display = "block";
                    $('.content_search').style.display = "none";
                    mainInforTracks.style.display = "none";
                    // close tab infor single
                    $('.container__infor_tracks-playing').style.display = "none";
                    allMainContent.style.width = "85%";
                    allMainContent.style.margin = "auto";
                }
            }
            let type = "hotAppear-Single";
            let dataHotAppearMusic = _this.tracksHotAppearMusic;
            // let dataInforSingle = _this.dataValueSearch.artists[0];
            contentSearch.style.display = "none";
            allTracks.style.display = "block";
            $('.list__Playlist').style.display = "none";
            $('.list_Tracks-single').style.display = "flex";
            $('.album_relate-active').style.display = "block";
            $('.fan_like-tracks').style.display = "none";
            $('.album_relate-active').style.display = "none";
            TopTracksSingle.handleTracks({ dataHotAppearMusic, type })

        }
        else if (props.type === "tracksPlaylist") {
            let idDetailPlaylist = _this.dataValueSearch.playlists.filter(item => item.title === props.titlePlaylist)
            await fetch(END_POINT + `/api/detailplaylist?id=${idDetailPlaylist[0].encodeId}`)
                .then(respone => respone.json())
                .then(data => {
                    _this.tracksPlaylist = data.data;
                })
            iconHeadLeft.style.color = "#fff";
            _this.status = 1;
            // icon left
            iconHeadLeft.onclick = function () {
                if (_this.status === 1) {
                    iconHeadLeft.style.color = "#fff";
                    contentSearch.style.display = "block";
                    allTracks.style.display = "none";
                    // close tab infor single
                    $('.container__infor_tracks-playing').style.display = "none";
                    allMainContent.style.width = "85%";
                    allMainContent.style.margin = "auto";
                    _this.status = 0;
                } else {
                    iconHeadLeft.style.color = "#9c9c9c";
                    mainContent.style.display = "block";
                    $('.content_search').style.display = "none";
                    mainInforTracks.style.display = "none";
                    // close tab infor single
                    $('.container__infor_tracks-playing').style.display = "none";
                    allMainContent.style.width = "85%";
                    allMainContent.style.margin = "auto";
                }
            }
            let type = "playlist-Single";
            let dataPlaylist = _this.tracksPlaylist;
            contentSearch.style.display = "none";
            allTracks.style.display = "block";
            $('.list__Playlist').style.display = "none";
            $('.list_Tracks-single').style.display = "flex";
            $('.album_relate-active').style.display = "block";
            $('.fan_like-tracks').style.display = "none";
            $('.album_relate-active').style.display = "none";
            TopTracksSingle.handleTracks({ dataPlaylist, type })

        }
    },
    start: async function (props) {
        this.handleSearch(props);
        this.handleEventAlbum();
    }
}

SearchMusic.start();

export default SearchMusic;