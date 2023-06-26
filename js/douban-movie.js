document.addEventListener("DOMContentLoaded", () => {
    //memos module
    const doubanMovieDom = document.querySelector('#douban-movie') || '';
    if (doubanMovieDom) {
        memosDouban(5);
    }

    //load Memos豆瓣
    function memosDouban(count) {
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
        var memoUrl = memo.host + "api/memo?creatorId=" + memo.creatorId + "&tag=豆瓣";
        let limit = count || 8;

        var localDoubanMovieUpdated = localStorage.getItem("doubanMovieUpdated") || '';
        var localDoubanMovieData = JSON.parse(localStorage.getItem("doubanMovieData")) || '';
        if (localDoubanMovieData) {
            loadDoubanMovies(localDoubanMovieData, limit)
            console.log("memosDoubanMovie 本地数据加载成功")
        } else {
            localStorage.setItem("doubanMovieUpdated", "")
        }
        fetch(memoUrl).then(res => res.json()).then(resdata => {
            var doubanMovieUpdated = resdata.data[0].updatedTs
            if (doubanMovieUpdated && localDoubanMovieUpdated != doubanMovieUpdated) {
                var doubanMovieData = resdata.data
                doubanMovieDom.innerHTML = "";
                //开始布局
                loadDoubanMovies(doubanMovieData, limit)
                localStorage.setItem("doubanMovieUpdated", JSON.stringify(doubanMovieUpdated))
                localStorage.setItem("doubanMovieData", JSON.stringify(doubanMovieData))
                console.log("memosDoubanMovie 热更新完成")
            } else {
                console.log("memosDoubanMovie API 数据未更新")
            }
        });
    }

    //loading
    function loadDoubanMovies(doubanMovieData, limit) {
        let html = '', links = [];
        let dbAPI = douban.api;
        let nowNum = 0;
        let db_reg = /^https\:\/\/(movie|book)\.douban\.com\/subject\/([0-9]+)\/?/;
        var urlReg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
        doubanMovieData.forEach(item => {
            links = links.concat(item.content.match(urlReg));
        });
        links.forEach(dbHref => {
            if (dbHref && nowNum < limit) {
                var db_type = dbHref.replace(db_reg, "$1");
                var db_id = dbHref.replace(db_reg, "$2").toString();
                if (db_type === 'movie') {
                    nowNum++;
                    var this_item = 'movie' + db_id;
                    var url = dbAPI + "movies/" + db_id;
                    if (localStorage.getItem(this_item) == null || localStorage.getItem(this_item) === 'undefined') {
                        fetch(url).then(res => res.json()).then(data => {
                            let fetch_item = 'movies' + data.sid;
                            let fetch_href = "https://movie.douban.com/subject/" + data.sid + "/"
                            localStorage.setItem(fetch_item, JSON.stringify(data));
                            movieShow(fetch_href, fetch_item, doubanMovieDom)
                        });
                    } else {
                        movieShow(dbHref, this_item, doubanMovieDom)
                    }
                }
            }
        });//end of  for
        window.Lately && Lately.init({target: '.photo-time'});
    }

});

function movieShow(fetch_href, fetch_item, doubanMovieDom) {
    var storage = localStorage.getItem(fetch_item);
    var data = JSON.parse(storage);
    var db_star = data.rating;
    var allstarPercent = toPercent(data.rating / 10);
    var img = data.img;
    var title = data.name;
    var html = '';

    html += `<div class="dfdORB"><div class="sc-hKFxyN HPRth"><div class="lazyload-wrapper"><img class="avatar" src="${img}" referrer-policy="no-referrer" loading="lazy" title="${title}" width="150" height="220" /></div></div><div class="sc-fujyAs eysHZq"><div class="rating"><span class="allstardark"><span class="allstarlight" style="width:${allstarPercent}"></span></span><span class="rating_nums">${db_star}</span></div></div><div class="sc-iCoGMd kMthTr"><a rel="noreferrer" href="${fetch_href}" target="_blank">${title}</a></div></div>`;
    if (doubanMovieDom) {
        doubanMovieDom.insertAdjacentHTML('beforeend', html);
    }
}

//小数-百分数
function toPercent(point) {
    var str = Number(point * 100).toFixed(1);
    str += "%";
    return str;
}