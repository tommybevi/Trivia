import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

class Pin extends THREE.Group {
    constructor(scene) {
        super();
        this.activeAction = null;
        this.model = null;
        this.scene = scene;
        this.mixer = null;
        let loader = new GLTFLoader();
        this.arr = null;
        loader.load('./asset/character/character.glb',
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
    //resetta le animazioni
    reset(){
        this.mixer.stopAllAction();
    }
    //permette di impostare le animazioni
    setActiveAction(index){
        this.activeAction = null;
        this.activeAction = this.mixer.clipAction(this.arr[index]);
        this.activeAction.play();
    }
}
export { Pin }