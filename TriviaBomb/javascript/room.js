import * as THREE from 'three';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';


class Room extends THREE.Group{
    constructor() {
        super();
        this.loader = new GLTFLoader();
        this.activeAction = null;
        
        this.castle = null;
        this.mixerHeart = null;
        this.arrHeart = null;
        this.squares = new Array();

        this.colors = [new THREE.MeshBasicMaterial({ color: 0xFFFF00, side: THREE.DoubleSide }), new THREE.MeshBasicMaterial({ color: 0xf74545, side: THREE.DoubleSide }), new THREE.MeshBasicMaterial({ color: 0x008000, side: THREE.DoubleSide }), new THREE.MeshBasicMaterial({ color: 0x0000FF, side: THREE.DoubleSide })];
        
        this.sq = new THREE.PlaneGeometry(1, 1);

        this.loader.load('./asset/room/room.glb',
            (gltf) => {
                this.castle = gltf.scene;
                this.add(this.castle);
                this.mixerHeart = new THREE.AnimationMixer(this.castle);
                this.arrHeart = gltf.animations;
            }
        );
        
    }
    update(dt){
        if (this.mixerHeart != null) {
            this.mixerHeart.update(dt);
        }
    }
    drawSquares(){
        this.squares[0] = new THREE.Mesh(this.sq, new THREE.MeshBasicMaterial({ color: 0xFFFF00, side: THREE.DoubleSide }));
        this.squares[0].position.set(10, 100, -200);
        this.squares[0].rotateX(Math.PI / 2);
    }
    
}
export{Room}