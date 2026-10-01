import kaplay from 'kaplay';

kaplay();

loadSound("jump", "assets/Sounds/jumpsound.mp3");
loadSound("collect", "assets/Sounds/collect_sound.mp3");
loadSound("fail sound", "assets/Sounds/failsound.mp3");
loadSound("gamestartsound", "assets/Sounds/gamestartsound.mp3");
loadMusic("backgroundmusic", "assets/Sounds/game_sounds.mp3");
loadSprite("player", "assets/character.png");
loadSprite("background", "assets/backgrounds/fondo_05_amanecer.gif");
loadSprite("platform", "assets/island_calm_plain.png");
loadSprite("circle1", "assets/orb_green.png");
loadSprite("circle2", "assets/orb_red.png");
loadSprite("circle3", "assets/orb_blue.png");
loadSprite("circle4", "assets/orb_purple.png");
loadSprite("button1", "assets/orb_green_lit.png");
loadSprite("button2", "assets/orb_red_lit.png");
loadSprite("button3", "assets/orb_blue_lit.png");
loadSprite("button4", "assets/orb_purple_lit.png");
loadSprite("redCube", "assets/block_red.png");
loadSprite("greenCube", "assets/block_green.png");
loadSprite("goodobject1", "assets/warm.png");
loadSprite("goodobject2", "assets/heart.png");
loadSprite("goodobject3", "assets/grow.png");
loadSprite("goodobject4", "assets/hope.png");
loadSprite("goodobject5", "assets/calm.png");
loadSprite("badobject1", "assets/anger.png");
loadSprite("badobject2", "assets/bomb.png");
loadSprite("badobject3", "assets/fear.png");
loadSprite("badobject4", "assets/overthinking.png");
loadSprite("badobject5", "assets/splash.png");
let musicStarted = false;

const goodObjects = [
    "goodobject1",
    "goodobject2",
    "goodobject3",
    "goodobject4",
    "goodobject5"
];

let goodObjectIndex = 0;

const badObjects = [
    "badobject1",
    "badobject2",
    "badobject3",
    "badobject4",
    "badobject5"
];

let badObjectIndex = 0;

const background = add([
    sprite("background"),
    pos(0, 0),
]);

function startMusic() {
    if (musicStarted) return;
    play("backgroundmusic", {
        loop: true,
        volume: 0.5,
    });

    musicStarted = true;
}

// Circles
const circle1 = add([
    sprite("circle1"),
    pos(500, 100),
 
]);

const circle2 = add([
    sprite("circle2"),
    pos(650, 100),
]);


const circle3 = add([
    sprite("circle3"),
    pos(800, 100),
]);

const circle4 = add([
    sprite("circle4"),
    pos(950, 100),
]);

const displayCircles = [circle1, circle2, circle3, circle4];

// circles sequence text
const colorstext = add([
    text("Remember the sequence of colors and click them in the right order!"),
    pos(250, 25),
    color(255, 255, 0),
    scale(0.8),
]);

// Hide circles and text
displayCircles.forEach(circle => circle.hidden = true);
colorstext.hidden = true;

// clickable circles
const button1 = add([
    sprite("button1"),
    pos(650, 250),
    area(),
    body({isStatic: true}),
]);


const button2 = add([
    sprite("button2"),
    pos(500, 250),
    area(),
    body({isStatic: true}),
]);

const button3 = add([
    sprite("button3"),
    pos(950, 250),
    area(),
    body({isStatic: true}),
]);

const button4 = add([
    sprite("button4"),
    pos(800, 250),
    area(),
    body({isStatic: true}),
]);

const buttons = [button1, button2, button3, button4];
buttons.forEach(button => button.hidden = true);

let sequence = [];
let sequenceIndex = 0;
let tiltAmount = 0;
let level = 1;
tiltAmount = Math.max(0, tiltAmount - 2);
let buttonsActive = false;
let cubesActive = false;
let completeSequences = 0;
const totalSequences = 3;

const statusText = add([
    text(""),
    pos(600, 25),
    color(255, 255, 0),
    scale(0.8),
]);

function generateSequence() {
    let newSequence;

    do {
        newSequence = [];
        for (let i = 0; i < 4; i++) {
            newSequence.push(randi(0, 4));
        }
    } while (JSON.stringify(newSequence) === JSON.stringify(sequence));
    sequence = newSequence;
}

async function showSequence() {
    buttonsActive = false;
    buttons.forEach(button => button.hidden = true);
    colorstext.hidden = false;
    displayCircles.forEach(circle => circle.hidden = true);
    await wait(1);
    for (const index of sequence) {
        displayCircles[index].hidden = false;
        await wait(1);
        displayCircles[index].hidden = true;
        await wait(0.5);
    }

    colorstext.hidden = true;
    sequenceIndex = 0;
    buttons.forEach(button => button.hidden = false);
    buttonsActive = true;
}

//Cubes

function createRedCube(x, y) {
    const cube = add([
        sprite(badObjects[badObjectIndex]),
        pos(x, y),
        scale(0.3),
        area(),
        "redCube"
    ]);

    badObjectIndex++;

    if (badObjectIndex === badObjects.length) {
        badObjectIndex = 0;
    }

    return cube;
}

