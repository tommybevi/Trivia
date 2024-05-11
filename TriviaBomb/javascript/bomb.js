import * as THREE from 'three';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

class Bomb extends THREE.Group{
    constructor() {
        super();
        this.loader = new GLTFLoader();
        this.activeAction = null;
        
        this.bomb = null;
        this.mixerbomb = null;
        this.arrbomb = null;

        this.loader.load('./asset/bomb/bomb.glb',
            (gltf) => {
                this.bomb = gltf.scene;
                this.add(this.bomb);
                this.mixerbomb = new THREE.AnimationMixer(this.bomb);
                this.arrbomb = gltf.animations;
            }
        );
        
    }
    update(dt){
        if (this.mixerbomb != null) {
            this.mixerbomb.update(dt);
        }
    }
    
}
export{Bomb}