import SearchMusic from "./searchMusic.js";
import TrackPlaylist from "./trackPlaylist.js";

const searchInput = $('.nav__search-input');
const musicFor = $('.list__musicForU');
const musicMewlyLunched = $('.list_musicNewly');
const musicTab1 = $('.list__musicTab1');
const musicTab2 = $('.list__musicTab2');
const musicTab3 = $('.list__musicTab3');
const musicTop = $('.list__musicTop');
const musicHot = $('.list__musicHot');
const musicTrack = $('.playlistTracks');
const mainContent = $('.desc__contentmain');
const allTracks = $('.active-show');
const iconHeadLeft = $('.left');
const mainPage = $('.icon__home-main');
const mainInforTracks = $('.all__tracks-main');
const albumSearch = $('.album_search');
const playlistSearch = $('.playlist_search');
const singSearch = $('.sing_search');
const allSearch = $('.all_search');
const tracksInforSearch = $('.content__infor-tracks');
const albumsInforSearch = $('.content__infor-albums');
const playlistInforSearch = $('.content__infor-playlist');
const albumRelateWrap = $('.album_relate-wrap');
const albumSearchWrap = $('.album_search-wrap')
const allInforSearch = $('.content__infor-all');
const albumRelateSearch = $('.relate_albums-search');
const btnPage = $('.btn_icon-mobile');
const homeMainPage = $('.home_');
const searchMainPage = $('.search_');
const libraMainPage = $('.libra_');
const allMainInforSingle = $('.container__infor_tracks-playing');
const accountMainPage = $('.account_');
const tracksBXHSingle = $('.content_sing-bxh');
const allMainContent = $('.container__maincontent');

const END_POINT = window.env.API_URL;

