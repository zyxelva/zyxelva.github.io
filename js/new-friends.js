document.addEventListener("DOMContentLoaded", () => {
    //friends module
    const circlesDom = document.querySelector('#newFriends') || '';
    if (circlesDom) {
        loadCircles();
    }

    //开始加载json
    function loadCircles() {
        var url = null;
        if (typeof (myFriends) !== "undefined") {
            url = myFriends.api;
        }
        //cache
        var localCirclesUpdated = localStorage.getItem("newFriendsUpdated") || '';
        var localCirclesData = JSON.parse(localStorage.getItem("newFriendsData")) || '';
        if (localCirclesData) {
            load(localCirclesData)
            console.log("newFriends 本地数据加载成功")
        } else {
            localStorage.setItem("newFriendsUpdated", "")
        }
        //开始加载远端json，可以通过statistical_data.last_updated_time判断是否更新了，若更新了就加载远端，否则，不调用远端接口
        if (url === null || '' === url) {
            console.warn("new friends url is null or blank.")
            return;
        }
        fetch(url).then(res => res.json()).then(resdata => {
            var newFriendsUpdated = resdata.statistical_data.last_updated_time
            if (newFriendsUpdated && localCirclesUpdated != newFriendsUpdated) {
                var newFriendsData = resdata.friends;
                //开始布局
                load(newFriendsData)
                localStorage.setItem("newFriendsUpdated", newFriendsUpdated)
                localStorage.setItem("newFriendsData", JSON.stringify(newFriendsData))
                console.log("newFriends 热更新完成")
            } else {
                console.log("newFriends API 数据未更新")
            }
        });//end of fetch
    }

    //loading
    function load(newFriendsData) {
        let cnt = 0;
        var html = '';
        newFriendsData.forEach(friend => {
            var title = friend.title;
            var name = friend.name;
            var introduction = friend.introduction;
            var url = friend.url;
            var avatar = friend.avatar;
            var sn = (cnt % 10) + 1;
            html += `<div class="col s12 m6 l4 friend-div" data-aos="zoom-in-up"><div class="card friend-card${sn}"><div class="friend-ship"><div class="title"><img src="${avatar}" alt="img"><div><h1 class="friend-name">${name}</h1><p style="position: relative;top: -35px;">${introduction}</p></div></div><div class="friend-button"><a href="${url}" target="_blank" class="button button-glow button-rounded button-caution">${title}</a></div></div></div></div>`;
            cnt++;
        });
        if (circlesDom) {
            circlesDom.insertAdjacentHTML('beforeend', html);
        }
    }
});