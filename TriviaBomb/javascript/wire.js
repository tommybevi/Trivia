import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

class Wire extends THREE.Group {
    constructor(src) {
        super();
        this.src = src;
        this.activeAction = null;
        this.model = null;
        this.mixer = null;
        let loader = new GLTFLoader();
        this.arr = null;
        loader.load(this.src,
            (gltf) => {
                this.model = gltf.scene;
                this.add(this.model);
                this.mixer = new THREE.AnimationMixer(this.model);
                this.arr = gltf.animations;
            }
        );

    }
    update(dt) {
        if (this.mixer != null) {
            this.mixer.update(dt);
        }
    }
}
export { Wire }