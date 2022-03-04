/*
 * @Author         : 杨洋
 * @Date           : 2021-10-22 18:28:26
 * @lastTime       : 2021-11-08 09:34:54
 * @文件相对于项目的路径     : \three\examples\js\p2p\LightRing.js
 * @Description    : 光圈特效
 */
class LightRing {

    pos;
    seconds;
    taScale;
    offset;
    img = ['./textures/jt.jpg', './textures/round1.jpg', './textures/round2.jpg'];
    mesh;

    constructor(pos, seconds, scale = 25, offset = 0) {
        this.pos = pos;
        this.seconds = seconds;
        this.taScale = scale;
        this.offset = offset;
    }

    Show(callback) {
        this.SetMesh(callback);
    }

    SetMesh(callback) {
        new THREE.TextureLoader().load(this.img[2], texture => {
            let geometry = new THREE.PlaneBufferGeometry(100, 100, 30, 30);
            let material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
            });
            this.mesh = new THREE.Mesh(geometry, material);
            this.AutoRotation(callback);
        },
        undefined,
        err => {
            console.log(err);
        });

        // let v = `
        //     varying vec2 vUv;
        //     varying vec4 pos;
        //     void main () {
        //         vUv = uv;
        //         gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        //         pos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        //     }
        // `;
        // let f = `
        //     uniform float time;
        //     varying vec2 vUv;
        //     void main () {
        //         vec2 position = vUv;
        //         float red = abs( sin( position.x * position.y + time / 5.0 ) );
        //         float green = abs( sin( position.x * position.y + time / 4.0 ) );
        //         float blue = abs( sin( position.x * position.y + time / 3.0 ) );
        //         gl_FragColor = vec4( red, green, blue, 1.0 );
        //     }
        // `;
        // let shaderParams = {
        //     time: {
        //         value: 0.0
        //     }
        // };
        // let group = new THREE.Group();
        // for (let i = 0; i < 10; i++) {
        //     let random = Math.random();
        //     random = random < 0.5 ? random + 0.5 : random;
        //     let randomResult = random * ( Math.PI * 2 );
        //     let geometry = new THREE.TorusBufferGeometry(20, 0.1, 2, 200, randomResult);
        //     let edges = new THREE.EdgesGeometry( geometry );
        //     let material = new THREE.ShaderMaterial({
        //         uniforms: shaderParams,
        //         vertexShader: v,
        //         fragmentShader: f
        //     });
        //     let line = new THREE.LineSegments(edges, material);
        //     line.scale.set(this.taScale, this.taScale, this.taScale);
        //     line.rotation.set(Math.PI / 2, 0, 0);
        //     line.position.set(0, (i * (this.taScale / 25) * 10) - 100, 0);
        //     group.add(line);
        // }
        // let secondStep = (Math.PI * 2) / this.seconds; 
        // setInterval(() => {
        //     group.rotation.set(0, group.rotation.y - (secondStep / 20), 0);
        //     shaderParams.time.value += 0.05;
        // }, 25);
        // group.position.set(this.pos.x, this.pos.y, this.pos.z);
        // callback && callback(group);
    }

    AutoRotation(callback) {
        let secondStep = (Math.PI * 2) / this.seconds;
        let result = this.changePivot(0, 0, this.offset, this.mesh);
        setInterval(() => {
            result.rotation.set(0, result.rotation.y - (secondStep / 40), 0);
        }, 25);
        result.position.set(this.pos.x, this.pos.y, this.pos.z);
        callback && callback(result);
    }

    /**
     * @Author         : 杨洋
     * @Date           : 2021-10-25 17:39:23
     * @param           {*} x
     * @param           {*} y
     * @param           {*} z
     * @param           {*} obj
     * @Description    : 通过x,y,z指定旋转中心，obj是要旋转的对象
     */
    changePivot(x, y, z, obj) {
        console.clear()
        console.log(z)
        let wrapper = new THREE.Object3D();
        wrapper.position.set(x, y, z);
        wrapper.add(obj);
        obj.position.set(-x, -y, -z);
        return wrapper;
    }

}

export {
    LightRing
};