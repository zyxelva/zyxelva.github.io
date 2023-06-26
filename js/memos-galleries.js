document.addEventListener("DOMContentLoaded", () => {
    //bibi module
    var bbDom = document.querySelector('#bber-talk') || '';
    if (bbDom) {
        memoTalks();
    }
    // Memos Start
    var memo = {
        host: 'https://demo.usememos.com/',
        limit: '10',
        creatorId: '101',
        domId: '#memos',
        username: 'Admin',
        name: 'Administrator'
    }
    if (typeof (memos) !== "undefined") {
        for (var key in memos) {
            if (memos[key]) {
                memo[key] = memos[key];
            }
        }
    }

    //load bibi
    function memoTalks() {
        var bbUrl = "https://me.edui.fun/api/memo?creatorId=101&rowStatus=NORMAL&limit=10"
        fetch(bbUrl).then(res => res.json()).then(resdata => {
            var result = '', resultAll = "", data = resdata.data
            for (var i = 0; i < data.length; i++) {
                var bbTime = new Date(data[i].createdTs * 1000).toLocaleString()
                var bbCont = data[i].content
                var newbbCont = bbCont.replace(/!\[.*?\]\((.*?)\)/g, ' <a href="$1" target="_blank">🌅</a> ').replace(/\[(.*?)\]\((.*?)\)/g, ' <a href="$2" target="_blank">$1 🔗</a> ')
                result += `<li class="item"><span class="datetime">${bbTime}</span>： <a href="/bb/">${newbbCont}</a></li>`;
            }
            var bbBefore = `<span class="index-talk-icon"><svg viewBox="0 0 1024 1024" width="21" height="21"><path d="M184.32 891.667692c-12.603077 0-25.206154-2.363077-37.809231-7.876923-37.021538-14.966154-59.864615-49.624615-59.864615-89.009231v-275.692307c0-212.676923 173.292308-385.969231 385.969231-385.969231h78.76923c212.676923 0 385.969231 173.292308 385.969231 385.969231 0 169.353846-137.846154 307.2-307.2 307.2H289.083077l-37.021539 37.021538c-18.904615 18.116923-43.323077 28.356923-67.741538 28.356923zM472.615385 195.347692c-178.018462 0-322.953846 144.935385-322.953847 322.953846v275.692308c0 21.267692 15.753846 29.144615 20.48 31.507692 4.726154 2.363077 22.055385 7.876923 37.021539-7.08923l46.473846-46.473846c6.301538-6.301538 14.178462-9.452308 22.055385-9.452308h354.461538c134.695385 0 244.184615-109.489231 244.184616-244.184616 0-178.018462-144.935385-322.953846-322.953847-322.953846H472.615385z"></path><path d="M321.378462 512m-59.076924 0a59.076923 59.076923 0 1 0 118.153847 0 59.076923 59.076923 0 1 0-118.153847 0Z"></path><path d="M518.301538 512m-59.076923 0a59.076923 59.076923 0 1 0 118.153847 0 59.076923 59.076923 0 1 0-118.153847 0Z"></path><path d="M715.224615 512m-59.076923 0a59.076923 59.076923 0 1 0 118.153846 0 59.076923 59.076923 0 1 0-118.153846 0Z"></path></svg></span><div class="talk-wrap"><ul class="talk-list">`
            var bbAfter = `</ul></div>`
            resultAll = bbBefore + result + bbAfter
            if (bbDom) {
                bbDom.innerHTML = resultAll;
            }
            window.Lately && Lately.init({target: '.datetime'});
        });
        setInterval(function () {
            for (var s, n = document.querySelector(".talk-list"), e = n.querySelectorAll(".item"), t = 0; t < e.length; t++)
                setTimeout(function () {
                    n.appendChild(e[0])
                }, 1000)
        }, 2000)
    }

    //memos module
    var albumDom = document.querySelector('#album') || '';
    if (albumDom) {
        memoAlbum(6);
    }

    //load Memos相册
    function memoAlbum(numb) {
        var memoUrl = memo.host + "api/memo?creatorId=" + memo.creatorId + "&tag=相册";
        let limit = numb || 8;

        var localalbumUpdated = localStorage.getItem("albumUpdated") || '';
        var localalbumData = JSON.parse(localStorage.getItem("albumData")) || '';
        if (localalbumData) {
            loadAlbum2(localalbumData, limit)
            console.log("memoAlbum 本地数据加载成功")
        } else {
            localStorage.setItem("albumUpdated", "")
        }
        fetch(memoUrl).then(res => res.json()).then(resdata => {
            var albumUpdated = resdata.data[0].updatedTs
            if (albumUpdated && localalbumUpdated !== albumUpdated) {
                var albumData = resdata.data
                albumDom.innerHTML = "";
                //开始布局
                loadAlbum2(albumData, limit)
                localStorage.setItem("albumUpdated", JSON.stringify(albumUpdated))
                localStorage.setItem("albumData", JSON.stringify(albumData))
                console.log("memoAlbum 热更新完成")
            } else {
                console.log("memoAlbum API 数据未更新")
            }
        });
    }

    //loading
    function loadAlbum2(albumData, limit) {
        let html = leonus.procMemosGalleries(memo.host, albumData, limit, 'memos-photo');
        const galleryBefore = `<div class="memos-photo-wrapper">`;
        const galleryAfter = `</div>`;
        let resultAll = galleryBefore + html + galleryAfter;
        if (albumDom) {
            albumDom.innerHTML = resultAll
        }
        window.Lately && Lately.init({target: '.photo-time'});

    }

    //朋友圈 module
    var friendDom = document.querySelector('#friArticle') || ''
    if (friendDom) {
        MyFriends();
    }

    function MyFriends() {
        var fetchNum = 20;
        var fetchUrl = "https://cf.edui.fun/all?end=" + fetchNum;
        var localfriendUpdated = JSON.parse(localStorage.getItem("friendUpdated")) || '';
        var localfriendData = JSON.parse(localStorage.getItem("friendData")) || '';
        if (localfriendData) {
            loadFriend(localfriendData, fetchNum)
            console.log("MyFriends 本地数据加载成功")
        } else {
            localStorage.setItem("friendUpdated", "")
        }
        fetch(fetchUrl).then(res => res.json()).then(resdata => {
            var friendUpdated = resdata.statistical_data.last_updated_time
            if (friendUpdated && localfriendUpdated != friendUpdated) {
                var friendData = resdata.article_data;
                friendDom.innerHTML = "";
                loadFriend(friendData, fetchNum)
                localStorage.setItem("friendUpdated", JSON.stringify(friendUpdated))
                localStorage.setItem("friendData", JSON.stringify(friendData))
                console.log("MyFriends 热更新完成")
            } else {
                console.log("MyFriends API 数据未更新")
            }
        })
    }

    function loadFriend(friendData, fetchNum) {
        var error_img = "https://gravatar.loli.net/avatar/57d8260dfb55501c37dde588e7c3852c", articleItem = '';
        for (var i = 0; i < fetchNum; i++) {
            var item = friendData[i];
            articleItem += `
    <div class="fri-item">
      <img class="fri-avatar avatar" src="${item.avatar}" alt="${item.author}" onerror="this.src='${error_img}';this.onerror = null;">
      <div class="fri-cont">
        <div class="fri-title"><a target="_blank" rel="noopener nofollow" href="${item.link}">${item.title}</a></div>
        <div class="fri-updated">${item.updated}</div>
      </div>
    </div>
    `;
        }
        friendDom.innerHTML = articleItem
        window.Lately && Lately.init({target: '.fri-updated'});
    }
});