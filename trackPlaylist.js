const headerInfor = $('.playlist_header-infor');
const allTracksPlaylist = $('.all_tracks');

const END_POINT = "http://localhost:3000/api/";

const TrackPlaylist = {
    allTracksPlaylist: [],
    allTracks: [],
    indexTracksPlaylist: 0,
    handleRenderTracksForU: async function (props) {
        let _this = this;
        let PlaylistForU = props.playlistMusicForU[0].items.filter((item) => item.banner === props.titlePlaylist)
        // get alltracksplaylist
        await fetch(END_POINT + `detailplaylist?id=${PlaylistForU[0].encodeId}`)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.data;
            })
            .catch(error => console.error(error))

        //   inforHeader playlist
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${PlaylistForU[0].banner}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${_this.allTracksPlaylist.textType}</p>
                    <h1 class="playlist__title-header">${_this.allTracksPlaylist.title}</h1>
                    <p class="playlist_descr"> ${_this.allTracksPlaylist.description}</p>
                </div>
            </div>
            `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;
        // render tracks
        const htmlsAllTracks = _this.allTracksPlaylist.song.items.map((item, index) => {
            return `
            <div class="content__sing-wrap content-wrap" data-Index=${index}>
                <div class="descr_sing-single">
                    <div class="list__title_sing">
                        <div class="order_number">${index + 1}</div>
                        <div class="play_track-play"><i class="fa-solid fa-play icon_play-tracks"></i></div>
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
                    <div class="icon_like-mobile">
                        <i class="fa-regular fa-heart icon_like-mobile"></i>
                    </div>
                    <div class="time-clock">2 phút</div>
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        })
        allTracksPlaylist.innerHTML = htmlsAllTracks.join('');

        // hover tracks when play
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.play_track-play');
            element.onmouseover = function (e) {
                _this.indexTracksPlaylist = Number(element.getAttribute('data-Index'))
                if (orderNumber && index === _this.indexTracksPlaylist) {
                    orderNumber.style.display = "none";
                    iconPlay.style.display = "block"
                }
            }
            element.onmouseout = function (e) {
                orderNumber.style.display = "block";
                iconPlay.style.display = "none"
            }
        })
    },
    handleRenderTracksMood: async function (props) {
        let _this = this;
        let PlaylistMood = props.playlistMusicMood[0].items.filter((item) => item.title === props.titlePlaylist)
        // get alltracksplaylist
        await fetch(END_POINT + `detailplaylist?id=${PlaylistMood[0].encodeId}`)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.data;
            })
            .catch(error => console.error(error))

        //   inforHeader playlist
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${PlaylistMood[0].thumbnailM}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${_this.allTracksPlaylist.textType}</p>
                    <h1 class="playlist__title-header">${_this.allTracksPlaylist.title}</h1>
                    <p class="playlist_descr"> ${_this.allTracksPlaylist.description}</p>
                </div>
                `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        //    render Tracks
        const htmlsAllTracks = _this.allTracksPlaylist.song.items.map((item, index) => {
            return `
                <div class="content__sing-wrap content-wrap" data-Index=${index}>
                    <div class="descr_sing-single">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                        <div class="play_track-play"><i class="fa-solid fa-play icon_play-tracks"></i></div>
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
                        <div class="icon_like-mobile">
                            <i class="fa-regular fa-heart icon_like-mobile"></i>
                        </div>
                        <div class="time-clock">2 phút</div>
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        })
        allTracksPlaylist.innerHTML = htmlsAllTracks.join('');

        // hover tracks when play
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.play_track-play');
            element.onmouseover = function (e) { 
                _this.indexTracksPlaylist = Number(element.getAttribute('data-Index'))
                if (orderNumber && index === _this.indexTracksPlaylist) {
                    orderNumber.style.display = "none";
                    iconPlay.style.display = "block"
                }
            }
            element.onmouseout = function (e) {
                orderNumber.style.display = "block";
                iconPlay.style.display = "none"
            }
        })

    },
    handleRenderTracksChill: async function (props) {
        let _this = this;
        let PlaylistChill = props.playlistMusicChill[0].items.filter((item) => item.title === props.titlePlaylist)
        // get alltracksplaylist
        await fetch(END_POINT + `detailplaylist?id=${PlaylistChill[0].encodeId}`)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.data;
            })
            .catch(error => console.error(error))

        //   inforHeader playlist
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${PlaylistChill[0].thumbnailM}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${_this.allTracksPlaylist.textType}</p>
                    <h1 class="playlist__title-header">${_this.allTracksPlaylist.title}</h1>
                    <p class="playlist_descr"> ${_this.allTracksPlaylist.description}</p>
                </div>
                `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        //    render Tracks
        const htmlsAllTracks = _this.allTracksPlaylist.song.items.map((item, index) => {
            return `
                <div class="content__sing-wrap content-wrap" data-Index=${index}>
                    <div class="descr_sing-single">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                        <div class="play_track-play"><i class="fa-solid fa-play icon_play-tracks"></i></div>
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
                        <div class="icon_like-mobile">
                            <i class="fa-regular fa-heart icon_like-mobile"></i>
                        </div>
                        <div class="time-clock">2 phút</div>
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        })
        allTracksPlaylist.innerHTML = htmlsAllTracks.join('');

        // hover tracks when play
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.play_track-play');
            element.onmouseover = function (e) {
                _this.indexTracksPlaylist = Number(element.getAttribute('data-Index'))
                if (orderNumber && index === _this.indexTracksPlaylist) {
                    orderNumber.style.display = "none";
                    iconPlay.style.display = "block"
                }
            }
            element.onmouseout = function (e) {
                orderNumber.style.display = "block";
                iconPlay.style.display = "none"
            }
        })

    },
    handleRenderTracksSpring: async function (props) {
        let _this = this;
        let PlaylistSpring = props.playlistMusicSpring[0].items.filter((item) => item.title === props.titlePlaylist)
        // get alltracksplaylist
        await fetch(END_POINT + `detailplaylist?id=${PlaylistSpring[0].encodeId}`)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.data;
            })
            .catch(error => console.error(error))

        //   inforHeader playlist
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${PlaylistSpring[0].thumbnailM}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${_this.allTracksPlaylist.textType}</p>
                    <h1 class="playlist__title-header">${_this.allTracksPlaylist.title}</h1>
                    <p class="playlist_descr"> ${_this.allTracksPlaylist.description}</p>
                </div>
                `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        //    render Tracks
        const htmlsAllTracks = _this.allTracksPlaylist.song.items.map((item, index) => {
            return `
                <div class="content__sing-wrap content-wrap" data-Index=${index}>
                    <div class="descr_sing-single">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                        <div class="play_track-play"><i class="fa-solid fa-play icon_play-tracks"></i></div>
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
                        <div class="icon_like-mobile">
                            <i class="fa-regular fa-heart icon_like-mobile"></i>
                        </div>
                        <div class="time-clock">2 phút</div>
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        })
        allTracksPlaylist.innerHTML = htmlsAllTracks.join('');

        // hover tracks when play
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.play_track-play');
            element.onmouseover = function (e) {
                _this.indexTracksPlaylist = Number(element.getAttribute('data-Index'))
                if (orderNumber && index === _this.indexTracksPlaylist) {
                    orderNumber.style.display = "none";
                    iconPlay.style.display = "block"
                }
            }
            element.onmouseout = function (e) {
                orderNumber.style.display = "block";
                iconPlay.style.display = "none"
            }
        })

    },
    handleRenderTracksTop: async function (props) {
        let _this = this;
        let PlaylistTop = props.playlistMusicTop[0].items.filter((item) => item.title === props.titlePlaylist)
        // get alltracksplaylist
        await fetch(END_POINT + `detailplaylist?id=${PlaylistTop[0].encodeId}`)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.data;
            })
            .catch(error => console.error(error))

        //   inforHeader playlist
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${PlaylistTop[0].thumbnailM}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${_this.allTracksPlaylist.textType}</p>
                    <h1 class="playlist__title-header">${_this.allTracksPlaylist.title}</h1>
                    <p class="playlist_descr"> ${_this.allTracksPlaylist.description}</p>
                </div>
                `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        //    render Tracks
        const htmlsAllTracks = _this.allTracksPlaylist.song.items.map((item, index) => {
            return `
                <div class="content__sing-wrap content-wrap" data-Index=${index}>
                    <div class="descr_sing-single">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                        <div class="play_track-play"><i class="fa-solid fa-play icon_play-tracks"></i></div>
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
                        <div class="icon_like-mobile">
                            <i class="fa-regular fa-heart icon_like-mobile"></i>
                        </div>
                        <div class="time-clock">2 phút</div>
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        })
        allTracksPlaylist.innerHTML = htmlsAllTracks.join('');

        // hover tracks when play
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.play_track-play');
            element.onmouseover = function (e) {
                _this.indexTracksPlaylist = Number(element.getAttribute('data-Index'))
                if (orderNumber && index === _this.indexTracksPlaylist) {
                    orderNumber.style.display = "none";
                    iconPlay.style.display = "block"
                }
            }
            element.onmouseout = function (e) {
                orderNumber.style.display = "block";
                iconPlay.style.display = "none"
            }
        })

    },
    handleRenderTracksHot: async function (props) {
        let _this = this;
        let PlaylistHot = props.playlistMusicHot[0].items.filter((item) => item.title === props.titlePlaylist)
        // get alltracksplaylist
        await fetch(END_POINT + `detailplaylist?id=${PlaylistHot[0].encodeId}`)
            .then(response => response.json())
            .then(data => {
                _this.allTracksPlaylist = data.data;
            })
            .catch(error => console.error(error))

        //   inforHeader playlist
        const htmlsInforPlaylistHeader = `
            <div class="playlist__header">
                <div class="playlist_img">
                    <img src="${PlaylistHot[0].thumbnailM}"
                        alt="">
                </div>
                <div class="categories_descr">
                    <p class="name_playlist">${_this.allTracksPlaylist.textType}</p>
                    <h1 class="playlist__title-header">${_this.allTracksPlaylist.title}</h1>
                    <p class="playlist_descr"> ${_this.allTracksPlaylist.description}</p>
                </div>
                `
        headerInfor.innerHTML = htmlsInforPlaylistHeader;

        //    render Tracks
        const htmlsAllTracks = _this.allTracksPlaylist.song.items.map((item, index) => {
            return `
                <div class="content__sing-wrap content-wrap" data-Index=${index}>
                    <div class="descr_sing-single">
                        <div class="list__title_sing">
                            <div class="order_number">${index + 1}</div>
                        <div class="play_track-play"><i class="fa-solid fa-play icon_play-tracks"></i></div>
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
                        <div class="icon_like-mobile">
                            <i class="fa-regular fa-heart icon_like-mobile"></i>
                        </div>
                        <div class="time-clock">2 phút</div>
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        })
        allTracksPlaylist.innerHTML = htmlsAllTracks.join('');

        // hover tracks when play
        $$('.content__sing-wrap').forEach((element, index) => {
            let orderNumber = element.querySelector('.order_number');
            let iconPlay = element.querySelector('.play_track-play');
            element.onmouseover = function (e) {
                _this.indexTracksPlaylist = Number(element.getAttribute('data-Index'))
                if (orderNumber && index === _this.indexTracksPlaylist) {
                    orderNumber.style.display = "none";
                    iconPlay.style.display = "block"
                }
            }
            element.onmouseout = function (e) {
                orderNumber.style.display = "block";
                iconPlay.style.display = "none"
            }
        })

    },
};

export default TrackPlaylist;