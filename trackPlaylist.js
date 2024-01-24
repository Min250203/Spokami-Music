
const headerInfor = $('.playlist_header-infor');
const allTracksPlaylist = $('.all_tracks');
const audio = $('#audio');
const progress = $('#progress');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');

const playBtn = $(".btn-toggle-play");
const srcAudio = $(".src-audio");

const END_POINT = "http://localhost:3000/api/";

const TrackPlaylist = {
    allTracksPlaylist: [],
    allTracks: [],
    indexTracksPlaylist: 0,
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    track: '',
    dataAllTracks: [],
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

        // play tracks when click
        $$('.content__sing-wrap').forEach((element, index) => {
            element.onclick = function () {
                _this.currentIndex = Number(element.getAttribute('data-Index'))
                $('.name__music').style.display = "block";
                $('.img__played').style.display = "block";
                _this.loadCurrentSong();
            }
        })

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
    handlePlay: function () {
        let _this = this;
        // when click btn
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        // play song
        audio.onplay = function () {
            _this.isPlaying = true;
            playBtn.classList.add('playing');
            // cdThumbAnimate.play();
        };
        // pause song
        audio.onpause = function () {
            _this.isPlaying = false;
            playBtn.classList.remove('playing');
        }
        // update time for progress
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                const progressPercentDuration = Math.floor(audio.duration / 100);
                progress.value = progressPercent;
            }
        }

        // khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // khi next bài hát
        btnNext.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();

        }

        // // khi prev bài hát
        btnPrev.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
        }


        // }
        // // khi random bài hát
        // btnRandom.onclick = function () {
        //     if (!_this.isRandom) {
        //         _this.isRandom = true;
        //         btnRandom.classList.add("active");
        //     } else {
        //         _this.isRandom = false;
        //         btnRandom.classList.remove("active");
        //     }

        //     // _this.isRandom = !_this.isRandom;
        //     // btnRandom.classList.toggle('active', _this.isRandom);
        // }

        // // Xử lý next song khi ended bài hát
        // audio.onended = function () {
        //     if (_this.isRepeat) {
        //         audio.play();
        //     } else {
        //         _this.nextSong();
        //         _this.render();
        //         audio.play();
        //     }
        //     // Hoặc dùng click --> btnNext.click(); --> vậy là nó tự động click luôn
        // }

        // // Xử lý phats lại 1 bài hát
        // btnRepeat.onclick = function () {
        //     _this.isRepeat = !_this.isRepeat;
        //     btnRepeat.classList.toggle('active', _this.isRepeat);
        // }

    },
    loadCurrentSong: async function () {
        let dataTrack = this.allTracksPlaylist.song.items[this.currentIndex];
        this.dataAllTracks = this.allTracksPlaylist.song.items;
        console.log(dataTrack)
        const desTrackPlay = `
        <div class="desc_song-play">
            <p class="title_song-play">${dataTrack.title}</p>
            <p class="title_single-play">${dataTrack.artistsNames}</p>
        </div>
        `
        $('.name__music').innerHTML = desTrackPlay;
        $('.img__played').innerHTML = `<img class="img_song-play" src="${dataTrack.thumbnailM}" alt="">`
        

        await fetch(END_POINT + `/song?id=${dataTrack.encodeId}`)
            .then(respone => respone.json())
            .then(data => this.track = data["data"]["128"])
        audio.src = this.track;
        audio.play();
        playBtn.classList.add('playing');
        this.handlePlay();

    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.dataAllTracks.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.dataAllTracks.length - 1;
        }
        this.loadCurrentSong();
    },
    // randomSong: function () {
    //     let newIndex
    //     do {
    //         newIndex = Math.floor(Math.random() * this.songs.length);
    //     }
    //     while (newIndex === this.currentIndex);
    //     this.currentIndex = newIndex;
    //     this.loadCurrentSong();
    // },
};

export default TrackPlaylist;