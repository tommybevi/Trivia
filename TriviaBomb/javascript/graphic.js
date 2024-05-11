import * as THREE from 'three';
import { Pin } from './pin.js';
import { Heart } from './heart.js';
import { Room } from './room.js';
import { Table } from './table.js';
import { Bomb } from './bomb.js';
import { Wire } from './wire.js';

//indica lo stato del gioco
let gameState = "WAIT";


let gl = null;       // Il canvas in cui renderizzare
let renderer = null; // Il motore di render

let scene = null;    // la scena radice
let camera = null;   // la camera da cui renderizzare la scena
let clock = null;    // Oggetto per la gestione del timinig della scena

let hud = null;
let cameraHud = null;

var oneCall = true;

//personaggio
var pin;

//salva l'ultimo valore delle vite
var lstLifes = lifes;

//array di vite
var arrLives = new Array();

//raycaster per interaggire con la scena
var raycaster = null;

//la stanza del gioco
let room = null;


//la bomba da disinnescare
var bomb = null;

//la tavola
var table = null;

//i vari fili
var greenWire = null;

var blueWire = null;

var yellowWire = null;

//variabile a cui affido l'eventlistener attuale
var eventListener = null;

//audio per il disinnesco del filo
var adDefuse = null;
//variabile che indicano se il filo è stato rimosso
var greenRemoved = false;

var blueRemoved = false;

var yellowRemoved = false;

var audiolistener = null;

//audio sconfitta
var adLose = null;

//var oneRun = true;

//audio bomba disinnescata
var adBombDefused = null;

//beep per il timer
var adBeep = null;

//l'interval per il timer
var beepInterval = null;

//audio per la risposta sbagliata
var adWrongAnswer = null;

//variabile che sta a indicare se il gioco è ancora in corso
var inGame = true;

//variabile che indica se si ha vinto o meno
var won = false;

var adCorrectAnswer = null;

function enterWait() {
  gameState = "WAIT";
}

//qunado si clicca sulla bomba fa l'enterWire()
function onMouseDown(event) {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  const mouseVector = new THREE.Vector3(mouseX, mouseY, 0.5);

  raycaster.setFromCamera(mouseVector, camera);
  const intersects = raycaster.intersectObject(bomb);

  if (intersects.length > 0) {
    enterWire();
  }
}


function initScene() {
  raycaster = new THREE.Raycaster();

  if (renderer != null) return;

  document.getElementById("graphics").innerHTML = "<div id='indications'></div><div id='timer'></div><div id='game'><div id='survey'></div></div>";

  let width = window.innerWidth;
  let height = window.innerHeight;
  document.getElementById("game").style.position = "absolute";
  document.getElementById("game").style.top = height / 35.5 + "vh";
  document.getElementById("game").style.left = width / 35.5 + "vh";

  renderer = new THREE.WebGLRenderer({ antialias: "true", powerPreference: "high-performance" });
  renderer.autoClear = false;
  renderer.setSize(width, height);
  renderer.setClearColor("black", 1);
  renderer.shadowMap.enabled = true;
  document.getElementById("graphics").appendChild(renderer.domElement);

  cameraHud = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
  cameraHud.position.set(0, 0, 0);
  cameraHud.lookAt(0, 0, 0);

  //camera per il gioco
  camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 1000);
  camera.position.set(0, 60, -150);
  camera.lookAt(0, 10.5, -5.5);


  clock = new THREE.Clock();

  //scena per il gioco 
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcc7878);

  room = new Room();

  hud = new THREE.Scene();

  
  //aggiungo tutti i suoni
  audiolistener = new THREE.AudioListener();
  camera.add(audiolistener);

  const aLoader = new THREE.AudioLoader();
  adDefuse = new THREE.Audio(audiolistener);

  aLoader.load("./sounds/defuseWire.mp3",
    function (buffer) {
      adDefuse.setBuffer(buffer);
      adDefuse.setLoop(false);
    });
  adLose = new THREE.Audio(audiolistener);
  aLoader.load("./sounds/explosion.mp3",
    function (buffer) {
      adLose.setBuffer(buffer);
      adLose.setLoop(false);
    });
  adBombDefused = new THREE.Audio(audiolistener);
  aLoader.load("./sounds/defused.mp3",
    function (buffer) {
      adBombDefused.setBuffer(buffer);
      adBombDefused.setLoop(false);
    });
  adBeep = new THREE.Audio(audiolistener);
  aLoader.load("./sounds/beep.mp3",
    function (buffer) {
      adBeep.setBuffer(buffer);
      adBeep.setLoop(false);
    });

  adWrongAnswer = new THREE.Audio(audiolistener);
  aLoader.load("./sounds/wrongAnswer.mp3",
    function (buffer) {
      adWrongAnswer.setBuffer(buffer);
      adWrongAnswer.setLoop(false);
    });

  adCorrectAnswer = new THREE.Audio(audiolistener);
  aLoader.load("./sounds/correctAnswer.mp3",
    function (buffer) {
      adCorrectAnswer.setBuffer(buffer);
      adCorrectAnswer.setLoop(false);
    });
  //inizializza la pedina
  pin = new Pin(scene);
  scene.add(pin);
  pin.position.set(0, 58, -145);
  pin.rotateY(Math.PI);


  //creo la luce
  const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  light.position.set(-4, 6, -9);
  scene.add(light);
  scene.add(camera);

  //creo la luce per la hud
  const l = new THREE.DirectionalLight(0xFFFFFF, 100);
  l.position.set(-4, 10, 16);
  l.lookAt(width / 10, height * 30, 1);
  hud.add(l);

  //creo la tavola
  table = new Table();
  table.rotateY(Math.PI / 2);
  table.position.set(0, 58, -148);
  scene.add(table);

  //creo la bomba
  bomb = new Bomb();
  bomb.rotateY(-Math.PI / 2);
  bomb.position.set(0, 58.65, -148);

  //creo i fili
  greenWire = new Wire('./asset/green_wire/greenWire.glb');
  greenWire.rotateY(-Math.PI / 2);
  greenWire.position.set(0, 58.65, -148);

  blueWire = new Wire('./asset/blue_wire/blueWire.glb');
  blueWire.position.set(0, 58.65, -148);
  blueWire.rotateY(-Math.PI / 2);

  yellowWire = new Wire('./asset/yellow_wire/yellowWire.glb');
  yellowWire.position.set(0, 58.65, -148);
  yellowWire.rotateY(-Math.PI / 2);

  //aggiungo gli elementi alla scena
  scene.add(blueWire);
  scene.add(yellowWire);
  scene.add(greenWire);
  scene.add(bomb);
  scene.add(room);
  //imposto un timeout per far si che si carichi la texture della stanza
  setTimeout(() => { document.getElementById("play").style.display = "block" }, 5000);
  //imposto un timeout altrimenti va in errore perchè non è ancora stata caricata la pedina
  setTimeout(() => { pin.setActiveAction(2); pin.update(clock.getDelta()) }, 2000);

  document.getElementById("play").onclick = enterWalk;
  enterWait();
  document.getElementById("timer").style.fontSize = width / 200 + "vh";
  renderer.setAnimationLoop(animate);
}

