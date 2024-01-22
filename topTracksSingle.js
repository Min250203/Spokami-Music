
const headerInfor = $('.playlist_header-infor');
const allTracks = $('.active-show');
const tracksSingle = $('.all_tracks-single');
const tracksFanLikeWrap = $('.album_fan-wrap');


const TopTracksSingle = {
    tracksInfor: [],
    tracksFanLike: [],
    handleTracks: async function (props) {
        console.log(props)
        if (props.type === "infor-Single") {
            let artistID = props.artistID;
            let artistParameters = props.artistParameters;
            let _this = this
            await fetch('https://api.spotify.com/v1/artists/' + artistID + '/top-tracks' + '?market=VN&limit=50', artistParameters)
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
            await fetch('https://api.spotify.com/v1/artists/' + artistID + '/related-artists' + '?market=VN', artistParameters)
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