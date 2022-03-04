/*
 * @Author         : 杨洋
 * @Date           : 2021-10-12 11:39:59
 * @lastTime       : 2021-10-25 10:22:44
 * @文件相对于项目的路径     : \three\examples\js\p2p\PointArrow.js
 * @Description    : 2点之间创建指向箭头
 */
class PointArrow {

    startP;
    endP;
    midP;
    times;
    img = 'textures/jt.jpg';
    color = 0x00ff00;
    nMax;
    mesh = null;
    distance;
    isLoadTexture;
    lineMaterial;
    headSize = 10;

    constructor(startP, endP, times, lineMaterial, isLoadTexture = false) {
        startP.z = Math.abs(startP.z);
        endP.z = Math.abs(endP.z);
        this.startP = startP;
        this.endP = endP;
        this.times = times;
        this.isLoadTexture = isLoadTexture;
        this.lineMaterial = lineMaterial;
        this.distance = this.startP.distanceTo(this.endP);
        let tempX = (this.endP.x - this.startP.x) / 2 + this.startP.x;
        let tempY = this.startP.y > this.endP.y ? (this.startP.y + (this.distance / 8)) : (this.endP.y + (this.distance / 8));
        let tempZ = (this.endP.z - this.startP.z) / 2 + this.startP.z;
        this.midP = new THREE.Vector3(tempX, tempY, tempZ);
    }

    Move2Point(callback) {
        let curve = this.GetCurve();
        let tubeGeometry = this.CreateTube(curve);
        this.nMax = tubeGeometry.attributes.position.count;
        this.LoadTexture(tubeGeometry, callback);
    }

    GetCurve() {
        return new THREE.CatmullRomCurve3([
            this.startP,
            this.midP,
            this.endP
        ]);
    }

    CreateTube(curve) {
        let tubeGeometry = new THREE.TubeGeometry(curve, 100, 3, 2, false);
        return new THREE.BufferGeometry().fromGeometry(tubeGeometry);
    }

    LoadTexture(tubeGeometry, callback) {
        if (this.isLoadTexture) {
            let textureLoader = new THREE.TextureLoader();
            textureLoader.load(this.img, texture => {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.x = 10;
                    texture.repeat.y = 2;
                    texture.offset.y = 1;
                    let material = new THREE.MeshBasicMaterial({
                        map: texture,
                        transparent: true,
                        side: THREE.DoubleSide
                    });
                    setInterval(() => {
                        texture.offset.x -= 25e-4;
                    });
                    this.mesh = new THREE.Mesh(tubeGeometry, material);
                    this.CreateMesh(callback);
                },
                undefined,
                err => {
                    console.error(err);
                });
        } else {
            let material = this.lineMaterial ? this.lineMaterial : new THREE.MeshBasicMaterial({
                color: this.color,
                side: THREE.DoubleSide
            });
            this.mesh = new THREE.Mesh(tubeGeometry, material);
            this.CreateMesh(callback);
        }
    }

    CreateMesh(callback) {
        let nEnd = 0;
        let length = (~~(this.distance) + '').length;
        let temp = 6 * (10 ** (length - 3));
        let step = (this.distance / (this.times * temp));
        let interval = setInterval(() => {
            nEnd = (nEnd + step) % this.nMax;
            if (this.mesh && this.mesh.geometry)
                this.mesh.geometry.setDrawRange(0, nEnd);
            if (nEnd >= (this.nMax - 100)) {
                clearInterval(interval);
                this.CreateHead();
            }
        }, 25);
        callback && callback(this.mesh);
    }

    IsS2B() {
        if (this.startP.x > this.endP.x)
            return false;
        return true;
    }

    CreateHead() {
        let geometry = new THREE.Geometry();
        let temp = this.IsS2B() ? 1 : -1;
        geometry.vertices.push(new THREE.Vector3(this.headSize * temp, 0, 0));
        geometry.vertices.push(new THREE.Vector3(0, 0, this.headSize));
        geometry.vertices.push(new THREE.Vector3(0, 0, -this.headSize));
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        let material = this.lineMaterial ? this.lineMaterial : new THREE.MeshBasicMaterial({
            color: this.color,
            side: THREE.DoubleSide
        });
        let lmesh = new THREE.Mesh(geometry, material);
        let lan = (~~(this.distance / 100) - 1);
        // lmesh.position.set(this.endP.x + (this.isS2B() ? -(lan * 7.8 + 10) : (lan * 7.8 + 10)), this.endP.y + (lan * 2.2 + 3.5), this.endP.z);
        lmesh.position.set(this.endP.x + (-(lan * 7.8 + 10) * temp), this.endP.y + (lan * 2.2 + 3.5), this.endP.z);
        let rot = Math.atan2((this.midP.x - this.endP.x), (this.midP.z - this.endP.z));
        // lmesh.rotation.set(0, 0, this.isS2B() ? (1 - Math.abs(rot)) : (Math.abs(rot) - 1));
        lmesh.rotation.set(0, 0, (1 - Math.abs(rot)) * temp);
        this.mesh.add(lmesh);
    }

}

export {
    PointArrow
};