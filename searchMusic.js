
import TracksAlbum from "./tracksAlbum.js";
import TopTracksSingle from "./topTracksSingle.js";

const albumsInforSearch = $$('.content__infor-albums');
const tracksInforSearch = $('.tracks-search');
const allInforSearch = $('.content__infor-all');
const singleWrapSearch = $('.single_wrap-search');
const singWrapSearch = $('.sing_wrap-search');
const artistRelateWrap = $('.artist_box-wrap');
const playlistWrapSearch = $('.playlist_box-wrap');
const appearSingleWrapSearch = $('.appear_single-wrap');
const albumsWrap = $('.album_box-wrap');
const mainInforTracks = $('.children__content-playlist');
const mainContent = $('.desc__contentmain');
const allTracks = $('.active-show');
const contentSearch = $('.content_search');
const albumRelateSearch = $('.relate_albums-search');
const iconHeadLeft = $('.left');

const END_POINT = "http://localhost:3000/api/";


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
    handleSearch: async function (props) {
        let _this = this;
        if (props) {
            await fetch(END_POINT + `search?keyword=${props.valueInput}`)
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
            } else if (_this.type === "playlist") {

            } else if (_this.type === "sing") {
                await fetch('https://api.spotify.com/v1/artists/' + _this.artistID + '/top-tracks' + '?market=VN&limit=50', _this.artistParameters)
                    .then(response => response.json())
                    .then(data => {
                        return _this.tracksInfor = data.tracks;

                    })
                    .catch(error => console.error('Error:', error))
                const htmlsTracks = _this.tracksInfor.map((item, index) => {
                    return `
                                <div class="content__sing-wrap-search">
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
                                        <div class="time-clock">2 phút</div>
                                    </div>
                                </div>
                `
                })
                tracksInforSearch.innerHTML = htmlsTracks.join("");
            } else {
                // data Single for album and artist when search
                await fetch(END_POINT + `/artist?name=${_this.dataValueSearch.artists[0].name}`)
                    .then(response => response.json())
                    .then(data => {
                        _this.albums = data.data.sections;

                    })
                    .catch(error => console.error('Error:', error))

                    // data Single for appear single when search
                    await fetch(END_POINT+`/artistsong?id=${_this.dataValueSearch.artists[0].id}&page=1&count=10`)
                    .then(response => response.json())
                    .then(data => {
                        _this.appearSingle = data.data.items;
                    })

                // inforSingle when search
                const htmlsInforSinglelSearch =
                    `
                    <div div div div div class="single-wrap">
                        <div class="img_single-search">
                            <img src="${_this.dataValueSearch.artists[0].thumbnailM}" alt="">
                        </div>
                        <p class="single-search">${_this.dataValueSearch.artists[0].name}</p>
                        <p class="artist-search">Nghệ sĩ</p>
                    </div>
                `
                singleWrapSearch.innerHTML = htmlsInforSinglelSearch;

                // when click infor single
                _this.handleEventTopTracks();

                // top tracks when search single
                const htmlsTracksInforAllSearch = _this.dataValueSearch.songs.slice(4, 8).map((item) => {
                    return `
                        <div class="sing_wrap">
                            <div class="list__title_sing">
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
                                <div class="time-clock">2 phút</div>
                                <i class="fa-solid fa-ellipsis"></i>
                            </div>
                        </div>
                `
                })
                singWrapSearch.innerHTML = htmlsTracksInforAllSearch.join('');

                // appear artist
                const htmlsAppearSingleSearch = _this.appearSingle.slice(0, 6).map((item, index) => {
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
                appearSingleWrapSearch.innerHTML = htmlsAppearSingleSearch.join("");

                // infor artist 
                const artistSearch = this.albums.filter((item) => item.sectionId === "aReArtist");
                const htmlArtistRelate = artistSearch[0].items.map((item, index) => {
                    return `
                        <div class="card_box-sing playlist__search">
                            <img class="img_singgle" src="${item.thumbnailM}" alt="">
                            <p class="title_singgle">${item.name}</p>
                        </div>
                     `
                })
                const htmlArtistSearch = 
                `
                <div class="card_box-sing playlist__search">
                    <img class="img_singgle" src="${_this.dataValueSearch.artists[0].thumbnailM}" alt="">
                    <p class="title_singgle">${_this.dataValueSearch.artists[0].name}</p>
                </div>
                `
                artistRelateWrap.innerHTML = htmlArtistSearch + htmlArtistRelate.join("");

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
            }
        }
        else {
            const htmlsAlbumSearch = _this.albums.slice(0, 5).map((album, index) => {
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

        }
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
                const albumIndex = e.target.closest('.playlist__search');
                if (albumIndex) {
                    $('.search').style.color = "#fff";
                    iconHeadLeft.style.color = "#fff";
                    // icon left
                    iconHeadLeft.onclick = function () {
                        $('.search').style.color = "#fff";
                        iconHeadLeft.style.color = "#fff";
                        contentSearch.style.display = "block";
                        allTracks.style.display = "none";
                    }
                    let indexAlbum = _this.currentIndex = Number(albumIndex.getAttribute('data-Index'));
                    let dataAlbum = _this.albums;
                    let artistParameters = _this.artistParameters;
                    let relateAlbum = true;
                    allTracks.style.display = "block";
                    contentSearch.style.display = "none";
                    $('.list__Playlist').style.display = "block";
                    $('.list_Tracks-single').style.display = "none";
                    $('.title_sing-wrap').style.display = 'none';
                    $('.title_sing-search').style.display = 'grid'
                    TracksAlbum.handleRenderTracks({ indexAlbum, dataAlbum, artistParameters, relateAlbum })
                }
            }
        })

    },
    handleEventTopTracks: function () {
        let _this = this;
        // infor single track
        singleWrapSearch.onclick = function (e) {
            const tracksSingle = e.target.closest('.single-wrap');
            if (tracksSingle) {
                $('.search').style.color = "#fff";
                iconHeadLeft.style.color = "#fff";
                // icon left
                iconHeadLeft.onclick = function () {
                    $('.search').style.color = "#fff";
                    iconHeadLeft.style.color = "#fff";
                    contentSearch.style.display = "block";
                    allTracks.style.display = "none";
                }
                let artistID = _this.artistID;
                let artistParameters = _this.artistParameters;
                let type = "infor-Single";
                contentSearch.style.display = "none";
                allTracks.style.display = "block";
                $('.nav__search').style.display = "none";
                $('.list__Playlist').style.display = "none";
                $('.list_Tracks-single').style.display = "flex";
                $('.album_relate-active').style.display = "block";
                TopTracksSingle.handleTracks({ artistID, artistParameters, type })
            }

        }

        // infor artist track
        artistRelateWrap.onclick = function (e) {
            const tracksSingle = e.target.closest('.card_box-sing');
            if (tracksSingle) {
                $('.search').style.color = "#fff";
                iconHeadLeft.style.color = "#fff";
                // icon left
                iconHeadLeft.onclick = function () {
                    $('.search').style.color = "#fff";
                    iconHeadLeft.style.color = "#fff";
                    contentSearch.style.display = "block";
                    allTracks.style.display = "none";
                }
                let artistID = _this.artistID;
                contentSearch.style.display = "none";
                allTracks.style.display = "block";
                $('.nav__search').style.display = "none";
                $('.list__Playlist').style.display = "none";
                $('.list_Tracks-single').style.display = "flex";
                $('.album_relate-active').style.display = "none";
                let type = "infor-RelateSingle";
                let artistParameters = _this.artistParameters;
                let artistRelate = _this.artistRelate;
                // let itemSingle = _this.itemSingle;
                let tilteArtistRelate = tracksSingle.querySelector('.title_singgle').innerText;
                if (_this.itemSingle.artists[0].name === tilteArtistRelate) {
                    TopTracksSingle.handleTracks({ artistID, artistParameters, type: "infor-Single" })
                } else {
                    TopTracksSingle.handleTracks({ tilteArtistRelate, artistParameters, type, artistRelate });
                }

            }
        }

    },
    start: async function (props) {
        this.handleSearch(props);
        this.handleEventAlbum();
    }

}

SearchMusic.start();

export default SearchMusic;