const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const imageSize = require('image-size');

const rootPath = "/Users/zyxelva/Documents/MyGit/picgo/images/"   //相册相对路径

class PhotoExtension {
    constructor() {
        this.size = 64;
        this.offset = [0, 0];
    }
}

class Photo {
    constructor() {
        this.dirName = '';
        this.fileName = '';
        this.iconID = '';
        this.extension = new PhotoExtension();
    }
}

class PhotoGroup {
    constructor() {
        this.name = '';
        this.photos = [];
    }
}

function createPlotIconsData() {
    let allPlots = [];
    let allPlotGroups = [];
    console.log("dirname: " + __dirname);
    const plotJsonFile = path.join(__dirname, './photosInfo.json');
    const plotGroupJsonFile = path.join(__dirname+ "/../_data", './galleries.json');

    if (fs.existsSync(plotJsonFile)) {
        allPlots = JSON.parse(fs.readFileSync(plotJsonFile, {encoding: "utf8"}));
    }

    if (fs.existsSync(plotGroupJsonFile)) {
        allPlotGroups = JSON.parse(fs.readFileSync(plotGroupJsonFile, {encoding: "utf8"}));
    }

    fs.readdirSync(rootPath).forEach(function (dirName) {
        const stats = fs.statSync(path.join(rootPath, dirName));
        const isDir = stats.isDirectory();
        if (isDir && dirName !== ".DS_Store") {
            const subfiles = fs.readdirSync(path.join(rootPath, dirName));
            subfiles.forEach(function (subfileName) {
                // 如果已经存在 则不再处理
                if (allPlots.find(o => o.fileName === subfileName && o.dirName === dirName)) {
                    return;
                }
                if (subfileName !== ".DS_Store") {
                    // 新增标
                    const plot = new Photo();
                    plot.dirName = dirName;
                    plot.fileName = subfileName;
                    const imageInfo = imageSize(rootPath + dirName + "/" + subfileName);
                    plot.iconID = imageInfo.width + '.' + imageInfo.height + ' ' + subfileName;
                    allPlots.push(plot);
                    console.log(`RD: createPlotIconsData -> new plot`, plot);

                    // 为新增标添加分组 暂时以它所处的文件夹为分组
                    let group = allPlotGroups.find(o => o.name === dirName);
                    if (!group) {
                        group = new PhotoGroup();
                        group.name = dirName;
                        group.cover = dirName + "/" + subfileName;
                        group.description = dirName;
                        allPlotGroups.push(group);
                        console.log(`RD: createPlotIconsData -> new group`, group);
                    }
                    group.photos.push(plot.dirName + "/" + plot.fileName);
                }
            });
        }
    });

    fse.writeJsonSync(plotJsonFile, allPlots);
    fse.writeJsonSync(plotGroupJsonFile, allPlotGroups);
}

createPlotIconsData();