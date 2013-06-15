/* Prototype collision */

var Ball = document.getElementById('ball');
var Stage = document.getElementById('stage');
var Player = document.getElementById('player');
var Computer = document.getElementById('computer');

var horizontalSpeed = 1;
var verticalSpeed = 1;
var playerStep = 5;

function revertHorizontalSpeed(){
    horizontalSpeed *= -1;}

function revertVerticalSpeed(){
    verticalSpeed *= -1;}

function checkInternalCollision(obj, box){
    // Devemos desprezar a altura e largura do objeto
    obj.style.left = obj.offsetLeft + horizontalSpeed;
    obj.style.top = obj.offsetTop + verticalSpeed;

    return [((obj.offsetLeft >= (box.offsetWidth - obj.offsetWidth)) || (obj.offsetLeft <= 0)),
        ((obj.offsetTop >= (box.offsetHeight - obj.offsetHeight)) || (obj.offsetTop <= 0))];
};

function checkRevertion(){
    var internalCollisions = checkInternalCollision(Ball, Stage);

    var playerCollision = checkCollision(Ball, Player);
    var computerCollision = checkCollision(Ball, Computer);

    var direction = null;

    if(playerCollision[0])
        direction = getDirection(playerCollision[1], Ball, Player);
    else if(computerCollision[0])
        direction = getDirection(computerCollision[1], Ball, Computer);
    // Nesse caso teorico toda colisão horizontal é score.
    // Verifica se é necessário reversão
    if(internalCollisions[0] || direction == 'horizontal' || direction == 'both'){
        revertHorizontalSpeed();
    }

    if(internalCollisions[1] || direction == 'vertical' || direction == 'both'){

        if( direction == 'vertical' || direction == 'both'){
            // Push prototype bugfix
            if (keyState[38])
                Ball.style.top = Ball.offsetTop - playerStep;
            if (keyState[40])
                Ball.style.top = Ball.offsetTop + playerStep;}

        revertVerticalSpeed();
    }
}

function getDirection(collisionResults, source, target){
    // Aqui eu SEI que existe a colisão, agora baseado na forma do retângulo de colisão eu faço a reversão
    // Se for maior na horizontal o retangulo, inverte somente o vertical
    // Se for maior na vertical o retangulo, inverte semente na horizontal
    
    for(var i in collisionResults)
        collisionResults[i] = collisionResults[i]? '1': '0';
    collisionResults = collisionResults.join('');

    console.log(collisionResults);

    // Width, Height
    var rectangle = null,
        direction = null;

    switch(collisionResults){
        case '1011':
        case '1110':
            //Hrz
            direction = 'horizontal';
        break;

        case '1101':
        case '0111':
            //Vrt
            direction = 'vertical';
        break;

        case '1001':
            //Top-left
            rectangle = [
                (source.offsetLeft + source.offsetWidth) - target.offsetLeft,
                (source.offsetTop + source.offsetHeight) - target.offsetTop]
        break;
        case '1100':
            //Top-Right
            rectangle = [
                (target.offsetLeft + target.offsetWidth) - source.offsetLeft,
                (source.offsetTop + source.offsetHeight) - target.offsetTop]
        break;
        case '0011':
            //Bottom-left
            rectangle = [
                (source.offsetLeft + source.offsetWidth) - target.offsetLeft,
                (target.offsetTop + target.offsetHeight) - source.offsetTop]
        break;
        case '0110':
            //Bottom-Right
            rectangle = [
                (target.offsetLeft + target.offsetWidth) - source.offsetLeft,
                (target.offsetTop + target.offsetHeight) - source.offsetTop]
        break;}

    // 0 -> Width
    // 1 -> Height
    if(rectangle){
        if(rectangle[0] > rectangle[1])
            direction = 'vertical';
        else if(rectangle[1] > rectangle[0])
            direction = 'horizontal';
        else if(rectangle[1] == rectangle[0])
            direction = 'both';}

    return direction;
}