//crea la domanda
function doQuestion() {
  createQuiz();
  enterWait();
}

function animate() {
  let dt = clock.getDelta();

  switch (gameState) {
    case "WAIT":
      break;
    case "WALK":
      doWalk(dt);
      break;
    case "LOOKBOMB":
      doBomb(dt);
      break;
    case "WIRES":
      doWire(dt);
      break;
    case "QUESTION":
      doQuestion();
      break;
  }
  //controlla se la risposta data è sbagliata nel caso in cui la gameMode sia NORMAL
  if (lstLifes > lifes && gameMode == "NORMAL") {
    adWrongAnswer.play();
    hud.remove(arrLives[lifes]);
    lstLifes = lifes;
  }
  checkLose();
  checkWin(dt);
  if (gameMode == "NORMAL") {
    checkWire();
  }
  //controlla se la risposta data è sbagliata o giusta nel caso in cui la gameMode sia TIMED MODE
  if(gameMode == "TIMED MODE" && points > lstPoints){
    lstPoints = points;
    adCorrectAnswer.play();
  }
  else if(gameMode == "TIMED MODE" && points < lstPoints){
    lstPoints = points;
    adWrongAnswer.play();
  }
  pin.update(dt);
  renderer.clear();
  renderer.render(scene, camera);
  renderer.render(hud, cameraHud);
}

//controlla se c'è un filo da rimuovere
function checkWire() {
  if (wire == "GREEN") {
    scene.remove(greenWire);
    greenRemoved = true;
    adDefuse.play();
  }
  else if (wire == "YELLOW") {
    scene.remove(yellowWire);
    yellowRemoved = true;
    adDefuse.play();
  }
  else if (wire == "BLUE") {
    scene.remove(blueWire);
    blueRemoved = true;
    adDefuse.play();
  }
  wire = "";
}

//controllo per la sconfitta
function checkLose() {
  if (((lifes == 0 || (minutes == 0 && seconds == 0)) && inGame && gameMode == "NORMAL")||(minutes == 0 && seconds == 0 && inGame && gameMode == "TIMED MODE" && points < 25)) {
    adLose.play();
    inGame = false;
    document.getElementById("graphics").style.display = "none";
    document.getElementById("mask").innerHTML = "<h1>YOU LOSE!!</h1>";
    document.getElementById("content").innerHTML += "<div id = button>PLAY AGAIN</div>";
    document.getElementById("button").onclick = reloadPage;
    document.getElementById("mask").style.display = "block";
    clearInterval(beepInterval);
  }
}

//funzione per ricaricare la pagina
function reloadPage() {
  //if(!oneRun){
  window.location.reload(true);
  //}
  //oneRun = false;
}


function enterWire() {
  gameState = "WIRES";
}

