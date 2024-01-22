// import { Buffer } from "buffer";
import SearchMusic from "./searchMusic.js";
import TrackPlaylist from "./trackPlaylist.js";

const searchInput = $('.nav__search-input');
const CLIENT_ID = "5445f83018404e0994fbce9fcfab2bf9";
const CLIENT_SECRET = "1451411bff95447e93212555e8752662";
const musicFor = $('.list__musicForU');
const musicMood = $('.list__musicMood');
const musicChill = $('.list__musicChill');
const musicSping = $('.list__musicSpring');
const musicMewlyLunched = $('.list_musicNewly');
const musicTop = $('.list__musicTop');
const musicHot = $('.list__musicHot');
const musicTrack = $('.playlistTracks');
const mainContent = $('.desc__contentmain');
const allTracks = $('.active-show');
const iconHeadLeft = $('.left');
const mainPage = $('.home');
// const mainInforList = $('.children__content');
const mainInforTracks = $('.all__tracks-main');
const albumSearch = $('.album_search');
const playlistSearch = $('.playlist_search');
const singSearch = $('.sing_search');
const allSearch = $('.all_search');
const tracksInforSearch = $('.content__infor-tracks');
const albumsInforSearch = $('.content__infor-albums');
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
    accessToken: "",
    artistID: '',
    albums: [],
    playlistMusicForU: [],
    playlistMusicMood: [],
    playlistMusicChill: [],
    playlistMusicSping: [],
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
    idPlaylistMood: '',
    idPlaylistChill: '',
    idPlaylistSpring: '',
    idPlaylistTop: '',
    idPlaylistHot: '',
    bannerForU: '',
    bannerMood: '',
    bannerChill: '',
    bannerSpring: '',
    bannerTop: '',
    bannerHot: '',

    handleRenderMusic: async function () {
        let _this = this;
        // data categories
        await fetch('http://localhost:3000/api/home?page=1')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                _this.playlistMusicForU = data.data.items.filter((item) => item.sectionId == "hSlider");
                _this.playlistMusicNewlyLunched = data.data.items.filter((item) => item.sectionType == "new-release");
                _this.playlistMusicMood = data.data.items.filter((item) => item.sectionId == "hEditorTheme4");
                _this.playlistMusicChill = data.data.items.filter((item) => item.sectionId == "hEditorTheme");
                _this.playlistMusicSping = data.data.items.filter((item) => item.sectionId == "hSeasonTheme");
                _this.playlistMusicTop = data.data.items.filter((item) => item.sectionId == "h100");
                _this.playlistMusicHot = data.data.items.filter((item) => item.sectionId == "hAlbum");
                console.log(_this.playlistMusicNewlyLunched)

            })
            .catch(error => console.error("e", error));

        // render banner music for You
        const listMusicForYou = _this.playlistMusicForU[0].items.map((item, index) => {
            _this.idPlaylistForU = item.encodeId;
            _this.bannerForU = item.banner;
            console.log("item.encodeId", item.encodeId)
            return ` 
                    <div class="card_box-sing playlist__render slide_banner" data-Index=${index}>
                    <img class="img_singgle img_slide-banner"
                    src="${item.banner}"
                    alt="">
                    </div>
                </div>
                    `
        })
        musicFor.innerHTML = listMusicForYou.join("");

        // render playlist newly lunched
        const list__musicNewlyLunched = _this.playlistMusicNewlyLunched[0].items.all.map((item, index) => {

            return `
            <div class="content_music-new">
                <div class="descr_sing-single-search">
                    <div class="list__title_sing">
                        <div class="order_number">${index + 1}</div>
                        <div class="img_title_sing">
                            <img src="${item.thumbnail}" alt="">
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

        // render banner Music Mood
        const listMusicMood = _this.playlistMusicMood[0].items.map((item, index) => {
            _this.idPlaylistMood = item.encodeId;
            _this.bannerMood = item.thumbnail;

            return `
                    <div class="card_box-sing playlist__render" data-Index=${index}>
                    <img class="img_singgle"
                    src="${item.thumbnail}"
                    alt="">
                    <p class="title_singgle">${item.title}</p>
                    </div>
                </div>
                    `
        })
        musicMood.innerHTML = listMusicMood.join("");

        // render banner Music Chill
        const listmusicChill = _this.playlistMusicChill[0].items.map((item, index) => {
            _this.idPlaylistChill = item.encodeId;
            _this.bannerChill = item.thumbnail;

            return `
                <div class="card_box-sing playlist__render" data-Index=${index}>
                <img class="img_singgle"
                src="${item.thumbnail}"
                alt="">
                <p class="title_singgle">${item.title}</p>
                </div>
                `
        })
        musicChill.innerHTML = listmusicChill.join("");

        // render banner Music Spring
        const list__musicSpring = _this.playlistMusicSping[0].items.map((item, index) => {
            _this.idPlaylistSpring = item.encodeId;
            _this.bannerSpring = item.thumbnail;

            return `
                <div class="card_box-sing playlist__render" data-Index=${index}>
                <img class="img_singgle"
                src="${item.thumbnail}"
                alt="">
                <p class="title_singgle">${item.title}</p>
                </div>
                `
        })
        musicSping.innerHTML = list__musicSpring.join("");

        // render banner Music Top 100
        const list__musicTop = _this.playlistMusicTop[0].items.map((item, index) => {
            _this.idPlaylistTop = item.encodeId;
            _this.bannerTop = item.thumbnail;

            return `
                <div class="card_box-sing playlist__render" data-Index=${index}>
                <img class="img_singgle"
                src="${item.thumbnail}"
                alt="">
                <p class="title_singgle">${item.title}</p>
                </div>
                `
        })
        musicTop.innerHTML = list__musicTop.join("");

        // render banner Music Hot
        const list__musicHot = _this.playlistMusicHot[0].items.map((item, index) => {
            _this.idPlaylistHot = item.encodeId;
            _this.bannerHot = item.thumbnail;

            return `
                <div class="card_box-sing playlist__render" data-Index=${index}>
                <img class="img_singgle"
                src="${item.thumbnail}"
                alt="">
                <p class="title_singgle">${item.title}</p>
                </div>
                `
        })
        musicHot.innerHTML = list__musicHot.join("");

    },

    handleEventSearch: function () {
        let _this = this;
        // translateSearch
        document.querySelector('.search').onclick = function () {
            mainInforTracks.style.display = "none";
            $('.search').style.color = "#fff";
            iconHeadLeft.style.color = "#fff";
            mainPage.style.color = "#9c9c9c";
            // $('.nav__search').style.display = "flex";
            mainContent.style.display = "none";
            $('.content_search').style.display = "block";
            $('.content_search-mobile').style.display = "none";
            tracksInforSearch.style.display = "none";
        }
        // return mainContent when search
        iconHeadLeft.onclick = function () {
            $('.search').style.color = "#b3b3b3";
            $('.home').style.color = "#fff";
            iconHeadLeft.style.color = "#9c9c9c";
            $('.nav__search').style.display = "none";
            mainContent.style.display = "block";
            $('.content_search').style.display = "none";
            mainInforTracks.style.display = "none";

        }

        // when click homeMain
        mainPage.onclick = function () {
            $('.search').style.color = "#b3b3b3";
            $('.home').style.color = "#fff";
            iconHeadLeft.style.color = "#9c9c9c";
            $('.nav__search').style.display = "none";
            mainContent.style.display = "block";
            // $('.head_search').style.display = "none";
            $('.content_search').style.display = "none";
            $('.content_search-mobile').style.display = "none";

            // mainInforList.style.display = "block";
            mainInforTracks.style.display = "none";
        }

        // when enter search
        searchInput.onkeypress = function (e) {
            if (e.key === "Enter") {
                // icon left
                iconHeadLeft.onclick = function () {
                    $('.search').style.color = "#b3b3b3";
                    $('.home').style.color = "#fff";
                    iconHeadLeft.style.color = "#9c9c9c";
                    $('.nav__search').style.display = "none";
                    mainContent.style.display = "block";
                    $('.content_search').style.display = "none";
                    mainInforTracks.style.display = "none";

                }

                iconHeadLeft.style.color = "#fff";
                $('.head__search-title').style.display = "none";
                $('.categories_search').style.display = "flex";
                // render all when enter search
                playlistSearch.classList.remove("active");
                albumSearch.classList.remove("active");
                singSearch.classList.remove("active");
                allSearch.classList.add("active");
                tracksInforSearch.style.display = "none";
                // albumsInforSearch.style.display = "none";
                // albumsInforSearch.style.display = "none";
                // albumRelateWrap.style.display = "grid";
                albumSearchWrap.style.display = "none";
                allInforSearch.style.display = "block";
                // tablet
                mainContent.style.display = "none";
                $('.content_search').style.display = "block";

                let valueInput = e.target.value;
                let accessToken = _this.accessToken;
                let type = 'all';
                SearchMusic.start({ valueInput, accessToken, type })

                // when click allsearch
                allSearch.onclick = function () {
                    _this.type = "all";
                    playlistSearch.classList.remove("active");
                    albumSearch.classList.remove("active");
                    singSearch.classList.remove("active");
                    allSearch.classList.add("active");
                    tracksInforSearch.style.display = "none";
                    albumSearchWrap.style.display = "none";
                    albumRelateWrap.style.display = "grid";

                    // albumsInforSearch.style.display = "none";
                    allInforSearch.style.display = "block";
                    let valueInput = e.target.value;
                    let accessToken = _this.accessToken;
                    let type = 'all';
                    SearchMusic.start({ valueInput, accessToken, type })

                    // icon left
                    iconHeadLeft.onclick = function () {
                        $('.search').style.color = "#b3b3b3";
                        $('.home').style.color = "#fff";
                        iconHeadLeft.style.color = "#9c9c9c";
                        $('.nav__search').style.display = "none";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";

                    }

                }
                // SearchMusic.start( ='all')
                albumSearch.onclick = function () {
                    _this.type = 'album';
                    albumSearch.classList.add("active");
                    singSearch.classList.remove("active");
                    playlistSearch.classList.remove("active");
                    tracksInforSearch.style.display = "none";
                    // albumsInforSearch.style.display = "grid";
                    albumSearchWrap.style.display = "grid";
                    allSearch.classList.remove("active");
                    allInforSearch.style.display = "none";
                    let valueInput = e.target.value;
                    let accessToken = _this.accessToken;
                    let type = 'album';
                    SearchMusic.start({ valueInput, accessToken, type })

                    // icon left
                    iconHeadLeft.onclick = function () {
                        $('.search').style.color = "#b3b3b3";
                        $('.home').style.color = "#fff";
                        iconHeadLeft.style.color = "#9c9c9c";
                        $('.nav__search').style.display = "none";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";

                    }
                }
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
                    let valueInput = e.target.value;
                    let accessToken = _this.accessToken;
                    let type = 'playlist';
                    SearchMusic.start({ valueInput, accessToken, type })

                    // icon left
                    iconHeadLeft.onclick = function () {
                        $('.search').style.color = "#b3b3b3";
                        $('.home').style.color = "#fff";
                        iconHeadLeft.style.color = "#9c9c9c";
                        $('.nav__search').style.display = "none";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";

                    }
                }
                singSearch.onclick = function () {
                    playlistSearch.classList.remove("active");
                    albumSearch.classList.remove("active");
                    singSearch.classList.add("active");
                    tracksInforSearch.style.display = "block";
                    allSearch.classList.remove("active");
                    albumsInforSearch.style.display = "none";
                    albumSearchWrap.style.display = "none";
                    // albumRelateWrap.style.display = "none";
                    allInforSearch.style.display = "none";
                    let valueInput = e.target.value;
                    let accessToken = _this.accessToken;
                    let type = 'sing';
                    SearchMusic.start({ valueInput, accessToken, type })

                    // icon left
                    iconHeadLeft.onclick = function () {
                        $('.search').style.color = "#b3b3b3";
                        $('.home').style.color = "#fff";
                        iconHeadLeft.style.color = "#9c9c9c";
                        $('.nav__search').style.display = "none";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";

                    }
                }
            }
        }

        // when field text
        searchInput.oninput = function (e) {
            // icon left
            iconHeadLeft.onclick = function (valueWidth) {
                $('.search').style.color = "#b3b3b3";
                $('.home').style.color = "#fff";
                iconHeadLeft.style.color = "#9c9c9c";
                $('.nav__search').style.display = "none";
                mainContent.style.display = "block";
                $('.content_search').style.display = "none";
                mainInforTracks.style.display = "none";
                if (valueWidth.view.innerWidth >= 740 && valueWidth.view.innerWidth <= 1023) {
                    $('.nav__search').style.display = "flex";
                    e.target.value = '';
                }
            }
            iconHeadLeft.style.color = "#fff";
            $('.head__search-title').style.display = "none";
            $('.categories_search').style.display = "flex";
            // render all when enter search
            playlistSearch.classList.remove("active");
            albumSearch.classList.remove("active");
            singSearch.classList.remove("active");
            allSearch.classList.add("active");
            tracksInforSearch.style.display = "none";
            albumSearchWrap.style.display = "none";
            allInforSearch.style.display = "block";
            mainContent.style.display = "none";
            $('.content_search').style.display = "block";

            let valueInput = e.target.value;
            let accessToken = _this.accessToken;
            let type = 'all';
            SearchMusic.start({ valueInput, accessToken, type })

            // when click allsearch
            allSearch.onclick = function () {
                _this.type = "all";
                playlistSearch.classList.remove("active");
                albumSearch.classList.remove("active");
                singSearch.classList.remove("active");
                allSearch.classList.add("active");
                tracksInforSearch.style.display = "none";
                albumSearchWrap.style.display = "none";
                albumRelateWrap.style.display = "grid";

                // albumsInforSearch.style.display = "none";
                allInforSearch.style.display = "block";
                let valueInput = e.target.value;
                let accessToken = _this.accessToken;
                let type = 'all';
                SearchMusic.start({ valueInput, accessToken, type })

                // icon left
                iconHeadLeft.onclick = function () {
                    $('.search').style.color = "#b3b3b3";
                    $('.home').style.color = "#fff";
                    iconHeadLeft.style.color = "#9c9c9c";
                    $('.nav__search').style.display = "none";
                    mainContent.style.display = "block";
                    $('.content_search').style.display = "none";
                    mainInforTracks.style.display = "none";

                }

            }
            // SearchMusic.start( ='all')
            albumSearch.onclick = function () {
                _this.type = 'album';
                albumSearch.classList.add("active");
                singSearch.classList.remove("active");
                playlistSearch.classList.remove("active");
                tracksInforSearch.style.display = "none";
                // albumsInforSearch.style.display = "grid";
                albumSearchWrap.style.display = "grid";
                allSearch.classList.remove("active");
                allInforSearch.style.display = "none";
                let valueInput = e.target.value;
                let accessToken = _this.accessToken;
                let type = 'album';
                SearchMusic.start({ valueInput, accessToken, type })

                // icon left
                iconHeadLeft.onclick = function () {
                    $('.search').style.color = "#b3b3b3";
                    $('.home').style.color = "#fff";
                    iconHeadLeft.style.color = "#9c9c9c";
                    $('.nav__search').style.display = "none";
                    mainContent.style.display = "block";
                    $('.content_search').style.display = "none";
                    mainInforTracks.style.display = "none";

                }
            }
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
                let valueInput = e.target.value;
                let accessToken = _this.accessToken;
                let type = 'playlist';
                SearchMusic.start({ valueInput, accessToken, type })

                // icon left
                iconHeadLeft.onclick = function () {
                    $('.search').style.color = "#b3b3b3";
                    $('.home').style.color = "#fff";
                    iconHeadLeft.style.color = "#9c9c9c";
                    $('.nav__search').style.display = "none";
                    mainContent.style.display = "block";
                    $('.content_search').style.display = "none";
                    mainInforTracks.style.display = "none";

                }
            }
            singSearch.onclick = function () {
                playlistSearch.classList.remove("active");
                albumSearch.classList.remove("active");
                singSearch.classList.add("active");
                tracksInforSearch.style.display = "block";
                allSearch.classList.remove("active");
                albumsInforSearch.style.display = "none";
                albumSearchWrap.style.display = "none";
                // albumRelateWrap.style.display = "none";
                allInforSearch.style.display = "none";
                let valueInput = e.target.value;
                let accessToken = _this.accessToken;
                let type = 'sing';
                SearchMusic.start({ valueInput, accessToken, type })

                // icon left
                iconHeadLeft.onclick = function () {
                    $('.search').style.color = "#b3b3b3";
                    $('.home').style.color = "#fff";
                    iconHeadLeft.style.color = "#9c9c9c";
                    $('.nav__search').style.display = "none";
                    mainContent.style.display = "block";
                    $('.content_search').style.display = "none";
                    mainInforTracks.style.display = "none";

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
                console.log("đây là lần thứ 1")
                mainInforTracks.style.display = "none";
                iconHeadLeft.style.color = "#fff";
                _this.currentIndex = Number(playlistIndex.getAttribute('data-Index'));
                let categoriesParameters = _this.categoriesParameters;
                let idPlaylistForU = _this.idPlaylistForU;
                let bannerForU = _this.bannerForU;
                TrackPlaylist.handleRenderTracksForU({bannerForU, idPlaylistForU});
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
                        $('.search').style.color = "#b3b3b3";
                        $('.home').style.color = "#fff";
                        iconHeadLeft.style.color = "#9c9c9c";
                        $('.nav__search').style.display = "none";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";
                    }
                }
            }
        };

        // click playlist to return tracks music mood
        musicMood.onclick = function (e) {
            const playlistIndex = e.target.closest('.playlist__render');
            if (playlistIndex) {
                mainInforTracks.style.display = "none";
                iconHeadLeft.style.color = "#fff";
                let titlePlaylist = playlistIndex.querySelector('.title_singgle').innerText;
                _this.currentIndex = Number(playlistIndex.getAttribute('data-Index'));
                let playlistMusicMood = _this.playlistMusicMood;
                let categoriesIDMood = _this.categoriesIDMood;
                let categoriesParameters = _this.categoriesParameters;
                TrackPlaylist.handleRenderTracksMood({ playlistMusicMood, categoriesIDMood, categoriesParameters, titlePlaylist });
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
                        $('.search').style.color = "#b3b3b3";
                        $('.home').style.color = "#fff";
                        iconHeadLeft.style.color = "#9c9c9c";
                        $('.nav__search').style.display = "none";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";
                    }
                }
            }
        };

        // click playlist to return tracks music health
        musicChill.onclick = function (e) {
            const playlistIndex = e.target.closest('.playlist__render');
            if (playlistIndex) {
                mainInforTracks.style.display = "none";
                iconHeadLeft.style.color = "#fff";
                let titlePlaylist = playlistIndex.querySelector('.title_singgle').innerText;
                _this.currentIndex = Number(playlistIndex.getAttribute('data-Index'));
                let playlistMusicChill = _this.playlistMusicChill;
                let categoriesIDHealth = _this.categoriesIDHealth;
                let categoriesParameters = _this.categoriesParameters;
                TrackPlaylist.handleRenderTracksHealth({ playlistMusicChill, categoriesIDHealth, categoriesParameters, titlePlaylist });
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
                        $('.search').style.color = "#b3b3b3";
                        $('.home').style.color = "#fff";
                        iconHeadLeft.style.color = "#9c9c9c";
                        $('.nav__search').style.display = "none";
                        mainContent.style.display = "block";
                        $('.content_search').style.display = "none";
                        mainInforTracks.style.display = "none";
                    }
                }
            }
        };

        // click playlist to return tracks music accoustic
        musicSping.onclick = function (e) {
            const playlistIndex = e.target.closest('.playlist__render');
            if (playlistIndex) {
                mainInforTracks.style.display = "none";
                iconHeadLeft.style.color = "#fff";
                let titlePlaylist = playlistIndex.querySelector('.title_singgle').innerText;
                _this.currentIndex = Number(playlistIndex.getAttribute('data-Index'));
                let playlistMusicSping = _this.playlistMusicSping;
                let categoriesIDAcoustic = _this.categoriesIDAcoustic;
                let categoriesParameters = _this.categoriesParameters;
                TrackPlaylist.handleRenderTracksAccoustic({ playlistMusicSping, categoriesIDAcoustic, categoriesParameters, titlePlaylist });
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
                        $('.search').style.color = "#b3b3b3";
                        $('.home').style.color = "#fff";
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
            // }
            // document.querySelector('.search').onclick = function () {
            //     mainInforTracks.style.display = "none";
            //     $('.search').style.color = "#fff";
            //     iconHeadLeft.style.color = "#fff";
            //     mainPage.style.color = "#9c9c9c";
            //     $('.nav__search').style.display = "flex";
            //     mainContent.style.display = "none";
            //     $('.content_search').style.display = "block";
            //     tracksInforSearch.style.display = "none";
            // }
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
        this.getRefreshToken();
    }
}
HomePageMusic.start();
// sfhsgdfhgsdjhfgsdjhf