function checkCollision(source, target){
    // Adicionar tratamento de colisão somente quando estiver perto
    // Fiz colisão simples sem o contido-em, pois não vem ao caso...
    // Horizontal
    // LEFT1 < LEFT2 && LEFT2 < RIGHT1 (Comming from Left)
    var horizontalCollisionFromLeft = (source.offsetLeft < target.offsetLeft) && (target.offsetLeft < (source.offsetLeft + source.offsetWidth));
    // LEFT1 < RIGHT2 && RIGHT2 < RIGHT1 (Comming from Right)
    var horizontalCollisionFromRight = (source.offsetLeft < (target.offsetLeft + target.offsetWidth)) && ((target.offsetLeft + target.offsetWidth) < (source.offsetLeft + source.offsetWidth));
    //  ST < TT && TB < SB
    //var horizontalCollisionInside = (target.offsetLeft < source.offsetLeft) && ((source.offsetLeft + source.offsetWidth) < (target.offsetLeft + target.offsetWidth));
    var horizontalCollisionInside = (target.offsetLeft < source.offsetLeft) && ((source.offsetLeft + source.offsetWidth) < (target.offsetLeft + target.offsetWidth));

    var horizontalCollision = horizontalCollisionFromLeft || horizontalCollisionFromRight || horizontalCollisionInside;
        
    // Vertical
    // TOP1 < TOP2 && TOP2 < BOTTOM1 (Comming from up)
    var verticalCollisionFromTop = (source.offsetTop < target.offsetTop) && (target.offsetTop < (source.offsetTop + source.offsetHeight));
    // TOP1 < BOTTOM2 && BOTTOM2 < BOTTOM1 (Comming from Bottom)
    var verticalCollisionFromBottom = (source.offsetTop < (target.offsetTop + target.offsetHeight)) && ((target.offsetTop + target.offsetHeight) < (source.offsetTop + source.offsetHeight));
    // SOURCE TOP < TARGET TOP && SOURCE BOTTOM < TARGET BOTTOM
    var verticalCollisionInside = (target.offsetTop < source.offsetTop) && ((source.offsetTop + source.offsetHeight) < (target.offsetTop + target.offsetHeight));

    var verticalCollision = verticalCollisionFromTop || verticalCollisionFromBottom || verticalCollisionInside;

    /*console.clear();
    console.log('source' + '|' + source.offsetLeft.toString() + '|' + source.offsetTop.toString() + '|' + source.offsetWidth.toString() + '|' + source.offsetHeight.toString());
    console.log('target' + '|' + target.offsetLeft.toString() + '|' + target.offsetTop.toString() + '|' + target.offsetWidth.toString() + '|' + target.offsetHeight.toString());
    console.log('horizontal Collisions: Left: ' + horizontalCollisionFromLeft.toString() + ' Right: ' + horizontalCollisionFromRight.toString() + ' Inside: ' + horizontalCollisionInside.toString());
    console.log('vertical Collisions: Top: ' + verticalCollisionFromTop.toString() + ' Bottom: ' + verticalCollisionFromBottom.toString() + ' Inside: ' + verticalCollisionInside.toString());*/

    return [horizontalCollision && verticalCollision, 
    [   verticalCollisionFromTop || verticalCollisionInside, 
        horizontalCollisionFromRight || horizontalCollisionInside, 
        verticalCollisionFromBottom || verticalCollisionInside, 
        horizontalCollisionFromLeft || horizontalCollisionInside]];}

function check(){
    checkRevertion();}

setInterval(check, 1);

// Key Bindings
var keyState = {};
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);

function gameLoop() {

    if (keyState[38]){
        if(Player.offsetTop > 0)
            Player.style.top = Player.offsetTop - playerStep;}
    if (keyState[40]){
        if((Player.offsetTop + Player.offsetHeight) < Stage.offsetHeight)
            Player.style.top = Player.offsetTop + playerStep;}

    if (keyState[87]){
        if(Computer.offsetTop > 0)
            Computer.style.top = Computer.offsetTop - playerStep;}
    if (keyState[83]){
        if((Computer.offsetTop + Computer.offsetHeight) < Stage.offsetHeight)
            Computer.style.top = Computer.offsetTop + playerStep;}
    // redraw/reposition your object here
    // also redraw/animate any objects not controlled by the user
    setTimeout(gameLoop, 10);}
gameLoop();