function creatGreenCube(x, y) {
    const cube = add([
        sprite(goodObjects[goodObjectIndex]),
        scale(0.3),
        pos(x, y),
        area(),
        "greenCube"
    ]);

    goodObjectIndex++;

    if (goodObjectIndex === goodObjects.length) {
        goodObjectIndex = 0;
    }

    return cube;
}

// cubes functionality

onUpdate("redCube", (cube) => {
    cube.move(0, 100);
    if (cube.pos.y > 700) {
        destroy(cube);  
    }
});

onUpdate("greenCube", (cube) => {
    cube.move(0, 100);
    if (cube.pos.y > 700) {
        destroy(cube);
        tiltAmount += 2;
    }
});

loop(2, () => {
    if (!cubesActive) return;
    createRedCube(rand(400, 1000), -50);
});

loop(2, () => {
    if (!cubesActive) return;
    creatGreenCube(rand(400, 1000), -50);
});


//Make text and circles appear in sequence
wait(3, () => {
    generateSequence();
    showSequence();
});

//Make clickable circles appear


//clickable circles functionality

button1.onClick(() => {
    if (!buttonsActive) return;

    checkSequence(0);
});

button2.onClick(() => {
    if (!buttonsActive) return;

    checkSequence(1);
});

button3.onClick(() => {
    if (!buttonsActive) return;

    checkSequence(2);
});

button4.onClick(() => {
    if (!buttonsActive) return;

    checkSequence(3);
});

function checkSequence(buttonIndex) {

    if (!buttonsActive) return;

    if (buttonIndex === sequence[sequenceIndex]) {

        // Correct
        sequenceIndex++;

        // Full sequence complete
        if (sequenceIndex === sequence.length) {

            buttonsActive = false;
            completeSequences++;
            play("gamestartsound");

            statusText.text =
                completeSequences + "/" +
                totalSequences +
                " Sequences complete!";

            // All 3 completed
            if (completeSequences === totalSequences) {

                statusText.text = "Level 1 complete!";
                cubesActive = true;
                
                buttons.forEach(button => {
                    button.hidden = true;
                });
                
                wait(3, () => {
                    completeSequences = 0;
                    statusText.text = "Level 2";
                    generateSequence();
                    showSequence();
                });
                return;
            }

            // Generate new sequence
            wait(2, () => {

                statusText.text = "";

                generateSequence();
                showSequence();
            });
        }

    } else {

        // WRONG
        buttonsActive = false;
        play("fail sound");
        statusText.text = "Incorrect! Try again.";

        tiltAmount += 5;

        // Show the SAME sequence again
        wait(2, () => {

            statusText.text = "";

            showSequence();
        });
    }
}

// Platform
const platform = add([
    
    sprite("platform"),
    scale(0.5),
    pos(750, 600),
    rotate(0),
    anchor("center"),
    area(),
    body({isStatic: true}),
]);

// Platform movement
onUpdate(() => {
    platform.angle = Math.sin(time() * 2) * tiltAmount;
});

// Player
const player = add([
    sprite("player"),
    scale(0.3),
    pos(723, 460),
    area(),
    body({gravityScale: 1}),
    "player"
]);


let gameOver = false;

const gameOverText = add([
    text("GAME OVER"),
    pos(600, 250),
    anchor("center"),
    scale(1.5),
    color(255, 255, 255),
]);

const replayButton = add([
    rect(200, 70),
    pos(600, 350),
    anchor("center"),
    area(),
    color(0, 200, 0),
    "replayButton"
]);

const replayText = add([
    text("REPLAY"),
    pos(600, 350),
    anchor("center"),
    color(255, 255, 255),
]);

gameOverText.hidden = true;
replayButton.hidden = true;
replayText.hidden = true;



// Player movement
onKeyDown("left", () => {
    player.move(-200, 0);
    startMusic();
});

onKeyDown("right", () => {
    player.move(200, 0);
});

onKeyPress("space", () => {
    
    if (player.isGrounded()) {
        player.jump(400);
        play("jump");
    }
});

onUpdate(() => {
    if (gameOver) return;

    if (player.pos.y > 700) {
        gameOver = true;

        gameOverText.hidden = false;
        replayButton.hidden = false;
        replayText.hidden = false;

        buttonsActive = false;
        cubesActive = false;
    }
});


replayButton.onClick(() => {
    if (!gameOver) return;

    gameOver = false;

    // Reset player
    player.pos = vec2(723, 460);
    player.vel = vec2(0, 0);

    // Reset game variables
    tiltAmount = 0;
    completeSequences = 0;
    sequenceIndex = 0;
    cubesActive = false;
    buttonsActive = false;

    // Reset object cycles
    goodObjectIndex = 0;
    badObjectIndex = 0;

    // Hide game over screen
    gameOverText.hidden = true;
    replayButton.hidden = true;
    replayText.hidden = true;

    // Start the memory game again
    wait(1, () => {
        generateSequence();
        showSequence();
    });
});

// Player cubecollision
player.onCollide("redCube", (cube) => {
    destroy(cube);
    tiltAmount += 5;
});

player.onCollide("greenCube", (cube) => {
    
    destroy(cube);
    play("collect");
    tiltAmount = Math.max(0, tiltAmount - 5);
});

// Gravity
setGravity(1200);




// add player sinchronisation with platform movement