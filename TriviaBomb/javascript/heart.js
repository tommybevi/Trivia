import * as THREE from 'three';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

class Heart extends THREE.Group{
    constructor() {
        super();
        this.loader = new GLTFLoader();
        this.activeAction = null;
        
        this.heart = null;
        this.mixerHeart = null;
        this.arrHeart = null;

        this.loader.load('./asset/heart/heart.glb',
            (gltf) => {
                this.heart = gltf.scene;
                this.add(this.heart);
                this.mixerHeart = new THREE.AnimationMixer(this.heart);
                this.arrHeart = gltf.animations;
            }
        );
        
    }
    update(dt){
        if (this.mixerHeart != null) {
            this.mixerHeart.update(dt);
        }
    }
    
}
export{Heart}