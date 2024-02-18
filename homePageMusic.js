// import { Buffer } from "buffer";
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
const accountMainPage = $('.account_');

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
    handleRenderMusic: async function () {
        // when scroll
        document.onscroll = function(e) {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
           if(scrollTop >0){
            console.log("hi")
           }
        }

        let _this = this;
        // data categories
        await fetch('http://localhost:3000/api/home?page=1')
            .then(response => response.json())
            .then(data => {
                _this.playlistMusicForU = data.data.items.filter((item) => item.sectionId == "hSlider");
                _this.playlistMusicNewlyLunched = data.data.items.filter((item) => item.sectionType == "new-release");
                _this.playlistMusicTab1 = data.data.items[3];
                _this.playlistMusicTab2 = data.data.items[4];
                _this.playlistMusicTab3 = data.data.items[5];
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
        // play tracks when click
        $$('.content_music-new').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.icon_play-tracks');
            let iconPause = element.querySelector('.icon_pause-tracks');
            let toolplay = element.querySelector('.play_track-play-main');
            element.onclick = function (e) {
                // click different song
                const songIndex = e.target.closest('.content_music-new:not(.active_playing-track)');
                if (songIndex) {
                    let orderNumber = element.querySelector('.order_number');
                    _this.currentIndex = Number(element.getAttribute('data-Index'));
                    _this.isPlaying = true;
                    element.classList.add('active_playing-track');
                    if (_this.currentIndex !== _this.oldIndex) {
                        console.log("co do day c")
                        $(`.content_music-new[data-Index="${_this.oldIndex}"]`).classList.remove('active_playing-track');
                        $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.icon_pause-tracks').style.display = "none";
                        $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.icon_play-tracks').style.display = "none";
                        $(`.content_music-new[data-Index="${_this.oldIndex}"]`).querySelector('.order_number').style.display = "block";
                        _this.oldIndex = Number(element.getAttribute('data-Index'));
                        // _this.clickSong = 0;

                    }
                    _this.dataTrackPlaying = _this.playlistMusicNewlyLunched[0].items.all[_this.currentIndex];
                    let dataTrack = _this.playlistMusicNewlyLunched[0].items.all[_this.currentIndex];
                    let dataAllTrack = _this.playlistMusicNewlyLunched[0].items.all;
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
                    // let iconTrackPause = $(`.content_music-new[data-Index="${_this.currentIndex}"]`).querySelector('.icon_pause-tracks');
                    // let iconTrackPlay = $(`.content_music-new[data-Index="${_this.currentIndex}"]`).querySelector('.icon_play-tracks');
                    TrackPlaylist.loadCurrentSong({ type: "newly-play", dataTrack});



                } else {
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

        // start render banner Music Mood
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

        // start render banner Music Chill
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
        
        //  start render banner Music Spring
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
            console.log(item)
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
        }

        // when click homeMain
        mainPage.onclick = function () {
            iconHeadLeft.style.color = "#9c9c9c";
            mainContent.style.display = "block";
            $('.content_search').style.display = "none";
            $('.content_search-mobile').style.display = "none";
            mainInforTracks.style.display = "none";
            console.log("hello search")
        }

        // when enter search
        searchInput.onkeypress = function (e) {
            if (e.key === "Enter") {
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

                // SearchMusic.start( ='all')
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
                    console.log("singgg")
                    SearchMusic.start({ valueInput, type })

                    // icon left
                    iconHeadLeft.onclick = function () {
                        iconHeadLeft.style.color = "#9c9c9c";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";

                    }
                }
            }
        }

    },
    handleEventTracks: function () {
        let _this = this;
        // click playlist to return tracks music for u
        musicFor.onclick = function (e) {
            console.log(111)
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
                allTracks.style.display = "block";
                albumRelateSearch.style.display = "none";
                mainInforTracks.style.display = "block";
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