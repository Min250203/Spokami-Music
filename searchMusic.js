
import TracksAlbum from "./tracksAlbum.js";
import TopTracksSingle from "./topTracksSingle.js";

const albumsInforSearch = $$('.content__infor-albums');
const tracksInforSearch = $('.tracks-search');
const allInforSearch = $('.content__infor-all');
const singleWrapSearch = $('.single_wrap-search');
const singWrapSearch = $('.sing_wrap-search');
const artistRelateWrap = $('.artist_box-wrap');
const albumsWrap = $('.album_box-wrap');
const mainInforTracks = $('.children__content-playlist');
const mainContent = $('.desc__contentmain');
const allTracks = $('.active-show');
const contentSearch = $('.content_search');
const albumRelateSearch = $('.relate_albums-search');
const iconHeadLeft = $('.left');

// const albumRealate = $('.list_albums-relate');

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
    handleSearch: async function (props) {
        let _this = this;
        if (props) {
            let valueInput = props.valueInput
            let accessToken = props.accessToken
            this.type = props.type
            //    get Artist ID
            _this.artistParameters = {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            };

            await fetch('https://api.spotify.com/v1/search?q=' + valueInput + '&type=artist', _this.artistParameters)
                .then(response => response.json())
                .then(data => {
                    _this.artistID = data.artists.items[0].id;
                    return _this.artistID;
                })
                .catch(error => console.error('Error:', error));

            // get with Artist IA all albums from that artist
            if (_this.type === "album") {
                await fetch('https://api.spotify.com/v1/artists/' + _this.artistID + '/albums' + '?market=VN&limit=50', _this.artistParameters)
                    .then(response => response.json())
                    .then(data => {
                        _this.albums = data.items;
                    })
                    .catch(error => console.error('Error:', error))
                const htmlsAlbumSearch = _this.albums.map((album, index) => {
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
                        console.log(data)
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
                // infor of sing and single
                await fetch('https://api.spotify.com/v1/artists/' + _this.artistID + '/top-tracks' + '?market=VN&limit=1', _this.artistParameters)
                    .then(response => response.json())
                    .then(data => {
                        return _this.tracksInforAllSearch = data.tracks;
                    })
                    .catch(error => console.error(error))

                // inforSingle when search
                _this.itemSingle = _this.tracksInforAllSearch[0];
                const htmlsInforSinglelSearch =
                    `
                <div class="single-wrap">
                    <div class="img_single-search">
                        <img src="${_this.itemSingle.album.images[0].url}"
                        alt="">
                    </div>
                    <p class="single-search">${_this.itemSingle.artists[0].name}</p>
                    <p class="artist-search">Nghệ sĩ</p>
                 </div>
                `
                singleWrapSearch.innerHTML = htmlsInforSinglelSearch;
                // when click infor single
                _this.handleEventTopTracks();

                // top tracks when search single
                const htmlsTracksInforAllSearch = _this.tracksInforAllSearch.slice(5, 9).map((item) => {
                    return `
                <div class="sing_wrap">
                    <div class="list__title_sing">
                        <div class="img_title_sing">
                            <img src="${item.album.images[0].url}" alt="">
                        </div>
                        <div class="list__sing-search">
                            <p class="name_sing">${item.name}</p>
                            <p class="name_single">${item.artists[0].name}</p>
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

                // infor artist relate
                await fetch('https://api.spotify.com/v1/artists/' + _this.artistID + '/related-artists' + '?market=VN', _this.artistParameters)
                    .then(response => response.json())
                    .then(data => {
                        return _this.artistRelate = data.artists
                    })
                    .catch(error => console.error("error", error))

                const htmlArtistRelate = _this.artistRelate.slice(10, 14).map((item, index) => {
                    return `
                <div class="card_box-sing playlist__search">
                    <img class="img_singgle" src="${item.images[0].url}" alt="">
                     <p class="title_singgle">${item.name}</p>
                </div>
                `
                })

                const htmlArtistSearch = `
            <div class="card_box-sing playlist__search">
            <img class="img_singgle" src="${_this.itemSingle.album.images[0].url}" alt="">
                <p class="title_singgle">${_this.itemSingle.artists[0].name}</p>
              </div>
            `
                artistRelateWrap.innerHTML = htmlArtistSearch + htmlArtistRelate.join("");

                // infor album when search all
                await fetch('https://api.spotify.com/v1/artists/' + _this.artistID + '/albums' + '?market=VN&limit=5', _this.artistParameters)
                    .then(response => response.json())
                    .then(data => {
                        return _this.albums = data.items;
                    })
                    .catch(error => console.error('Error:', error))
                console.log(_this.albums)
                const htmlsAlbumSearch = _this.albums.map((album, index) => {
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
            console.log("đây là lần tết")
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
                console.log(_this.itemSingle.artists[0].name === tilteArtistRelate)
                if (_this.itemSingle.artists[0].name === tilteArtistRelate) {
                    console.log(124)
                    TopTracksSingle.handleTracks({ artistID, artistParameters, type: "infor-Single" })
                } else {
                    console.log(235)
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