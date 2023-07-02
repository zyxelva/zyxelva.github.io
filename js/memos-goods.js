document.addEventListener("DOMContentLoaded", () => {
    //memos-goods module
    var goodsDom = document.querySelector('#goods') || '';
    if (goodsDom) {
        memoGoods(6, goodsDom);
    }
});

function memoGoods(numb, goodsDom) {
    let limit = numb || 6;
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
    var goodsUrl = memo.host + "api/memo?creatorId=" + memo.creatorId + "&tag=好物";
    var localalbumUpdated = localStorage.getItem("goodsUpdated") || '';
    var localalbumData = JSON.parse(localStorage.getItem("goodsData")) || '';
    if (localalbumData) {
        loadGoods(localalbumData, limit, memo.host, goodsDom)
        console.log("memosGoods 本地数据加载成功")
    } else {
        localStorage.setItem("goodsUpdated", "")
    }
    fetch(goodsUrl).then(res => res.json()).then(resdata => {
        var goodsUpdated = resdata.data[0].updatedTs
        if (goodsUpdated && localalbumUpdated !== goodsUpdated) {
            var goodsData = resdata.data
            //开始布局
            loadGoods(goodsData, limit, memo.host, goodsDom)
            localStorage.setItem("goodsUpdated", JSON.stringify(goodsUpdated))
            localStorage.setItem("goodsData", JSON.stringify(goodsData))
            console.log("memosGoods 热更新完成")
        } else {
            console.log("memosGoods API 数据未更新")
        }
    });
}

function loadGoods(data, limit, memosUrl, goodsDom) {
    let nowNum = 1;
    const regex = /\n/;
    // 格式：#好物 \n价格\n标题（可链接）\n描述
    var result = '', resultAll = "";
    for (var i = 0; i < data.length; i++) {
        if (nowNum <= limit) {
            var goodsCont = data[i].content.replace("#好物 \n", '')
            var goodsConts = goodsCont.split(regex)
            //解析memos内置资源文件(我一般不用memos上传图片，节省空间，用CDN或外链接)
            if (data[i].resourceList && data[i].resourceList.length > 0) {
                var resourceList = data[i].resourceList;
                for (var j = 0; j < resourceList.length; j++) {
                    var restype = resourceList[j].type.slice(0, 5);
                    var resexlink = resourceList[j].externalLink
                    var resLink = '', fileId = ''
                    if (resexlink) {
                        resLink = resexlink
                    } else {
                        fileId = resourceList[j].publicId || resourceList[j].filename
                        resLink = memosUrl + 'o/r/' + resourceList[j].id + '/' + fileId
                    }
                    if (restype === 'image' && nowNum <= limit) {
                        result += '<div class="goods-bankuai img-hide"><div class="goods-duiqi memos-photo"><a href="${resLink}" data-fancybox="gallery" class="fancybox" data-thumb="${resLink}"><img loading="lazy" decoding="async" src="' + resLink + '"/></a></div><div class="goods-jiage">' + goodsConts[0] + '</div><div class="goods-title">' + goodsConts[1].replace(/\[(.*?)\]\((.*?)\)/g, ' <a href="$2" target="_blank">$1</a> ') + '</div><div class="goods-note">' + goodsConts[2] + '</div></div>'
                        nowNum++;
                    }
                }
            }
            //解析markdown格式图片
            var product = goodsConts[1].replace(/\[(.*?)\]\((.*?)\)/g, '$1')
            var img = goodsConts[1].replace(/\[(.*?)\]\((.*?)\)/g, '$2');
            var price = goodsConts[0];
            var note = goodsConts[2];
            result += `<div class="goods-bankuai img-hide"><div class="goods-duiqi  memos-photo"><a href="${img}" data-fancybox="gallery" class="fancybox" data-thumb="${img}"><img class="photo-img" loading="lazy" decoding="async" src="${img}" /></a></div><div class="goods-jiage">${price}</div><div class="goods-title"><a href="${img}" target="_blank">${product}</a></div><div class="goods-note">${note}</div></div>`;
            nowNum++;
        }
    }
    var goodsBefore = ``
    var goodsAfter = ``
    resultAll = result
    goodsDom.innerHTML = resultAll

}