
//default screen size
let board;
let boardWidth = 1350;
let boardHeight = 300;
let context;
let bgm;



//dino
let cubeWidth = 50;
let cubeHeight = 50;
let cubeX = 50;
let cubeY = boardHeight - cubeHeight;
let cubeImg;
let cubeImg2;



//spike
let spikeArray = [];

let spike1Width = 50;
let spike2Width = 100;
let spike3Width = 150;

let spikeHeight = 50;
let spikeX = 1350;
let spikeY = boardHeight - spikeHeight;

let spike1Img;
let spike2Img;
let spike3Img;

//physics
let velocityX; //spike moving left speed
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
    cubeWidth = 25;
    cubeHeight = 25;
    cubeX = 25;
    cubeY = boardHeight - cubeHeight;
    gravity = .2;




    spike1Width = 25;
    spike2Width = 50;
    spike3Width = 75;
    spikeHeight = 25;
    spikeY = boardHeight - spikeHeight;
    jumpforce = -5;
    // PC 환경에서 실행할 코드를 여기에 추가
}

let cube = {
    x: cubeX,
    y: cubeY,
    width: cubeWidth,
    height: cubeHeight
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
        
        if (cube.y == cubeY) {
            // 점프
            velocityY = jumpforce;
        }
        jumpBtn.blur(); 
    });

    

    mobileBtn.addEventListener("mousedown", function () {
        
        if (cube.y == cubeY) {
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
    cubeImg = new Image();
    cubeImg.src = "./img/cube.png";
    cubeImg.onload = function () {
        context.drawImage(cubeImg, cube.x, cube.y, cube.width, cube.height);
    }


    spike1Img = new Image();
    spike1Img.src = "./img/spike.png";

    spike2Img = new Image();
    spike2Img.src = "./img/spike2.png";

    spike3Img = new Image();
    spike3Img.src = "./img/spike3.png";

    requestAnimationFrame(update);
    setInterval(placespike, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", moveCube);



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
    cube.y = Math.min(cube.y + velocityY, cubeY); //apply gravity to current cube.y, making sure it doesn't exceed the ground
    context.drawImage(cubeImg, cube.x, cube.y, cube.width, cube.height);

    //spike
    for (let i = 0; i < spikeArray.length; i++) {
        let spike = spikeArray[i];
        spike.x += velocityX;
        context.drawImage(spike.img, spike.x, spike.y, spike.width, spike.height);

        if (detectCollision(dino, spike)) {
            gameOver = true;
            cubeImg.src = "./img/dino-dead.png";
            cubeImg.onload = function () {
                context.drawImage(cubeImg, cube.x, cube.y, cube.width, cube.height);
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
    cubeImg.src = skins[skinIndex]; // 다시 살아난 공룡 이미지로 변경
    cube.y = cubeY; // 공룡 위치 초기화
    velocityY = -10; // 수직 속도 초기화
    spikeArray = []; // 선인장 배열 초기화
    restartBtn.style.display = "none"; // 재시작 버튼 숨기기

    if (pc_state === true) {
        jumpBtn.style.display = "block";
    }
    else if (mobile_state === true) {
        mobileBtn.style.display = "block";
    }


}
function moveCube(e) {

    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && cube.y == cubeY) {
        //jump
        velocityY = jumpforce;
        jumpBtn.blur();
    }
}


function placespike() {
    if (gameOver) {
        return;
    }

    //place spike
    let spike = {
        img: null,
        x: spikeX,
        y: spikeY,
        width: null,
        height: spikeHeight
    }

    let placespikeChance = Math.random(); //0 - 0.9999...

    if (placespikeChance > .90) { //10% you get spike3
        spike.img = spike3Img;
        spike.width = spike3Width;
        spikeArray.push(spike);
    }
    else if (placespikeChance > .70) { //30% you get spike2
        spike.img = spike2Img;
        spike.width = spike2Width;
        spikeArray.push(spike);
    }
    else if (placespikeChance > .50) { //50% you get spike1
        spike.img = spike1Img;
        spike.width = spike1Width;
        spikeArray.push(spike);
    }

    if (spikeArray.length > 10) {
        spikeArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
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
    // 선택된 스킨의 이미지 경로를 cubeImg에 할당
    cubeImg.src = skins[skinIndex];
    board.style.backgroundImage = `url('${bgs[skinIndex]}')`;
    context.fillStyle = textcolor[skinIndex];
}