const HomePageMusic = {
    contentSearch: '',
    artistID: '',
    albums: [],
    playlistMusicForU: [],
    playlistMusicTab1: [],
    playlistMusicTab2: [],
    playlistMusicTab3: [],
    playlistMusicNewlyLunched: [],
    playlistMusicTop: [],
    playlistMusicHot: [],
    currentIndex: 0,
    type: '',
    typePlaylists: '',
    categoriesIDMusicForU: "",
    categoriesIDMood: "",
    categoriesIDHealth: "",
    categoriesIDAcoustic: "",
    categoriesParameters: {},
    idPlaylistForU: '',
    idPlaylistTab1: '',
    idPlaylistTab2: '',
    idPlaylistTab3: '',
    idPlaylistTop: '',
    idPlaylistHot: '',
    bannerForU: '',
    bannerTab1: '',
    bannerTab2: '',
    bannerTab3: '',
    bannerTop: '',
    bannerHot: '',
    isPlaying: false,
    dataTrackPlaying: {},
    oldIndex: 0,
    clickSong: 0,
    singBXH: [],
    fullLyric: {},
    showLyric: [],
    inforArtist: {},
    handleRenderMusic: async function () {
        let _this = this;
        // when scroll
        document.onscroll = function (e) {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (scrollTop > 0) {
            }
        }

        // when click categories bxh
        $('.cate_bxh-new').onclick = async function () {
            $('.content_bxh-new').style.display = "block";
            $('.content_search').style.display = "none";
            $('.desc__contentmain').style.display = "none";
            $('.all__tracks-main').style.display = "none";
            $('.list__Playlist').style.display = "block";
            iconHeadLeft.style.color = "#fff";

            // icon
            iconHeadLeft.onclick = function () {
                iconHeadLeft.style.color = "#9c9c9c";
                mainContent.style.display = "block";
                $('.content_bxh-new').style.display = "none";
                mainInforTracks.style.display = "none";
                $('.content').style.display = "block";
                 // close tab infor single
                 $('.container__infor_tracks-playing').style.display = "none";
                 allMainContent.style.width = "85%";
                 allMainContent.style.margin = "auto";
                 $('.content__lyric').style.display = "none";
            }

            mainPage.onclick = function () {
                iconHeadLeft.style.color = "#9c9c9c";
                mainContent.style.display = "block";
                $('.content_bxh-new').style.display = "none";
                mainInforTracks.style.display = "none";
                $('.content').style.display = "block";
                // close tab infor single
                $('.container__infor_tracks-playing').style.display = "none";
                allMainContent.style.width = "85%";
                allMainContent.style.margin = "auto";

            }
            await fetch(END_POINT + `/api/newreleasechart`)
                .then(respone => respone.json())
                .then(data => {
                    _this.singBXH = data.data.items;
                    _this.bannerBXH = data.data.banner;
                })

            // render banner bxh
            $('.banner__bxh').innerHTML = `<img class="img__banner_" src="${_this.bannerBXH}" alt="">`

            const htmlsTracks = _this.singBXH.map((item, index) => {
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
            tracksBXHSingle.innerHTML = htmlsTracks.join("");

            // when click tracks
            $$('.content_tracks-single').forEach((element, index) => {
                let orderNumber = element.querySelector('.order_number');
                let iconPlay = element.querySelector('.icon_play-tracks');
                let iconPause = element.querySelector('.icon_pause-tracks');
                let toolplay = element.querySelector('.play_track-play-main');
                element.onclick = async function (e) {

                    // click different song
                    const songIndex = e.target.closest('.content_tracks-single:not(.active_playing-track)');
                    if (songIndex || e.target.closest('.name_sing')) {
                        // GET infor artist
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.dataTrackPlaying = _this.singBXH[_this.currentIndex];
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
                                $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                                $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                                $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                                $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                                $(`.content_tracks-single[data-Index="${_this.oldIndex}"]`).querySelector('.name_sing').style.color = "#fff";
                                _this.oldIndex = Number(element.getAttribute('data-Index'));
                            }
                            _this.dataTrackPlaying = _this.singBXH[_this.currentIndex];
                            let dataTrack = _this.singBXH[_this.currentIndex];
                            let dataAllTrack = _this.singBXH;
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
                            _this.dataTrackPlaying = _this.singBXH[_this.currentIndex];
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
                        let dataTrack = _this.singBXH[_this.currentIndex];
                        let dataAllTrack = _this.singBXH;
                        if (_this.isPlaying) {
                            _this.isPlaying = false;
                            orderNumber.style.display = "none";
                            toolplay.style.display = "block";
                            iconPlay.style.display = "block";
                            iconPause.style.display = "none";
                            element.classList.remove('active_playing-track');
                            TrackPlaylist.loadCurrentSong({ type: "newly-play", dataTrack, status: "pause" });
                        }
                    }
                }
            })

            // hover tracks when play
            $$('.content_tracks-single').forEach((element, index) => {
                let orderNumber = element.querySelector('.order_number');
                let iconPlay = element.querySelector('.icon_play-tracks');
                let iconPause = element.querySelector('.icon_pause-tracks');
                let toolplay = element.querySelector('.play_track-play-main');
                let valueSingPlaying = element.querySelector('.name_sing').textContent;

                element.onmouseover = function (e) {
                    _this.currentIndex = Number(element.getAttribute('data-Index'))
                    if (_this.dataTrackPlaying.title === valueSingPlaying && _this.isPlaying) {
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
                    if (_this.dataTrackPlaying.title === valueSingPlaying && _this.isPlaying) {
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

        }

        // data categories
        await fetch(END_POINT + `/api/home?page=1`)
            .then(response => response.json())
            .then(data => {
                _this.playlistMusicForU = data.data.items.filter((item) => item.sectionId == "hSlider");
                _this.playlistMusicNewlyLunched = data.data.items.filter((item) => item.sectionType == "new-release");
                _this.playlistMusicTab1 = data.data.items[3 + 1];
                _this.playlistMusicTab2 = data.data.items[4 + 1];
                _this.playlistMusicTab3 = data.data.items[5 + 1];
                _this.playlistMusicTop = data.data.items.filter((item) => item.sectionId == "h100");
                _this.playlistMusicHot = data.data.items.filter((item) => item.sectionId == "hAlbum");

            })
            .catch(error => console.error("e", error));

        // render banner music for You
        const listMusicForYou = _this.playlistMusicForU[0].items.map((item, index) => {
            _this.idPlaylistForU = item.encodeId;
            _this.bannerForU = item.banner;
            return ` 
                    <div class="card_box-sing playlist__render slide_banner" data-Index=${index}>
                        <img class="img_singgle img_slide-banner"src="${item.banner}" alt="">
                    </div>
                </div>
                    `
        })
        musicFor.innerHTML = listMusicForYou.join("");

        // start render playlist newly lunched 
        const list__musicNewlyLunched = _this.playlistMusicNewlyLunched[0].items.all.map((item, index) => {
            return `
            <div class="content_music-new" data-Index=${index}>
                <div class="descr_sing-single-search">
                    <div class="list__title_sing">
                        <div class="order_number">${index + 1}</div>
                        <div class="play_track-play-main">
                        <i class="fa-solid fa-play icon_play-tracks"></i>
                        <i class="fas fa-pause icon_pause-tracks"></i>
                        </div>
                        <div class="img_title_sing">
                            <img src="${item.thumbnailM}" alt="">
                        </div>
                        <div class="list__sing-singgle">
                            <p class="name_sing">${item.title}</p>
                            <p class="name_single">${item.artistsNames}</p>
                        </div>
                    </div>
                </div>
                <div class="list_clock lock_musicNew">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        })
        musicMewlyLunched.innerHTML = list__musicNewlyLunched.join("");

        // when click type nation
        $('.all_music-new').onclick = function () {
            $('.VN_music').classList.remove('active-option');
            $('.all_music-new').classList.add('active-option');
            $('.QT_music').classList.remove('active-option');
            const list__musicNewlyLunched = _this.playlistMusicNewlyLunched[0].items.all.map((item, index) => {
                return `
                <div class="content_music-new" data-Index=${index}>
                    <div class="descr_sing-single-search">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                            <div class="play_track-play-main">
                            <i class="fa-solid fa-play icon_play-tracks"></i>
                            <i class="fas fa-pause icon_pause-tracks"></i>
                            </div>
                            <div class="img_title_sing">
                                <img src="${item.thumbnailM}" alt="">
                            </div>
                            <div class="list__sing-singgle">
                                <p class="name_sing">${item.title}</p>
                                <p class="name_single">${item.artistsNames}</p>
                            </div>
                        </div>
                    </div>
                    <div class="list_clock lock_musicNew">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
                `
            })
            musicMewlyLunched.innerHTML = list__musicNewlyLunched.join("");

            // click
            $$('.content_music-new').forEach((element, index) => {
                let orderNumber = element.querySelector('.order_number');
                let iconPlay = element.querySelector('.icon_play-tracks');
                let iconPause = element.querySelector('.icon_pause-tracks');
                let toolplay = element.querySelector('.play_track-play-main');
                element.onclick = async function (e) {

                    // click different song
                    const songIndex = e.target.closest('.content_music-new:not(.active_playing-track)');
                    if (songIndex || e.target.closest('.name_single')) {
                        // GET infor artist
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.dataTrackPlaying = _this.playlistMusicNewlyLunched[0].items.all[_this.currentIndex];
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
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.name_sing').style.color = "#fff";

                                _this.oldIndex = Number(element.getAttribute('data-Index'));
                                // _this.clickSong = 0;

                            }
                            _this.dataTrackPlaying = _this.playlistMusicNewlyLunched[0].items.all[_this.currentIndex];
                            let dataTrack = _this.playlistMusicNewlyLunched[0].items.all[_this.currentIndex];
                            // show descr song
                            $('.name__music').style.display = "block";
                            $('.img__played').style.display = "block";

                            // show icon
                            orderNumber.style.display = "none";
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
                            TrackPlaylist.loadCurrentSong({ type: "newly-play", dataTrack, lyric, showLyric });

                        }
                    }
                    else {
                        // click to pause
                        let dataTrack = _this.playlistMusicNewlyLunched[0].items.all[_this.currentIndex];
                        let dataAllTrack = _this.playlistMusicNewlyLunched[0].items.all;
                        if (_this.isPlaying) {
                            _this.isPlaying = false;
                            orderNumber.style.display = "none";
                            toolplay.style.display = "block";
                            iconPlay.style.display = "block";
                            iconPause.style.display = "none";
                            element.classList.remove('active_playing-track');
                            TrackPlaylist.loadCurrentSong({ type: "newly-play", dataTrack, status: "pause" });
                        }
                    }

                }

            })
        }

        $('.VN_music').onclick = function () {
            $('.VN_music').classList.add('active-option');
            $('.all_music-new').classList.remove('active-option');
            $('.QT_music').classList.remove('active-option');
            const list__musicNewlyLunched = _this.playlistMusicNewlyLunched[0].items.vPop.map((item, index) => {
                return `
                <div class="content_music-new" data-Index=${index}>
                    <div class="descr_sing-single-search">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                            <div class="play_track-play-main">
                            <i class="fa-solid fa-play icon_play-tracks"></i>
                            <i class="fas fa-pause icon_pause-tracks"></i>
                            </div>
                            <div class="img_title_sing">
                                <img src="${item.thumbnailM}" alt="">
                            </div>
                            <div class="list__sing-singgle">
                                <p class="name_sing">${item.title}</p>
                                <p class="name_single">${item.artistsNames}</p>
                            </div>
                        </div>
                    </div>
                    <div class="list_clock lock_musicNew">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
                `
            })
            musicMewlyLunched.innerHTML = list__musicNewlyLunched.join("");

            // click
            $$('.content_music-new').forEach((element, index) => {
                let orderNumber = element.querySelector('.order_number');
                let iconPlay = element.querySelector('.icon_play-tracks');
                let iconPause = element.querySelector('.icon_pause-tracks');
                let toolplay = element.querySelector('.play_track-play-main');
                element.onclick = async function (e) {

                    // click different song
                    const songIndex = e.target.closest('.content_music-new:not(.active_playing-track)');
                    if (songIndex || e.target.closest('.name_single')) {
                        // GET infor artist
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.dataTrackPlaying = _this.playlistMusicNewlyLunched[0].items.vPop[_this.currentIndex];
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
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.name_sing').style.color = "#fff";

                                _this.oldIndex = Number(element.getAttribute('data-Index'));
                                // _this.clickSong = 0;

                            }
                            _this.dataTrackPlaying = _this.playlistMusicNewlyLunched[0].items.vPop[_this.currentIndex];
                            let dataTrack = _this.playlistMusicNewlyLunched[0].items.vPop[_this.currentIndex];
                            // show descr song
                            $('.name__music').style.display = "block";
                            $('.img__played').style.display = "block";

                            // show icon
                            orderNumber.style.display = "none";
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
                            TrackPlaylist.loadCurrentSong({ type: "newly-play", dataTrack, lyric, showLyric });

                        }
                    }
                    else {
                        // click to pause
                        let dataTrack = _this.playlistMusicNewlyLunched[0].items.vPop[_this.currentIndex];
                        let dataAllTrack = _this.playlistMusicNewlyLunched[0].items.vPop;
                        if (_this.isPlaying) {
                            _this.isPlaying = false;
                            orderNumber.style.display = "none";
                            toolplay.style.display = "block";
                            iconPlay.style.display = "block";
                            iconPause.style.display = "none";
                            element.classList.remove('active_playing-track');
                            TrackPlaylist.loadCurrentSong({ type: "newly-play", dataTrack, status: "pause" });
                        }
                    }
                }
            })
        }

        $('.QT_music').onclick = function () {
            $('.QT_music').classList.add('active-option');
            $('.all_music-new').classList.remove('active-option');
            $('.VN_music').classList.remove('active-option');
            const list__musicNewlyLunched = _this.playlistMusicNewlyLunched[0].items.others.map((item, index) => {
                return `
                <div class="content_music-new" data-Index=${index}>
                    <div class="descr_sing-single-search">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                            <div class="play_track-play-main">
                            <i class="fa-solid fa-play icon_play-tracks"></i>
                            <i class="fas fa-pause icon_pause-tracks"></i>
                            </div>
                            <div class="img_title_sing">
                                <img src="${item.thumbnailM}" alt="">
                            </div>
                            <div class="list__sing-singgle">
                                <p class="name_sing">${item.title}</p>
                                <p class="name_single">${item.artistsNames}</p>
                            </div>
                        </div>
                    </div>
                    <div class="list_clock lock_musicNew">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
                `
            })
            musicMewlyLunched.innerHTML = list__musicNewlyLunched.join("");

            // click
            $$('.content_music-new').forEach((element, index) => {
                let orderNumber = element.querySelector('.order_number');
                let iconPlay = element.querySelector('.icon_play-tracks');
                let iconPause = element.querySelector('.icon_pause-tracks');
                let toolplay = element.querySelector('.play_track-play-main');
                element.onclick = async function (e) {

                    // click different song
                    const songIndex = e.target.closest('.content_music-new:not(.active_playing-track)');
                    if (songIndex || e.target.closest('.name_single')) {
                        // GET infor artist
                        _this.currentIndex = Number(element.getAttribute('data-Index'));
                        _this.dataTrackPlaying = _this.playlistMusicNewlyLunched[0].items.others[_this.currentIndex];
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
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                                $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.name_sing').style.color = "#fff";

                                _this.oldIndex = Number(element.getAttribute('data-Index'));
                                // _this.clickSong = 0;

                            }
                            _this.dataTrackPlaying = _this.playlistMusicNewlyLunched[0].items.others[_this.currentIndex];
                            let dataTrack = _this.playlistMusicNewlyLunched[0].items.others[_this.currentIndex];
                            // show descr song
                            $('.name__music').style.display = "block";
                            $('.img__played').style.display = "block";

                            // show icon
                            orderNumber.style.display = "none";
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
                            TrackPlaylist.loadCurrentSong({ type: "newly-play", dataTrack, lyric, showLyric });

                        }
                    }
                    else {
                        // click to pause
                        let dataTrack = _this.playlistMusicNewlyLunched[0].items.others[_this.currentIndex];
                        let dataAllTrack = _this.playlistMusicNewlyLunched[0].items.others;
                        if (_this.isPlaying) {
                            _this.isPlaying = false;
                            orderNumber.style.display = "none";
                            toolplay.style.display = "block";
                            iconPlay.style.display = "block";
                            iconPause.style.display = "none";
                            element.classList.remove('active_playing-track');
                            TrackPlaylist.loadCurrentSong({ type: "newly-play", dataTrack, status: "pause" });
                        }
                    }
                }
            })
        }

        // play tracks when click
        $$('.content_music-new').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            element.onclick = async function (e) {

                // click different song
                const songIndex = e.target.closest('.content_music-new:not(.active_playing-track)');
                if (songIndex || e.target.closest('.name_single')) {
                    // GET infor artist
                    _this.currentIndex = Number(element.getAttribute('data-Index'));
                    _this.dataTrackPlaying = _this.playlistMusicNewlyLunched[0].items.all[_this.currentIndex];
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
                            $(`.content_music-new[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                            $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                            $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                            $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                            $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.name_sing').style.color = "#fff";

                            _this.oldIndex = Number(element.getAttribute('data-Index'));
                            // _this.clickSong = 0;

                        }
                        _this.dataTrackPlaying = _this.playlistMusicNewlyLunched[0].items.all[_this.currentIndex];
                        let dataTrack = _this.playlistMusicNewlyLunched[0].items.all[_this.currentIndex];
                        // show descr song
                        $('.name__music').style.display = "block";
                        $('.img__played').style.display = "block";

                        // show icon
                        orderNumber.style.display = "none";
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
                        TrackPlaylist.loadCurrentSong({ type: "newly-play", dataTrack, lyric, showLyric });

                    }
                }
                else {
                    // click to pause
                    let dataTrack = _this.playlistMusicNewlyLunched[0].items.all[_this.currentIndex];
                    let dataAllTrack = _this.playlistMusicNewlyLunched[0].items.all;
                    if (_this.isPlaying) {
                        _this.isPlaying = false;
                        orderNumber.style.display = "none";
                        toolplay.style.display = "block";
                        iconPlay.style.display = "block";
                        iconPause.style.display = "none";
                        element.classList.remove('active_playing-track');
                        TrackPlaylist.loadCurrentSong({ type: "newly-play", dataTrack, status: "pause" });
                    }
                }

            }

        })
        // hover tracks when play
        $$('.content_music-new').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            let valueSingPlaying = element.querySelector('.name_sing').textContent;

            element.onmouseover = function (e) {
                _this.currentIndex = Number(element.getAttribute('data-Index'))
                if (_this.dataTrackPlaying.title === valueSingPlaying && _this.isPlaying) {
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
                if (_this.dataTrackPlaying.title === valueSingPlaying && _this.isPlaying) {
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
        // end render playlist newly lunched

        // start render banner Music Tab1
        const list__musicTab1 = _this.playlistMusicTab1.items.slice(0, 6).map((item, index) => {
            _this.idPlaylistTab1 = item.encodeId;
            _this.bannerTab1 = item.thumbnailM;

            return `
                    <div class="card_box-sing playlist__render" data-Index=${index}>
                    <img class="img_singgle"
                    src="${item.thumbnailM}"
                    alt="">
                    <p class="title_singgle">${item.title}</p>
                    </div>
                </div>
                    `
        })
        musicTab1.innerHTML = list__musicTab1.join("");
        $('.head__title-tab1').innerHTML = `<h2 class="title-tab">${_this.playlistMusicTab1.title}</h2>`;

        // start render banner Music Tab2
        const list__musicTab2 = _this.playlistMusicTab2.items.slice(0, 6).map((item, index) => {
            _this.idPlaylistTab2 = item.encodeId;
            _this.bannerTab2 = item.thumbnailM;

            return `
                <div class="card_box-sing playlist__render" data-Index=${index}>
                <img class="img_singgle"
                src="${item.thumbnailM}"
                alt="">
                <p class="title_singgle">${item.title}</p>
                </div>
                `
        })
        musicTab2.innerHTML = list__musicTab2.join("");
        $('.head__title-tab2').innerHTML = `<h2 class="title-tab">${_this.playlistMusicTab2.title}</h2>`;

        //  start render banner Music Tab3
        const list__musicTab3 = _this.playlistMusicTab3.items.slice(0, 6).map((item, index) => {
            _this.idPlaylistTab3 = item.encodeId;
            _this.bannerTab3 = item.thumbnailM;

            return `
                <div class="card_box-sing playlist__render" data-Index=${index}>
                <img class="img_singgle"
                src="${item.thumbnailM}"
                alt="">
                <p class="title_singgle">${item.title}</p>
                </div>
                `
        })
        musicTab3.innerHTML = list__musicTab3.join("");
        $('.head__title-tab3').innerHTML = `<h2 class="title-tab">${_this.playlistMusicTab3.title}</h2>`;

        // start render banner Music Top 100
        const list__musicTop = _this.playlistMusicTop[0].items.slice(0, 6).map((item, index) => {
            _this.idPlaylistTop = item.encodeId;
            _this.bannerTop = item.thumbnailM;

            return `
                <div class="card_box-sing playlist__render" data-Index=${index}>
                <img class="img_singgle"
                src="${item.thumbnailM}"
                alt="">
                <p class="title_singgle">${item.title}</p>
                </div>
                `
        })
        musicTop.innerHTML = list__musicTop.join("");
        $('.head__title-tab4').innerHTML = `<h2 class="title-tab">${_this.playlistMusicTop[0].title}</h2>`;

        // start render banner Music Hot
        const list__musicHot = _this.playlistMusicHot[0].items.slice(0, 6).map((item, index) => {
            _this.idPlaylistHot = item.encodeId;
            _this.bannerHot = item.thumbnailM;

            return `
                <div class="card_box-sing playlist__render" data-Index=${index}>
                <img class="img_singgle"
                src="${item.thumbnailM}"
                alt="">
                <p class="title_singgle">${item.title}</p>
                </div>
                `
        })
        musicHot.innerHTML = list__musicHot.join("");
        $('.head__title-tab5').innerHTML = `<h2 class="title-tab">${_this.playlistMusicHot[0].title}</h2>`;
    },

    handleEventSearch: function () {
        let _this = this;
        // return mainContentSearch when search
        iconHeadLeft.onclick = function () {
            iconHeadLeft.style.color = "#9c9c9c";
            mainContent.style.display = "block";
            $('.content_search').style.display = "none";
            mainInforTracks.style.display = "none";
            // close tab infor single
            $('.container__infor_tracks-playing').style.display = "none";
            allMainContent.style.width = "85%";
            allMainContent.style.margin = "auto";
        }

        // when click homeMain
        mainPage.onclick = function () {
            iconHeadLeft.style.color = "#9c9c9c";
            mainContent.style.display = "block";
            $('.content_search').style.display = "none";
            $('.content_search-mobile').style.display = "none";
            mainInforTracks.style.display = "none";
            // close tab infor single
            $('.container__infor_tracks-playing').style.display = "none";
            allMainContent.style.width = "85%";
            allMainContent.style.margin = "auto";
        }

        // when input
        searchInput.oninput = function (e) {
            $('.icon__closeSearch').style.display = "block";
            $('.icon__closeSearch').onclick = function () {
                e.target.value = '';
            }
        }


        // when enter search
        searchInput.onkeypress = function (e) {
            if (e.key === "Enter") {
                $('.icon__closeSearch').onclick = function () {
                    e.target.value = '';
                }
                // icon left
                iconHeadLeft.onclick = function () {
                    iconHeadLeft.style.color = "#9c9c9c";
                    mainContent.style.display = "block";
                    $('.content_search').style.display = "none";
                    mainInforTracks.style.display = "none";
                }

                iconHeadLeft.style.color = "#fff";
                $('.head__search-title').style.display = "none";
                $('.categories_search').style.display = "flex";
                $('.content_bxh-new').style.display = "none";
                $('.content').style.display = "block";


                // render allSearch when enter search
                playlistSearch.classList.remove("active");
                albumSearch.classList.remove("active");
                singSearch.classList.remove("active");
                allSearch.classList.add("active");
                tracksInforSearch.style.display = "none";
                albumSearchWrap.style.display = "none";
                allInforSearch.style.display = "block";

                // tablet
                mainContent.style.display = "none";
                $('.content_search').style.display = "block";
                let valueInput = e.target.value;
                let type = 'all';
                SearchMusic.start({ valueInput, type })

                // when click allsearch
                allSearch.onclick = function () {
                    _this.type = "all";
                    playlistSearch.classList.remove("active");
                    albumSearch.classList.remove("active");
                    singSearch.classList.remove("active");
                    allSearch.classList.add("active");
                    tracksInforSearch.style.display = "none";
                    playlistInforSearch.style.display = "none";
                    albumSearchWrap.style.display = "none";
                    albumRelateWrap.style.display = "grid";
                    allInforSearch.style.display = "block";
                    let valueInput = e.target.value;
                    let type = 'all';
                    SearchMusic.start({ valueInput, type })

                    // icon left
                    iconHeadLeft.onclick = function () {
                        iconHeadLeft.style.color = "#9c9c9c";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";
                    }
                }

                // when click albumSearch
                albumSearch.onclick = function () {
                    _this.type = 'album';
                    albumSearch.classList.add("active");
                    singSearch.classList.remove("active");
                    playlistSearch.classList.remove("active");
                    tracksInforSearch.style.display = "none";
                    playlistInforSearch.style.display = "none";
                    albumSearchWrap.style.display = "grid";
                    allSearch.classList.remove("active");
                    allInforSearch.style.display = "none";
                    let valueInput = e.target.value;
                    let type = 'album';
                    SearchMusic.start({ valueInput, type })

                    // icon left
                    iconHeadLeft.onclick = function () {
                        iconHeadLeft.style.color = "#9c9c9c";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";
                    }
                }

                // when click playlistSearch
                playlistSearch.onclick = function () {
                    albumSearch.classList.remove("active");
                    singSearch.classList.remove("active");
                    allSearch.classList.remove("active");
                    playlistSearch.classList.add("active");
                    tracksInforSearch.style.display = "none";
                    albumsInforSearch.style.display = "none";
                    albumSearchWrap.style.display = "none";
                    albumRelateWrap.style.display = "none";
                    allInforSearch.style.display = "none";
                    playlistInforSearch.style.display = "grid";
                    let valueInput = e.target.value;
                    let type = 'playlist';
                    SearchMusic.start({ valueInput, type })

                    // icon left
                    iconHeadLeft.onclick = function () {
                        iconHeadLeft.style.color = "#9c9c9c";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";

                    }
                }

                // when click SingSearch
                singSearch.onclick = function () {
                    playlistSearch.classList.remove("active");
                    albumSearch.classList.remove("active");
                    singSearch.classList.add("active");
                    tracksInforSearch.style.display = "block";
                    allSearch.classList.remove("active");
                    albumsInforSearch.style.display = "none";
                    albumSearchWrap.style.display = "none";
                    playlistInforSearch.style.display = "none";
                    allInforSearch.style.display = "none";
                    let valueInput = e.target.value;
                    let type = 'sing';
                    SearchMusic.start({ valueInput, type })

                    // icon left
                    iconHeadLeft.onclick = function () {
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
            }
        }

    },
    handleEventTracks: function () {
        let _this = this;
        // click playlist to return tracks music for u
        musicFor.onclick = function (e) {
            const playlistIndex = e.target.closest('.playlist__render');
            if (playlistIndex) {
                mainInforTracks.style.display = "none";
                iconHeadLeft.style.color = "#fff";

                _this.currentIndex = Number(playlistIndex.getAttribute('data-Index'));
                let titlePlaylist = playlistIndex.querySelector('.img_slide-banner').src;
                let bannerForU = _this.bannerForU;
                let playlistMusicForU = _this.playlistMusicForU;
                TrackPlaylist.handleRenderTracksForU({ bannerForU, playlistMusicForU, titlePlaylist });
                mainContent.style.display = "none";
                albumRelateSearch.style.display = "none";
                $('.content').style.display = "none";
                $('.list_Tracks-single').style.display = "none";
                $('.list_Tracks-single').style.display = "none";

                // mobile
                $('.icon_action-mobile').style.display = "none";
                if (e.view.innerWidth <= 739) {
                    $('.icon_action-mobile').style.display = "flex";
                    $('.icon_action').style.display = "none";
                    $('.title_sing-wrap ').style.display = "none";
                    $('.left_icon-mobile').onclick = function () {
                        iconHeadLeft.style.color = "#9c9c9c";
                        $('.nav__search').style.display = "none";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";
                    }
                }
            }
        };

        // click playlist to return tracks music tab1
        musicTab1.onclick = function (e) {
            const playlistIndex = e.target.closest('.playlist__render');
            if (playlistIndex) {
                mainInforTracks.style.display = "none";
                iconHeadLeft.style.color = "#fff";
                let titlePlaylist = playlistIndex.querySelector('.title_singgle').innerText;
                _this.currentIndex = Number(playlistIndex.getAttribute('data-Index'));
                let bannerTab1 = _this.bannerTab1;
                let playlistMusicTab1 = _this.playlistMusicTab1;
                TrackPlaylist.handleRenderTracksTab1({ bannerTab1, playlistMusicTab1, titlePlaylist });

                mainContent.style.display = "none";
                allTracks.style.display = "block";
                albumRelateSearch.style.display = "none";
                mainInforTracks.style.display = "block";
                $('.list_Tracks-single').style.display = "none";

                // mobile
                $('.icon_action-mobile').style.display = "none";
                if (e.view.innerWidth <= 739) {
                    $('.icon_action-mobile').style.display = "flex";
                    $('.icon_action').style.display = "none";
                    $('.title_sing-wrap ').style.display = "none";
                    $('.left_icon-mobile').onclick = function () {
                        iconHeadLeft.style.color = "#9c9c9c";
                        $('.nav__search').style.display = "none";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";
                    }
                }
            }
        };

        // click playlist to return tracks music tab2
        musicTab2.onclick = function (e) {
            const playlistIndex = e.target.closest('.playlist__render');
            if (playlistIndex) {
                mainInforTracks.style.display = "none";
                iconHeadLeft.style.color = "#fff";
                let titlePlaylist = playlistIndex.querySelector('.title_singgle').innerText;
                _this.currentIndex = Number(playlistIndex.getAttribute('data-Index'));
                let playlistMusicTab2 = _this.playlistMusicTab2;
                let bannerTab2 = _this.bannerTab2;
                TrackPlaylist.handleRenderTracksTab2({ bannerTab2, playlistMusicTab2, titlePlaylist });
                mainContent.style.display = "none";
                allTracks.style.display = "block";
                albumRelateSearch.style.display = "none";
                mainInforTracks.style.display = "block";
                $('.list_Tracks-single').style.display = "none";

                // mobile
                $('.icon_action-mobile').style.display = "none";
                if (e.view.innerWidth <= 739) {
                    $('.icon_action-mobile').style.display = "flex";
                    $('.icon_action').style.display = "none";
                    $('.title_sing-wrap ').style.display = "none";
                    $('.left_icon-mobile').onclick = function () {
                        iconHeadLeft.style.color = "#9c9c9c";
                        $('.nav__search').style.display = "none";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";
                    }
                }
            }
        };

        // click playlist to return tracks music tab3
        musicTab3.onclick = function (e) {
            const playlistIndex = e.target.closest('.playlist__render');
            if (playlistIndex) {
                mainInforTracks.style.display = "none";
                iconHeadLeft.style.color = "#fff";
                let titlePlaylist = playlistIndex.querySelector('.title_singgle').innerText;
                _this.currentIndex = Number(playlistIndex.getAttribute('data-Index'));
                let playlistMusicTab3 = _this.playlistMusicTab3;
                let bannerTab3 = _this.bannerTab3;
                TrackPlaylist.handleRenderTracksTab3({ bannerTab3, playlistMusicTab3, titlePlaylist });
                mainContent.style.display = "none";
                allTracks.style.display = "block";
                albumRelateSearch.style.display = "none";
                mainInforTracks.style.display = "block";
                $('.list_Tracks-single').style.display = "none";

                // mobile
                $('.icon_action-mobile').style.display = "none";
                if (e.view.innerWidth <= 739) {
                    $('.icon_action-mobile').style.display = "flex";
                    $('.icon_action').style.display = "none";
                    $('.title_sing-wrap ').style.display = "none";
                    $('.left_icon-mobile').onclick = function () {
                        iconHeadLeft.style.color = "#9c9c9c";
                        $('.nav__search').style.display = "none";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";
                    }
                }
            }
        };

        // click playlist to return tracks music Top
        musicTop.onclick = function (e) {
            const playlistIndex = e.target.closest('.playlist__render');
            if (playlistIndex) {
                mainInforTracks.style.display = "none";
                iconHeadLeft.style.color = "#fff";
                let titlePlaylist = playlistIndex.querySelector('.title_singgle').innerText;
                _this.currentIndex = Number(playlistIndex.getAttribute('data-Index'));
                let playlistMusicTop = _this.playlistMusicTop;
                let bannerTop = _this.bannerTop;
                TrackPlaylist.handleRenderTracksTop({ bannerTop, playlistMusicTop, titlePlaylist });
                mainContent.style.display = "none";
                allTracks.style.display = "block";
                albumRelateSearch.style.display = "none";
                mainInforTracks.style.display = "block";
                $('.list_Tracks-single').style.display = "none";

                // mobile
                $('.icon_action-mobile').style.display = "none";
                if (e.view.innerWidth <= 739) {
                    $('.icon_action-mobile').style.display = "flex";
                    $('.icon_action').style.display = "none";
                    $('.title_sing-wrap ').style.display = "none";
                    $('.left_icon-mobile').onclick = function () {
                        iconHeadLeft.style.color = "#9c9c9c";
                        $('.nav__search').style.display = "none";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";
                    }
                }
            }
        };

        // click playlist to return tracks music hot
        musicHot.onclick = function (e) {
            const playlistIndex = e.target.closest('.playlist__render');
            if (playlistIndex) {
                mainInforTracks.style.display = "none";
                iconHeadLeft.style.color = "#fff";
                let titlePlaylist = playlistIndex.querySelector('.title_singgle').innerText;
                _this.currentIndex = Number(playlistIndex.getAttribute('data-Index'));
                let playlistMusicHot = _this.playlistMusicHot;
                let bannerHot = _this.bannerHot;
                TrackPlaylist.handleRenderTracksHot({ bannerHot, playlistMusicHot, titlePlaylist });
                mainContent.style.display = "none";
                allTracks.style.display = "block";
                albumRelateSearch.style.display = "none";
                mainInforTracks.style.display = "block";
                $('.list_Tracks-single').style.display = "none";

                // mobile
                $('.icon_action-mobile').style.display = "none";
                if (e.view.innerWidth <= 739) {
                    $('.icon_action-mobile').style.display = "flex";
                    $('.icon_action').style.display = "none";
                    $('.title_sing-wrap ').style.display = "none";
                    $('.left_icon-mobile').onclick = function () {
                        iconHeadLeft.style.color = "#9c9c9c";
                        $('.nav__search').style.display = "none";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";
                    }
                }
            }
        };

    },
    handleEventPage: function () {
        let _this = this;
        homeMainPage.onclick = function () {
            homeMainPage.style.color = "#fff";
            searchMainPage.style.color = "#9c9c9c";
            libraMainPage.style.color = "#9c9c9c";
            accountMainPage.style.color = "#9c9c9c";
        };

        searchMainPage.onclick = function (e) {
            // if (e.view.innerWidth <= 739) {
            homeMainPage.style.color = "#9c9c9c";
            searchMainPage.style.color = "#fff";
            libraMainPage.style.color = "#9c9c9c";
            accountMainPage.style.color = "#9c9c9c";
            mainContent.style.display = "none";
            mainInforTracks.style.display = "none";
            $('.content_search-mobile').style.display = "flex";
            tracksInforSearch.style.display = "none";
            _this.handleEventSearch();
        };

        libraMainPage.onclick = function () {
            homeMainPage.style.color = "#9c9c9c";
            searchMainPage.style.color = "#9c9c9c";
            libraMainPage.style.color = "#fff";
            accountMainPage.style.color = "#9c9c9c";
        };

        accountMainPage.onclick = function () {
            homeMainPage.style.color = "#9c9c9c";
            searchMainPage.style.color = "#9c9c9c";
            libraMainPage.style.color = "#9c9c9c";
            accountMainPage.style.color = "#fff";
        }
    },
    start: function () {
        this.handleEventSearch();
        this.handleRenderMusic();
        this.handleEventTracks();
        this.handleEventPage();
    }
}
HomePageMusic.start();