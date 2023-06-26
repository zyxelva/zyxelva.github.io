let host = '';

// 适配pjax
function whenDOMReady() {
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
    host = memo.host;
    var memoUrl = memo.host + "api/memo?creatorId=" + memo.creatorId + "&tag=相册"
    if (location.pathname === '/photos/') {
        photos(memoUrl);
    }
}

whenDOMReady()
document.addEventListener("pjax:complete", whenDOMReady)

// 自适应
window.onresize = () => {
    if (location.pathname === '/photos/') {
        waterfall('.gallery-photos');
    }
};

// 函数
function photos(memoUrl) {
    let limit = 500;
    var localAlbumUpdated = JSON.parse(localStorage.getItem("memosPicsUpdated")) || '';
    var localAlbumData = JSON.parse(localStorage.getItem("memosPicsData")) || '';
    if (localAlbumData) {
        loadAlbum2(localAlbumData, limit)
        console.log("memosPics 本地数据加载成功")
    } else {
        localStorage.setItem("memosPicsUpdated", "")
    }

    fetch(memoUrl).then(res => res.json()).then(resdata => {
        var memosPicsUpdated = resdata.data[0].updatedTs
        if (memosPicsUpdated && localAlbumUpdated != memosPicsUpdated) {
            var memosPicsData = resdata.data
            //开始布局
            loadAlbum2(memosPicsData, limit)
            localStorage.setItem("memosPicsUpdated", JSON.stringify(memosPicsUpdated))
            localStorage.setItem("memosPicsData", JSON.stringify(memosPicsData))
            console.log("memosPics 热更新完成")
        } else {
            console.log("memosPics API 数据未更新")
        }
    }).catch();

    function loadAlbum2(memosPicsData, limit) {
        let albumDom = document.querySelector('.gallery-photos.page') || '';
        if (albumDom) {
            albumDom.innerHTML = leonus.procMemosGalleries(host, memosPicsData, limit, 'gallery-photo');
            imgStatus.watch('.photo-img', () => {
                waterfall('.gallery-photos');
            });
        }
        window.Lately && Lately.init({target: '.photo-time'});
    }
}