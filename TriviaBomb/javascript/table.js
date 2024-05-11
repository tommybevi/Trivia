import * as THREE from 'three';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

class Table extends THREE.Group{
    constructor() {
        super();
        this.loader = new GLTFLoader();
        this.activeAction = null;
        
        this.table = null;
        this.mixerHeart = null;
        this.arrHeart = null;

        this.loader.load('./asset/table/table.glb',
            (gltf) => {
                this.table = gltf.scene;
                this.add(this.table);
                this.mixerHeart = new THREE.AnimationMixer(this.table);
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
export{Table}