const width = window.innerWidth;
const height = window.innerHeight-128;

const PLAYER1 = 1;
const PLAYER2 = 2;
var app;

var ballSpeed = {x : 4, y : 2}
var ball , player1, aiPlayer;
var playerSpeed = 75;
var aiPlayerSpeed = 5;

var player1Score = 0;
var aiPlayerScore = 0;
var score1, aiScore;

var isPlaying = false;
var gameFlowButton;



function drawBall(){
    ball = new PIXI.Graphics();
    ball.lineStyle(0);
    ball.beginFill(0xFFFFFF);
    ball.drawCircle(0, 0, 10);
    ball.endFill();
    ball.x = width/2;
    ball.y = 100;
}

function drawMiddleLine(){
    let line = new PIXI.Graphics();
    line.beginFill(0xFFFFFF);
    line.drawRect(width/2-4, 0, 8, height);
    line.endFill();
    return line;
}

function drawBars(){
    player1 = new PIXI.Graphics();
    player1.beginFill(0xFFFFFF);
    player1.drawRect(5, 0, 10, 75);
    player1.y = height/2-player1.height/2;
    player1.endFill();

    aiPlayer = new PIXI.Graphics();
    aiPlayer.beginFill(0xFFFFFF);
    aiPlayer.drawRect(width-15, 0, 10, 75);
    aiPlayer.y = height/2-aiPlayer.height/2;
    aiPlayer.endFill();
}

function setupGame(){
    gameFlowButton = document.getElementById('gameFlowButton')
    app = new PIXI.Application({'width':width, 'height':height});
    document.getElementsByTagName('section')[0].appendChild(app.view);
    drawField();
    setupTicker();
    manageKeyEvents();
}

function onGameFlowButtonPressed(){
    if(isPlaying){
        isPlaying = false;
        gameFlowButton.innerText = 'Play';
    }else{
        isPlaying = true;
        gameFlowButton.innerText = 'Pause';
    }
}

function pause(){
    isPlaying = false;
}

function play(){
    ball.x = width/2;
    ball.y = 50;
    ballSpeed.x = [ballSpeed.x, -ballSpeed.x][Math.floor(Math.random() * 2)];
    ballSpeed.y = Math.abs(ballSpeed.y);
    isPlaying = true;
}

function drawField(){
    drawBall();
    drawBars();
    drawScores();
    app.stage.addChild(drawMiddleLine());
    app.stage.addChild(drawCopyRight())
    app.stage.addChild(ball);
    app.stage.addChild(player1);
    app.stage.addChild(aiPlayer);
    app.stage.addChild(score1);
    app.stage.addChild(aiScore);
}

function drawCopyRight(){
    let copyRight = 'Made by Woobensky Pierre: 2021';
    let text = new PIXI.Text(copyRight, new PIXI.TextStyle({fill:['#ffffff'], fontSize: 16}))
    text.x = width - text.width - 15;
    text.y = height-text.height-15;
    return text;
}
function drawScores(){
    score1 = new PIXI.Text(player1Score, new PIXI.TextStyle({fill:['#ffffff']}))
    score1.x = width/2-score1.width-15;
    score1.y = 15;

    aiScore = new PIXI.Text(aiPlayerScore, new PIXI.TextStyle({fill:['#ffffff']}))
    aiScore.x = width/2+15;
    aiScore.y = 15;
}

function setupTicker(){
    app.ticker.add((delta) => {
        if(isPlaying) {
            moveBall();
            moveAiPlayer();
            checkLostEvent(onLostEvent);
            manageBallCollision();
        }
    });
}

function moveAiPlayer(){
    if(ballSpeed.x>1){
        if((ballSpeed.y>1 && aiPlayer.y+aiPlayer.height<ball.y) || ballSpeed<1 && aiPlayer.y+aiPlayer.height>ball.y) {
            aiPlayer.y += aiPlayerSpeed;
        }else if((ballSpeed.y<1 && aiPlayer.y>ball.y) || ballSpeed.y>1 && aiPlayer.y>ball.y){
            aiPlayer.y -= aiPlayerSpeed;
        }
    }
}

function manageBallCollision(){
    if (ball.x - ball.width / 2 < 15 && ball.y+ball.width-5 > player1.y && ball.y < player1.y + player1.height) {
        ballSpeed.x -= 1;
        ballSpeed.x = -ballSpeed.x;
        console.log('hit player1');
    } else if (ball.x + ball.width / 2 > width - 15 && ball.y+ball.width-5 > aiPlayer.y && ball.y < aiPlayer.y + aiPlayer.height) {
        console.log('hit aiPlayer');
        ballSpeed.x += 1;
        ballSpeed.x = -ballSpeed.x;
    }

    if (ball.y < ball.height / 2 || ball.y > (height - ball.height / 2)) {
        ballSpeed.y = -ballSpeed.y;
    }
}

function moveBall(){
    ball.x += ballSpeed.x;
    ball.y += ballSpeed.y;
}
function checkLostEvent(callBack){
    if(ball.x < 0){
        callBack(PLAYER1)
    }else if(ball.x > width-ball.width/2){
        callBack(PLAYER2);
    }
}
function onLostEvent(player){
    pause();
    ballSpeed = {x: 4, y: 2}
    let message;
    if(player === PLAYER1){
        aiPlayerScore += 1;
        aiScore.text = aiPlayerScore;
        message = 'player ' + player + ' lost';
    }else{
        player1Score += 1;
        score1.text = player1Score;
        message = 'player ' + player + ' lost';
    }
    window.alert(message);
    if(window.confirm("Do you want to play again?")){
        play();
    }
}

var startTouchY = 0;
function manageKeyEvents(){
    window.addEventListener('keydown', (e)=>{
        if(e.key==='ArrowUp'){
            if(player1.y > 0){
                player1.y -= playerSpeed;
            }
        }else if(e.key==='ArrowDown'){
            if(player1.y < height-player1.height){
                player1.y += playerSpeed;
            }
        }
    });
    app.view.addEventListener('touchstart', (e)=>{startTouchY = e.targetTouches[0].pageY});
    app.view.addEventListener('touchmove', (e)=>{
        player1.y += (e.targetTouches[0].pageY-startTouchY);
        startTouchY = e.targetTouches[0].pageY;
        if(player1.y<0){
            player1.y = 0;
        }
        if(player1.y+player1.height > height){
            player1.y = height-player1.height;
        }
    })
}


