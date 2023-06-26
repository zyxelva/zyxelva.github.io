document.addEventListener("DOMContentLoaded", () => {
    //memos module
    const doubanBookDom = document.querySelector('#douban-book') || '';
    if (doubanBookDom) {
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

        var localDoubanBookUpdated = localStorage.getItem("doubanBookUpdated") || '';
        var localDoubanBookData = JSON.parse(localStorage.getItem("doubanBookData")) || '';
        if (localDoubanBookData) {
            loadDoubanBook(localDoubanBookData, limit)
            console.log("memosDoubanBook 本地数据加载成功")
        } else {
            localStorage.setItem("doubanBookUpdated", "")
        }
        fetch(memoUrl).then(res => res.json()).then(resdata => {
            var doubanBookUpdated = resdata.data[0].updatedTs
            if (doubanBookUpdated && localDoubanBookUpdated != doubanBookUpdated) {
                var doubanBookData = resdata.data
                //开始布局
                loadDoubanBook(doubanBookData, limit)
                localStorage.setItem("doubanBookUpdated", JSON.stringify(doubanBookUpdated))
                localStorage.setItem("doubanBookData", JSON.stringify(doubanBookData))
                console.log("memosDoubanBook 热更新完成")
            } else {
                console.log("memosDoubanBook API 数据未更新")
            }
        });
    }

    //loading
    function loadDoubanBook(doubanBookData, limit) {
        let html = '', links = [];
        let dbAPI = douban.api;
        let nowNum = 0;
        let db_reg = /^https\:\/\/(movie|book)\.douban\.com\/subject\/([0-9]+)\/?/;
        var urlReg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
        doubanBookData.forEach(item => {
            links = links.concat(item.content.match(urlReg));
        });
        links.forEach(dbHref => {
            if (dbHref && nowNum < limit) {
                var db_type = dbHref.replace(db_reg, "$1");
                var db_id = dbHref.replace(db_reg, "$2").toString();
                if (db_type === 'book') {
                    nowNum++;
                    var this_item = 'book' + db_id;
                    var url = dbAPI + "v2/book/id/" + db_id;
                    if (localStorage.getItem(this_item) === null || localStorage.getItem(this_item) === 'undefined') {
                        fetch(url).then(res => res.json()).then(data => {
                            let fetch_item = 'book' + data.id;
                            let fetch_href = "https://book.douban.com/subject/" + data.id + "/"
                            localStorage.setItem(fetch_item, JSON.stringify(data));
                            bookShow(fetch_href, fetch_item, doubanBookDom)
                        });
                    } else {
                        bookShow(dbHref, this_item, doubanBookDom)
                    }
                }
            }
        });//end of  for
        window.Lately && Lately.init({target: '.photo-time'});
    }

});

function bookShow(fetch_href, fetch_item, doubanBookDom) {
    var storage = localStorage.getItem(fetch_item);
    var data = JSON.parse(storage);
    var db_star = data.rating.average;
    var img = data.images.medium;
    var allstarPercent = toPercent(data.rating.average / 10);
    var title = data.title;
    var alt = data.subtitle;
    var html = '';

    html += `<div class="dfdORB"><div class="sc-hKFxyN HPRth"><div class="lazyload-wrapper"><img class="avatar" src="${img}" referrer-policy="no-referrer" loading="lazy" alt="${alt}" title="${title}" width="150" height="220" /></div></div><div class="sc-fujyAs eysHZq"><div class="rating"><span class="allstardark"><span class="allstarlight" style="width:${allstarPercent}"></span></span><span class="rating_nums">${db_star}</span></div></div><div class="sc-iCoGMd kMthTr"><a rel="noreferrer" href="${fetch_href}" target="_blank">${title}</a></div></div>`;
    if (doubanBookDom) {
        doubanBookDom.insertAdjacentHTML('beforeend', html);
    }
}

//小数-百分数
function toPercent(point) {
    var str = Number(point * 100).toFixed(1);
    str += "%";
    return str;
}