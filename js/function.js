"use strict";
var leonus = {
    cp: () => {
        document.body.addEventListener("copy", (e => {
            "TEXTAREA" == e.target.tagName && "" == e.target.className || btf.snackbarShow("复制成功~")
        })), document.body.addEventListener("paste", (() => {
            btf.snackbarShow("粘贴成功~")
        }))
    },
    addScript: (e, t, n) => {
        if (document.getElementById(e)) return n ? n() : void 0;
        let a = document.createElement("script");
        a.src = t, a.id = e, n && (a.onload = n), document.head.appendChild(a)
    },
    gotoID: e => {
        var t = location.href;
        location.href = "#" + e, history.replaceState(null, null, t);
        let n = document.getElementById(e).offsetTop - 60;
        window.scrollTo({top: n})
    },
    addMusic: () => {
        let e = null;
        e = document.body.clientWidth > 768 ? document.getElementById("pcMusic") : document.getElementById("phMusic"), e && (e.innerHTML = '<meting-js id="7903334636" server="tencent" type="playlist" theme="var(--leonus-purple)" order="random" preload="metadata" listFolded="true"></meting-js>')
    },
    musicBtn: () => {
        if (document.querySelector("#pcMusic .aplayer")) {
            let e = document.querySelector("#nav .music-btn");
            e && (e.style.display = "block")
        }
    },
    talkTime: null,
    indexTalk: () => {
        if (leonus.talkTime && (clearInterval(leonus.talkTime), leonus.talkTime = null), !document.getElementById("bber-talk")) return;

        function e(e) {
            let t = "";
            e.forEach(((e, n) => {
                t += `<li class="item item-${n + 1}">${e}</li>`
            }));
            let n = document.querySelector("#bber-talk .talk-list");
            n && (n.innerHTML = t, leonus.talkTime = setInterval((() => {
                n.appendChild(n.children[0])
            }), 3e3))
        }

        let t = saveToLocal.get("talk");
        t ? e(t) : fetch("https://m.leonus.cn/api/memo?creatorId=1&tag=说说&limit=10").then((e => e.json())).then((t => {
            e(t = function (e) {
                let t = [];
                return e.forEach((e => {
                    t.push(e.content.replace(/#(.*?)\s/g, "").replace(/{\s*music\s*(.*)\s*}/g, '<i class="fa-solid fa-music"></i>').replace(/{\s*bilibili\s*(.*)\s*}/g, '<i class="fa-brands fa-bilibili"></i>').replace(/```/g, "").replace(/\!\[(.*?)\]\((.*?)\)/g, '<i class="fa-solid fa-image"></i>').replace(/\[(.*?)\]\((.*?)\)/g, '<i class="fa-solid fa-link"></i>'))
                })), t
            }(t.data)), saveToLocal.set("talk", t, .01)
        }))
    },
    //解析所有memos内的图片，包括md格式的，内置资源的（上传至memos服务器的图片）
    procMemosGalleries: (memosUrl, memosData, limit, className) => {
        if (!(memosData && memosData.length > 0)) {
            return '';
        }
        let html = '', imgs = [];
        let nowNum = 0;
        memosData.forEach(item => {
            imgs = imgs.concat(item.content.match(/\!\[.*?\]\(.*?\)/g)).concat(leonus.procMemosResources(memosUrl, item));
        });
        imgs.forEach(item => {
            if (item && nowNum < limit) {
                nowNum++
                let img = item.replace(/!\[.*?\]\((.*?)\)/g, '$1'),
                    time, title, tat = item.replace(/!\[(.*?)\]\(.*?\)/g, '$1');
                if (tat.indexOf(' ') !== -1) {
                    time = tat.split(' ')[0];
                    title = tat.split(' ')[1];
                } else title = tat

                html += `<div class="${className}"><a href="${img}" data-fancybox="gallery" class="fancybox" data-thumb="${img}"><img alt="${tat}" class="photo-img" loading='lazy' decoding="async" src="${img}"></a>`;
                title ? html += `<span class="photo-title">${title}</span>` : '';
                time ? html += `<span class="photo-time">${time}</span>` : '';
                html += `</div>`;
            }
        });
        return html;
    },
    //最终需要酱紫：![xxx](url)
    //demo: [{
    //           "id": 13,
    //           "creatorId": 1,
    //           "createdTs": 1687395117,
    //           "updatedTs": 1687395117,
    //           "filename": "1687395079_F7A1CD62-8CD8-4D15-AD9B-F249F6A42503.jpg",
    //           "internalPath": "/var/opt/memos/assets/1687395079_F7A1CD62-8CD8-4D15-AD9B-F249F6A42503.jpg",
    //           "externalLink": "",
    //           "type": "image/jpeg",
    //           "size": 523150,
    //           "publicId": "8d5b0eeb-804a-4533-b677-5a67febaaae9",
    //           "linkedMemoAmount": 1
    //         }]
    procMemosResources: (memosUrl, item) => {
        if (!(item && item.resourceList && 0 < item.resourceList.length) || !memosUrl) {
            return '';
        }
        let content = item.content;
        //取最后一个空格后的值为标题
        let titleConts = content.replace("\n", '').split(' ');
        let title = titleConts[titleConts.length - 1];
        let resourceList = item.resourceList;
        let picsUrlLikeMd = '';
        for (var j = 0; j < resourceList.length; j++) {
            var restype = resourceList[j].type.slice(0, 5);
            var resexlink = resourceList[j].externalLink
            var resLink = '', fileId = '';
            var createdDate = new Date(resourceList[j].createdTs * 1000);
            var dt = [createdDate.getFullYear(), createdDate.getMonth() + 1, createdDate.getDate()].join('-');
            if (resexlink) {
                resLink = resexlink
            } else {
                fileId = resourceList[j].publicId || resourceList[j].filename
                resLink = memosUrl + 'o/r/' + resourceList[j].id + '/' + fileId
            }
            if (restype === 'image') {
                if (!title) {
                    picsUrlLikeMd += `![${dt}](${resLink})`;
                } else {
                    picsUrlLikeMd += `![${dt} ${title}](${resLink})`;
                }
            }
        }
        return picsUrlLikeMd.match(/\!\[.*?\]\(.*?\)/g);
    },
    //处理哔哔页面memos
    procBiBi: (memosUrl, singleData, className) => {
        var memoContREG = '';
        //解析md图片
        let imgMds = [];
        imgMds = imgMds.concat(singleData.content.match(/\!\[.*?\]\(.*?\)/g));
        if (imgMds && imgMds.length > 0) {
            let imgUrl = '';
            imgMds.forEach(item => {
                if (item) {
                    let imgSrc = item.replace(/!\[.*?\]\((.*?)\)/g, '$1');
                    let tat = item.replace(/!\[(.*?)\]\(.*?\)/g, '$1');
                    imgUrl += `<div class="${className}"><a href="${imgSrc}" data-fancybox="gallery" class="fancybox" data-thumb="${imgSrc}"><img style="min-width: 100%;" alt="${tat}" loading="lazy" src="${imgSrc}"/></a></div>`;
                }
            });
            if (imgUrl) {
                memoContREG += `<div class="resource-wrapper "><div class="images-wrapper">${imgUrl}</div></div>`;
            }
        }
        // 解析内置资源文件
        if (singleData && singleData.resourceList && singleData.resourceList.length > 0) {
            var resourceList = singleData.resourceList;
            var imgUrl = '', resUrl = '', resImgLength = 0;
            for (var j = 0; j < resourceList.length; j++) {
                var resType = resourceList[j].type.slice(0, 5);
                var resexlink = resourceList[j].externalLink;
                var resLink = '', fileId;
                if (resexlink) {
                    resLink = resexlink
                } else {
                    fileId = resourceList[j].publicId || resourceList[j].filename
                    resLink = memosUrl + 'o/r/' + resourceList[j].id + '/' + fileId
                }
                if (resType === 'image') {
                    imgUrl += `<div class="resimg"><a href="${resLink}" data-fancybox="gallery" class="fancybox" data-thumb="${resLink}"><img style="min-width: 100%;" loading="lazy" src="${resLink}"/></a></div>`;
                    resImgLength = resImgLength + 1
                }
                if (resType !== 'image') {
                    resUrl += '<a target="_blank" rel="noreferrer" href="' + resLink + '">' + resourceList[j].filename + '</a>'
                }
            } //end of for
            if (imgUrl) {
                memoContREG += `<div class="resource-wrapper "><div class="images-wrapper">${imgUrl}</div></div>`;
            }
            if (resUrl) {
                memoContREG += `<div class="resource-wrapper "><p class="datasource">${resUrl}</p></div>`;
            }
        }
        return memoContREG;
    }
};