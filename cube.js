
//default screen size
let board;
let boardWidth = 1350;
let boardHeight = 300;
let context;
let bgm;



//dino
let dinoWidth = 50;
let dinoHeight = 50;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;
let dinoImg2;



//cactus
let cactusArray = [];

let cactus1Width = 50;
let cactus2Width = 100;
let cactus3Width = 150;

let cactusHeight = 50;
let cactusX = 1350;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX; //cactus moving left speed
let velocityY = 0;
let gravity = .2;

let gameOver = false;
let score = 0;

let pc_state = true;
let mobile_state = false;

let restartBtn;
let jumpBtn
let mobileBtn
let jumpforce = -8;
let windowWidth = window.innerWidth;
let skinIndex = 0;
let changeBtn;
const skins = [
    "./img/cube.png",
    "./img/cube2.png"

];

const bgs = [
    "./img/bg.jpg",
    "./img/bg2.png"
];



const textcolor = ["black", "white"];

if (windowWidth < 1000) {
    mobile_state = true;
    pc_state = false;
    // PC 환경에서 실행할 코드
    console.log("PC 환경입니다.");
    boardWidth = 350;
    boardHeight = 300;
    dinoWidth = 25;
    dinoHeight = 25;
    dinoX = 25;
    dinoY = boardHeight - dinoHeight;
    gravity = .2;




    cactus1Width = 25;
    cactus2Width = 50;
    cactus3Width = 75;
    cactusHeight = 25;
    cactusY = boardHeight - cactusHeight;
    jumpforce = -5;
    // PC 환경에서 실행할 코드를 여기에 추가
}

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

window.onload = function () {


    bgm = document.getElementById("bgm");
    bgm.currentTime = 0;
   
    restartBtn = document.getElementById("restartBtn"); // 버튼 요소 찾기
    jumpBtn = document.getElementById("jumpBtn");
    mobileBtn = document.getElementById("mobileBtn");
    changeBtn = document.getElementById("changeBtn");
    board = document.getElementById("board");

    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board
    restartBtn.addEventListener("click", restartGame);


    bgm.play();



    jumpBtn.addEventListener("mousedown", function () {
        
        if (dino.y == dinoY) {
            // 점프
            velocityY = jumpforce;
        }
        jumpBtn.blur(); 
    });

    

    mobileBtn.addEventListener("mousedown", function () {
        
        if (dino.y == dinoY) {
            // 점프
            velocityY = jumpforce;
        }
        mobileBtn.blur(); 
    });

    changeBtn.addEventListener("click", function (event) {
        event.preventDefault(); // 기본 이벤트 중지
        changeTheme();
        changeBtn.blur(); 
       
    });



    //draw initial dinosaur
    dinoImg = new Image();
    dinoImg.src = "./img/cube.png";
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }


    cactus1Img = new Image();
    cactus1Img.src = "./img/spike.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/spike2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/spike3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", moveDino);



}

function update() {

    requestAnimationFrame(update);
    if (gameOver) {
        bgm.currentTime = 0;
        bgm.pause();
        context.clearRect(0, 0, board.width, board.height);
        context.fillStyle = textcolor[skinIndex];
        context.font = "30px 'Pixelify Sans', sans-serif";
        context.fillText("Game Over!", boardWidth / 2 - 80, boardHeight / 2 - 20);
        context.fillText(`점수: ${score}`, boardWidth / 2 - 60, boardHeight / 2 + 20);
        restartBtn.style.display = "block"; // 게임이 종료되면 버튼 표시
        jumpBtn.style.display = "none";
        mobileBtn.style.display = "none";

        return;
    }
    context.clearRect(0, 0, board.width, board.height);


    if (pc_state === true) {
        velocityX = -4 - (Math.floor(score / 1000) / 10);
    }
    else if (mobile_state === true) {
        velocityX = -3 - (Math.floor(score / 1000) / 10);
    }




    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    //score
    context.fillStyle = textcolor[skinIndex];
    context.font = "20px 'Pixelify Sans', sans-serif";
    score++;
    context.fillText(score, boardWidth - 50, 25);
}

function restartGame() {
    //bgm.currentTime = 0;
    
    bgm.play();
    gameOver = false; // 게임 상태 초기화
    score = 0; // 점수 초기화
    dinoImg.src = skins[skinIndex]; // 다시 살아난 공룡 이미지로 변경
    dino.y = dinoY; // 공룡 위치 초기화
    velocityY = -10; // 수직 속도 초기화
    cactusArray = []; // 선인장 배열 초기화
    restartBtn.style.display = "none"; // 재시작 버튼 숨기기

    if (pc_state === true) {
        jumpBtn.style.display = "block";
    }
    else if (mobile_state === true) {
        mobileBtn.style.display = "block";
    }


}
function moveDino(e) {

    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        //jump
        velocityY = jumpforce;
    }
}


function placeCactus() {
    if (gameOver) {
        return;
    }

    //place cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //0 - 0.9999...

    if (placeCactusChance > .90) { //10% you get cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { //30% you get cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { //50% you get cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 10) {
        cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function changeTheme() {
    console.log("changeTheme");
    // 현재 skinIndex를 증가시키고 배열 길이로 나눈 나머지를 새로운 skinIndex로 설정
    skinIndex = (skinIndex + 1) % skins.length;
    // 선택된 스킨의 이미지 경로를 dinoImg에 할당
    dinoImg.src = skins[skinIndex];
    board.style.backgroundImage = `url('${bgs[skinIndex]}')`;
    context.fillStyle = textcolor[skinIndex];
}
