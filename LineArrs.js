/*
 * @Author         : 杨洋
 * @Date           : 2021-10-18 15:16:45
 * @lastTime       : 2022-01-19 14:20:02
 * @文件相对于项目的路径     : \three\examples\js\p2p\LineArrs.js
 * @Description    : 地图线路展示
 */
class LineArrs {

    lineArrs;
    group;

    constructor(lineArrs) {
        this.lineArrs = lineArrs;
        this.group = new THREE.Group();
    }

    show(callback) {
        this.lineArrs.forEach(lineArr => {
            this.move(lineArr);
        });
        callback && callback(this.group);
    }

    move(lineArr) {
        let curve = new THREE.CatmullRomCurve3(lineArr);
        let points = curve.getPoints(50);
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        let material = new THREE.LineDashedMaterial({
            // color: window.COLOR_LIST[window.C_INDEX++ % 5],
            color: 0xff0000,
            gapSize: 1
        });
        let line = new THREE.Line(geometry, material);
        line.computeLineDistances();
        let nMax = geometry.attributes.position.count;
        let nEnd = 0;
        //#region 根据距离来算每次移动距离
        // let distance = lineArr.length > 2 ? this.getDistance(lineArr) : lineArr[0].distanceTo(lineArr[lineArr.length - 1]);
        // let _length = (~~(distance) + '').length;
        // let temp = 6 * (10 ** (_length - 3));
        // let step = (distance / (50 * temp));
        //#endregion
        //  固定移动距离
        let step = .5;
        let interval = setInterval(() => {
            nEnd = (nEnd + step) % nMax;
            if (line && line.geometry)
                line.geometry.setDrawRange(0, nEnd);
            if (nEnd >= (nMax - 2))
                clearInterval(interval);
        }, 25);
        this.group.add(line);
    }

    getDistance(lineArr) {
        let result = 0;
        for (let i = 0; i < lineArr.length - 2; i++)
            result += lineArr[i].distanceTo(lineArr[i + 1]);
        return result;
    }

}

export {
    LineArrs
};