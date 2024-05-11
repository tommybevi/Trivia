
class Quiz {
    constructor(correct, incorrect1, incorrect2, incorrect3, question, difficulty) {
        this.correct = correct;
        this.incorrect1 = incorrect1;
        this.incorrect2 = incorrect2;
        this.incorrect3 = incorrect3;
        this.question = question;
        this.difficulty = difficulty;
    }
    getCorrectAnswer() {
        return this.correct;
    }
    getIncorrect1() {
        return this.incorrect1;
    }
    getIncorrect2() {
        return this.incorrect2;
    }
    getIncorrect3() {
        return this.incorrect3;
    }
    getQuestion() {
        return this.question;
    }

    getDifficulty() {
        return this.difficulty;
    }
}

var d;

//var index = 0;

var tmp;

//vite a disposizione
var lifes = 3;


//variabile che serve a dichiarare se il timer è in funzione
var stopped = true;

//difficoltà del gioco
var difficulties = ["easy", "medium", "hard"];

//indica la categoria
var category = 0;

var index = 0;

//variabile che indica il cavo che è stato cliccato
var wire = "";

//dice se si trova nella domanda
var inQuestion = false;

//timer della bomba
var timer;

//tempo di default della bomba
var minutes = 3;

var seconds = 0;

//NORMAL, TIMED MODE
var gameMode = "NORMAL";

var points = 0;

var lstPoints = 0;

//crea la domanda anche quando l'api va in errore 429

async function createQuiz() {
    inQuestion = true;
    let quiz = null;
    let url = 'https://opentdb.com/api.php?amount=1&type=multiple&category=' + category + '&difficulty=' + difficulties[index];
    let response = await fetch(url);
    quiz = (await response.json());
    if (quiz.response_code == 0) {
        tmp = quiz.results[0];
        console.log(tmp);
        if (tmp) {
            d = new Quiz(tmp.correct_answer, tmp.incorrect_answers[0], tmp.incorrect_answers[1], tmp.incorrect_answers[2], tmp.question, tmp.difficulty);
            loadQuestion(d);
        }
    } else {
        setTimeout(createQuiz(),4000);
    }
}


//carica la domanda
function loadQuestion(d) {
    stopped = false;
    var arr = [d.getCorrectAnswer(), d.getIncorrect1(), d.getIncorrect2(), d.getIncorrect3()];
    arr = mescola(arr);
    document.getElementById("game").style.display = "block";
    document.getElementById("survey").innerHTML +=
        "<div><form name='modulo'><div id='modulo'><label>" + d.getQuestion() + "</label></div></form></div>"
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] != null) {
            document.getElementById("modulo").innerHTML += '<div><input name="risposta" type="radio" value="' + arr[i] + '">' + arr[i] + '</input></div>';
        }
    }
    document.getElementById("survey").innerHTML += "<input type='button' onclick='conferma()' value='Submit'></input>"
}

//mescola l'array
function mescola(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


function conferma() {
    //se vera aumenta i secondi come bonus altrimenti diminuisce le vite
    if (document.modulo.risposta.value == d.getCorrectAnswer()) {
        if(gameMode == "NORMAL"){
            index++;
        }
        else{
            //se mi trovo in TIMED MODE aggiungo punti e genero una difficoltà a caso
            points+=2;
            console.log(points);
            index = Math.round(Math.random()*3);
        }
        if (category == 15) {
            wire = "GREEN";
        }
        else if (category == 18) {
            wire = "BLUE"
        }
        else {
            wire = "YELLOW";
        }
        //aumento di 30 secondi il timer
        seconds += 30;
        if (seconds > 59) {
            seconds -= 60;
            minutes++;
        }
    }
    //se il gamMode è NORMAL e la risposta è sbagliata rimuovo una vita
    else if(gameMode == "NORMAL") {
        lifes--;
    }
    //se mi trovo in TIMED MODE riduco i punti
    else{
        points--;
        
    }
    stopped = true;
    setTimeout(() => control(), 300);
}

//controlla se ci sono vite
function control() {
    if (lifes > 0) {
        document.getElementById("graphics").style.display = "block";
        document.getElementById("game").style.display = "none";
        document.getElementById("survey").innerHTML = "<div id='infoBar'></h1></div>";
        inQuestion = false;
    }
    if (minutes == 0 && seconds == 0) {
        clearInterval(timer);
    }

}


function updateTimer() {
    if (seconds == 0) {
        minutes--;
        seconds = 59;
    }
    else {
        seconds--;
    }
    document.getElementById("timer").innerHTML = "<div id='timer'>" + minutes + "m " + seconds + "s" + "</div>";
}