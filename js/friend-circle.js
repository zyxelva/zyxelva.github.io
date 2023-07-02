document.addEventListener("DOMContentLoaded", () => {
    //memos module
    const circlesDom = document.querySelector('#circles') || '';
    const lastUpdatedDom = document.querySelector('#lastUpdated') || '';
    if (circlesDom) {
        loadCircles();
    }

    //开始加载json
    function loadCircles() {
        var url = null;
        if (typeof (myFriendCircles) !== "undefined") {
            url = myFriendCircles.api;
        }
        //cache
        var localCirclesUpdated = localStorage.getItem("friendCircleUpdated") || '';
        var localCirclesData = JSON.parse(localStorage.getItem("friendCircleData")) || '';
        lastUpdatedDom.innerText = "最后更新：" + localCirclesUpdated;
        if (localCirclesData) {
            loadDoubanBook(localCirclesData)
            console.log("friendCircle 本地数据加载成功")
        } else {
            localStorage.setItem("friendCircleUpdated", "")
        }
        //开始加载远端json，可以通过statistical_data.last_updated_time判断是否更新了，若更新了就加载远端，否则，不调用远端接口
        if (url === null || '' === url) {
            console.warn("friends-circle url is null or blank.")
            return;
        }
        fetch(url).then(res => res.json()).then(resdata => {
            var friendCircleUpdated = resdata.statistical_data.last_updated_time
            if (friendCircleUpdated && localCirclesUpdated != friendCircleUpdated) {
                var friendCircleData = resdata.article_data;
                lastUpdatedDom.innerText = "最后更新：" + friendCircleUpdated;
                //开始布局
                loadDoubanBook(friendCircleData)
                localStorage.setItem("friendCircleUpdated", friendCircleUpdated)
                localStorage.setItem("friendCircleData", JSON.stringify(friendCircleData))
                console.log("friendCircle 热更新完成")
            } else {
                console.log("friendCircle API 数据未更新")
            }
        });//end of fetch
    }

    //loading
    function loadDoubanBook(friendCircleData) {
        let cnt = 0;
        var html = '';
        friendCircleData.forEach(d => {
            var floor = d.floor;
            var title = d.title;
            var created = d.created;
            var link = d.link;
            var author = d.author;
            var avatar = d.avatar;
            var sn = (cnt % 10) + 1;
            html += `<div class="col s12 m6 l4 friend-div" data-aos="zoom-in-up"><div class="card friend-card${sn}"><div class="friend-ship"><div class="title"><img src="${avatar}" alt="img" /><div><a target="_blank" rel="noopener nofollow" href="${link}"><p class="friend-title">${title}</p></a><p class="friend-name">${author}</p><p>${created}</p></div></div></div></div></div>`;
            cnt++;
        });
        if (circlesDom) {
            circlesDom.insertAdjacentHTML('beforeend', html);
        }
    }
});