//funzione con raycaster per interagire coi cavi
function clickWires(event) {
  if (!inQuestion) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    const mouseVector = new THREE.Vector3(mouseX, mouseY, 0);

    var greenIntersects;
    var blueIntersects;
    var yellowIntersects;

    raycaster.setFromCamera(mouseVector, camera);
    //se i fili son stati rimossi non cerca le intersezioni
    if (!greenRemoved) {
      greenIntersects = raycaster.intersectObject(greenWire.model.children[0], true);
    }
    if (!blueRemoved) {
      blueIntersects = raycaster.intersectObject(blueWire.model.children[0], true);
    }
    if (!yellowRemoved) {
      yellowIntersects = raycaster.intersectObject(yellowWire.model.children[0], true);
    }

    //controlla il click del mouse con le intersezioni
    if (greenIntersects && greenIntersects.length > 0) {
      category = 15;
      console.log("clicked");
      enterQuestion();
    }
    if (blueIntersects && blueIntersects.length > 0) {
      category = 18;
      console.log("clicked");
      enterQuestion();
    }
    if (yellowIntersects && yellowIntersects.length > 0) {
      category = 27;
      console.log("clicked");
      enterQuestion();
    }
  }
}

//controlla se si ha vinto
function checkWin(dt) {
  if ((yellowRemoved && blueRemoved && greenRemoved && inGame && gameMode == "NORMAL")||(gameMode == "TIMED MODE" && inGame && seconds == 0 && minutes == 0 && points >=25)) {
    console.log("vinto");
    clearInterval(timer);
    inGame = false;
    camera.lookAt(pin.position.x, pin.position.y + 0.5, pin.position.z);
    document.getElementById("timer").style.display = "none";
    won = true;
    adBombDefused.play();
    pin.reset();
    pin.setActiveAction(0);
    clearInterval(beepInterval);
  }
  if (won) {
    if (camera.position.distanceTo(new THREE.Vector3(pin.position.x, pin.position.y + 2, pin.position.z - 1)) >= 0.05) {
      camera.position.lerp(new THREE.Vector3(pin.position.x, pin.position.y + 2, pin.position.z - 1), dt);
    }
    else {
      camera.position.set(pin.position.x, pin.position.y + 2, pin.position.z - 1);
    }

    document.getElementById("indications").innerHTML = "<h1>CONGRATULATIONS, YOU WON!!!</h1>"
  }
}

function enterQuestion() {
  gameState = "QUESTION";
}

//avvicina la camera ai fili della bomba per poter effettuare la scelta
function doWire(dt) {
  if (camera.position.distanceTo(new THREE.Vector3(0, 58.9, -148)) >= 0.1) {
    camera.position.lerp(new THREE.Vector3(0, 58.9, -148), dt);
  }
  else {
    document.removeEventListener("mousedown", eventListener);
    eventListener = document.addEventListener("mousedown", clickWires);
    document.getElementById("timer").style.display = "block";
    document.getElementById("timer").style.top = window.innerHeight / 22 + "vh";
    document.getElementById("timer").style.left = window.innerWidth / 22 + "vh";
    if (oneCall) {
      timer = setInterval(() => updateTimer(), 1000);
      beepInterval = setInterval(() => { adBeep.play(); }, 1000);
      oneCall = false;
    }
    document.getElementById("indications").innerHTML = "<h1>CHOOSE A WIRE TO START DEFUSING</h1>";
    enterWait();
  }
}

//posiziona l'inquadratura sulla bomba
function doBomb(dt) {
  if (camera.position.distanceTo(new THREE.Vector3(0, 59.7, -147.5)) >= 0.1) {
    camera.position.lerp(new THREE.Vector3(0, 59.7, -147.5), dt);
  }
  else {
    camera.rotateY(Math.PI);
    camera.lookAt(0, 58.65, -148);
    eventListener = document.addEventListener("mousedown", onMouseDown);
    document.getElementById("indications").innerHTML = "<h1>CLICK ON THE BOMB TO DEFUSE</h1>";
    document.getElementById("indications").style.left = window.innerWidth / 50 + "vh";
    enterWait();
  }
}

//entra in camminata
function enterWalk() {
  gameMode = document.mode.gamemode.value;
  console.log(gameMode)
  if(gameMode == ""){
    gameMode = "NORMAL";
  }
  console.log(gameMode)
  let width = window.innerWidth;
  let height = window.innerHeight;
  //vite
  if (gameMode == "NORMAL") {
    for (let i = 0; i < lifes; i++) {
      arrLives[i] = new Heart();
      hud.add(arrLives[i]);
      arrLives[i].position.set(width / 4.4 + i * width / 17, height / 4, 1);
    }
  }
  document.getElementById("mask").style.display = "none";
  document.getElementById("play").style.display = "none";
  document.getElementById("graphics").style.display = "block";
  setTimeout(() => {
    pin.setActiveAction(3);
    gameState = "WALK";
  }, 2000);

}

//il personaggio cammina verso la bomba
function doWalk(dt) {
  if (pin.position.distanceTo(new THREE.Vector3(0, 58, -147)) <= 0.1) {
    pin.position.set(0, 58, -147);
    pin.reset();
    pin.setActiveAction(2);
    gameState = "LOOKBOMB";
  }
  else {
    pin.position.lerp(new THREE.Vector3(0, 58, -147), dt);
  }
}
window.onload = initScene;