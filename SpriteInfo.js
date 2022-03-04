/*
 * @Author         : 杨洋
 * @Date           : 2021-10-27 16:51:18
 * @lastTime       : 2021-10-29 14:27:52
 * @文件相对于项目的路径     : \three\examples\js\p2p\SpriteInfo.js
 * @Description    : 信息展示Sprite
 */
class SpriteInfo {

    scene;
    camera;
    img = './textures/dhk.jpg';
    jsonUrl = './js/p2p/info.json';
    sprite;
    context;
    isCreate = false;

    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
    }

    /**
     * @Author         : 杨洋
     * @Date           : 2021-10-27 17:20:42
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
     * @Date           : 2021-10-27 17:20:29
     * @param           {*} event   鼠标事件
     * @Description    : 判断鼠标所处点是否与物体相交
     */
    getIntersectObjects(event) {
        let intersects = this.getRay(event).intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            this.getJSON(intersects[0].object.name, info => {
                this.createText(intersects[0].point, info, true);
            });
        } else {
            this.createText(new THREE.Vector2(), '', false);
        }
    }

    /**
     * @Author         : 杨洋
     * @Date           : 2021-10-28 14:45:16
     * @param           {*} key         key值
     * @param           {*} callback    回调
     * @Description    : 读取json文件
     */
    getJSON(key, callback) {
        let loader = new THREE.FontLoader();
        loader.load(this.jsonUrl, font => {
            let dataList = font.data.deviceInfo;
            dataList.forEach(data => {
                if (data.name == key) {
                    callback && callback(data.info);
                }
            });
        });
    }

    /**
     * @Author         : 杨洋
     * @Date           : 2021-10-28 11:47:37
     * @param           {*} posi    鼠标所在位置
     * @param           {*} info    展示信息内容
     * @param           {*} active  是否展示
     * @Description    : 创建或更新文本精灵
     */
    createText(posi, info, active = false) {
        let canvas = document.createElement('canvas');
        canvas.width = canvas.height = 300;
        this.context = canvas.getContext('2d');
        this.context.fillStyle = 'blueviolet';
        this.context.fillRect(0, 0, canvas.width, canvas.height);
        this.context.fillStyle = 'white';
        this.context.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
        this.context.fillStyle = 'black';
        this.context.font = '25px arial';
        let count = 0,
            newtext = info.split(''),
            begin_width = 10,
            begin_height = 30,
            lineMax = 11,
            text = '';
        for (let i = 0; i <= info.length; i++) {
            if (count == lineMax) {
                this.context.fillText(text, begin_width, begin_height);
                begin_height += 25;
                text = '';
                count = 0;
            }
            if (i == info.length) {
                this.context.fillText(text, begin_width, begin_height);
            }
            text += newtext[0];
            count++;
            newtext.shift();
        }
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        if (this.sprite == undefined || !this.sprite.visible) {
            let spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                depthTest: false,
                depthWrite: false
            });
            this.sprite = new THREE.Sprite(spriteMaterial);
            this.isCreate = true;
        }
        this.sprite.scale.set(150, 150, 1);
        this.scene.add(this.sprite);
        this.updateSprite(posi, active);
    }

    /**
     * @Author         : 杨洋
     * @Date           : 2021-10-27 17:20:12
     * @param           {*} posi    鼠标所在位置
     * @param           {*} active  是否展示
     * @Description    : 更新精灵信息
     */
    updateSprite(posi, active = false) {
        if (this.sprite) {
            this.sprite.position.set(posi.x - (posi.x / 2), posi.y - (posi.y / 2), posi.z);
            if (active && this.isCreate) {
                //  渐显效果
                this.sprite.material.opacity = 0;
                let intervalOpacity = setInterval(() => {
                    this.sprite.material.opacity += 1e-2;
                    if (this.sprite.material.opacity >= 1) {
                        clearInterval(intervalOpacity);
                        this.sprite.material.opacity = 1;
                    }
                }, 25);
                //  旋转效果
                let intervalRotation = setInterval(() => {
                    this.sprite.material.rotation -= 625e-4;
                    if (this.sprite.material.rotation <= -Math.PI * 2) {
                        clearInterval(intervalRotation);
                        this.sprite.material.rotation = -Math.PI * 2;
                    }
                }, 25);
                //  缩放效果
                this.sprite.scale.set(0, 0, 1);
                let index = 0, step = 1.5;
                let intervalScale = setInterval(() => {
                    index++;
                    this.sprite.scale.set(index * step, index * step, 1);
                    if (index >= 100) {
                        clearInterval(intervalScale);
                        this.sprite.scale.set(150, 150, 1);
                    }
                }, 25);
                this.isCreate = false;
            }
            this.sprite.visible = active;
            window.showInfo = active;
        }
    }

}

export {
    SpriteInfo
};