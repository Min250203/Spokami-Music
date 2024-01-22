import SearchMusic from "./searchMusic.js";

const headerInfor = $('.playlist_header-infor');
const allTracksPlaylist = $('.all_tracks');
const albumsRelate = $('.list_albums-relate');
const albumsInforSearch = $$('.content__infor-albums');
const contentSearch = $('.content_search');
const allTracks = $('.active-show');
const albumRelateSearch = $('.relate_albums-search');

const titleRelate = $('.head__title-relate');

const TracksAlbum = {
    tracksAlbum: [],
    type: '',
    handleRenderTracks: async function (props) {
        let _this = this;
        console.log(props)
        let indexAlbum = props.indexAlbum;
        let dataAlbum = props.dataAlbum;
        let artistParameters = props.artistParameters;
        const tracksAlbumdata = dataAlbum[indexAlbum];
        const htmlsTracksAlbum = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${tracksAlbumdata.images[0].url}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${tracksAlbumdata.type}</p>
                    <h1 class="playlist__title-header">${tracksAlbumdata.name}</h1>
                </div
                `
        headerInfor.innerHTML = htmlsTracksAlbum;

        await fetch('https://api.spotify.com/v1/albums/' + tracksAlbumdata.id, artistParameters)
            .then(response => response.json())
            .then(data => {
                return _this.tracksAlbum = data.tracks.items;
            })
        const htmlsAllTracks = _this.tracksAlbum.map((item, index) => {
            return `
            <div class="content__sing-wrap content-wrap tracks_album-search">
                <div class="descr_sing-single">
                    <div class="list__title_sing">
                        <div class="order_number">${index + 1}</div>
                        <div class="list__sing-singgle">
                            <p class="name_sing">${item.name}</p>
                            <p class="name_single">${item.artists[0].name}</p>
                        </div>
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
        allTracksPlaylist.innerHTML = htmlsAllTracks.join('');

        // show albums relate with artist
        albumRelateSearch.style.display = "block";
        const htmltitle = `<div class="head_title-relate">Album khác của ${tracksAlbumdata.artists[0].name}</div>`
        titleRelate.innerHTML = htmltitle;
        SearchMusic.handleRelateAlubms(props.relateAlbum);
    },

}

export default TracksAlbum;