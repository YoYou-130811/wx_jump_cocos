/*
 * @Author         : 杨洋
 * @Date           : 2021-10-27 17:35:05
 * @lastTime       : 2022-03-03 15:13:18
 * @文件相对于项目的路径     : \three\examples\js\p2p\TagInfo.js
 * @Description    : 信息展示DIV
 */
class TagInfo {

    div;
    div2;
    size;
    text;
    jsonUrl = './js/p2p/info.json';
    scene;
    camera;

    constructor(scene, camera, size) {
        this.scene = scene;
        this.camera = camera;
        this.size = size;
        this.createDiv(size);
    }

    /**
     * @Author         : 杨洋
     * @Date           : 2021-10-28 14:55:20
     * @param           {*}
     * @Description    : 创建div
     */
    createDiv(size) {
        this.div = document.createElement('div');
        this.div.id = 'tagInfo';
        this.div.style.position = 'absolute';
        this.div.style.backgroundImage = 'url(textures/dhk.jpg)';
        this.div.style.backgroundSize = '100% 100%';
        this.div.style.width = size.width;
        this.div.style.height = size.height;
        this.div.style.display = 'none';
        this.div2 = document.createElement('div');
        this.div2.id = 'tagInfoChild';
        this.div2.style.position = 'relative';
        let width = parseInt(size.width) * 0.8;
        this.div2.style.width = width + 'px';
        this.div2.style.height = '80.8px';
        this.div2.style.textAlign = 'center';
        this.div2.style.wordBreak = 'break-all';
        this.div2.style.top = '10%';
        this.div2.style.left = (parseInt(size.width) - width) / 2 + 'px';
        this.div2.innerHTML = '';
        this.div.appendChild(this.div2);
        document.body.appendChild(this.div);
    }

    /**
     * @Author         : 杨洋
     * @Date           : 2021-10-25 17:03:35
     * @param           {*} event   鼠标事件
     * @Description    : 在鼠标所处点与相机建立一条射线
     */
    getRay(event) {
        event.preventDefault();
        let mouse = new THREE.Vector2();
        let rayCaster = new THREE.Raycaster();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        rayCaster.setFromCamera(mouse, this.camera);
        return rayCaster;
    }

    /**
     * @Author         : 杨洋
     * @Date           : 2021-10-25 17:03:30
     * @param           {*} event   鼠标事件
     * @Description    : 判断鼠标所处点是否与物体相交
     */
    getIntersectObjects(event, type = -1) {
        let intersects = this.getRay(event).intersectObjects(this.scene.children, true);
        if (intersects.length > 0) {
            let nameList = [];
            for (let i of intersects)
                if (i.object.name) nameList.push(i.object.name);
            if (nameList == []) {                
                this.updateTag(new THREE.Vector2(), ``);
                return;
            }
            this.showInfo(nameList, (name, info) => {
                let map = new Map([
                    [-1, () => {this.updateTag({x: event.clientX, y: event.clientY}, info);}],
                    [0, () => {document.dispatchEvent(new CustomEvent('mfInsert', {detail: { name: name, info: info }}));}]
                ]);
                let arr = [];
                for (let index of map)
                    arr.push(index[0]);
                if (arr.includes(type)) map.get(type)();
            });
        }
        else this.updateTag(new THREE.Vector2(), ``);
    }

    showInfo = (nameList, callback) => {
        this.getJSON(nameList[0], info => {
            if (info != ``) callback && callback(nameList[0], info);
            else 
                if (nameList.length < 2) callback && callback(``, ``);
                else this.showInfo(nameList.splice(0, 1), callback);
        })
    }

    /**
     * @Author         : 杨洋
     * @Date           : 2021-10-28 14:54:52
     * @param           {*} key         key值
     * @param           {*} callback    回调
     * @Description    : 读取json文件
     */
    getJSON(key, callback) {
        let loader = new THREE.FontLoader();
        loader.load(this.jsonUrl, info => {
            let dataList = info.data.infoList;
            let result = false;
            dataList.forEach(data => {
                if (data.name == key) {
                    result = true;
                    callback && callback(data.info);
                }
            });
            if (!result) callback && callback('');
        });
    }

    /**
     * @Author         : 杨洋
     * @Date           : 2021-10-25 17:02:18
     * @param           {*} posi        鼠标所在位置
     * @param           {*} info        展示信息内容
     * @param           {*} active      是否展示
     * @Description    : 更新信息指示
     */
    updateTag(posi, info = ``) {
        this.div.style.left = (posi.x - (parseInt(this.size.width) / 2)) + 'px';
        this.div.style.top = (posi.y - (parseInt(this.size.height))) + 'px';
        this.div.style.display = info != '' ? '' : 'none';
        this.div2.style.top = '10%';
        this.div2.innerHTML = info;
    }

}

export {TagInfo};