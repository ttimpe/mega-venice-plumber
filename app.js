var game = null;

var timeFont = { font: "14px super", fill: "yellow" };

var menuFont = { font: "16px super", fill: "white" };
var startLabel;
var timer = 0;
//Update functionupdate(){    }
function printColoredText(x, y, string, size, hOffset) {
    var f = size + "px logofont";

    for (var i = 0; i<string.length; i++) {
        var h = (i+hOffset) * 30;
        var fill = "hsl(" + h + ", 100%, 50%)";
        var f1 = {font: f, fill:fill};
        game.add.text(x+(i*(size*0.8)), y, string.charAt(i), f1);
    }
}

var startScreen = {
    preload: function() {

    },
    create: function() {
        startLabel = game.add.text(175, 300, "PRESS SPACE", menuFont);

        game.physics.startSystem(Phaser.Physics.ARCADE);



        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.startGame, this);
        printColoredText(30, 80, "M EGA", 50,4);
        printColoredText(210, 80, " VENICE", 50,7);
        printColoredText(30, 130, "PLUM BER", 70,2);


        this.timer = game.time.create(false);
        this.timer.loop(300, this.updateTime, this);


    },
    update: function() {
        timer += game.time.elapsed; //this is in ms, not seconds.
        if ( timer >= 500 )    {        timer -= 500;        startLabel.visible = !startLabel.visible;    }
    },
    updateTime: function() {
    },
    startGame: function() {
        game.state.start('main');
    }
};


var mainState = {
    preload: function() {
        // This function will be executed at the beginning
        // That's where we load the images and sounds
        game.load.image('ramio', 'assets/ramio.gif');
        game.load.image('background', 'assets/background.jpg');

        // Structure
        game.load.image('structure_bottom_left', 'assets/structure_bottom_left.png');
        game.load.image('structure_bottom_right', 'assets/structure_bottom_right.png');
        game.load.image('structure_bottom_middle', 'assets/structure_bottom_middle.png');
        game.load.image('structure_left', 'assets/structure_left.png');
        game.load.image('structure_right', 'assets/structure_right.png');
        game.load.image('structure_middle', 'assets/structure_middle.png');

    },

    create: function() {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.
        // Change the background color of the game to blue
        background = game.add.tileSprite(0, 0, 20000, 432, "background");

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the ramio at the position x=100 and y=245
        this.ramio = game.add.sprite(100, 245, 'ramio');
                    // Add physics to the ramio
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.ramio);
        game.camera.follow(this.ramio, Phaser.Camera.FOLLOW_PLATFORMER);

        // Add gravity to the ramio to make it fall
        this.ramio.body.gravity.y = 1000;
        this.ramio.body.gravity.x = 100;
        this.ramio.anchor.setTo(0,0);

        game.world.setBounds(0, 0, 16000, 0);

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        // Create an empty group
        this.objects = game.add.group();
        this.addRowOfPipes();

        //this.game.world.setBounds(500 + this.ramio.position.x, 432 + this.ramio.position.y, 500*2, 432*2);
        this.timeLeft = 180;
        this.label_time = this.game.add.text(350, 20, this.timeLeft, timeFont);
        this.label_time.fixedToCamera = true;
        this.label_time_caption = this.game.add.text(350, 5, "TIME", timeFont);
        this.label_time_caption.fixedToCamera = true;
            //this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
            timer = game.time.create(false);

             //  Set a TimerEvent to occur after 2 seconds
             timer.loop(1000, this.updateTime, this);
             timer.start();
    },

    updateTime: function() {
        this.timeLeft--;
        this.label_time.setText(this.timeLeft);
    },
    update: function() {
        // This function is called 60 times per second
        // It contains the game's logic
        // If the ramio is out of the screen (too high or too low)
        // Call the 'restartGame' function

        game.physics.arcade.collide(this.ramio, this.objects);

        this.ramio.body.velocity.x = 0;


        if (this.ramio.y < 0 || this.ramio.y > 490) {
        this.restartGame();
        }
        this.ramio.body.velocity.x = 300;



    },
    // Make the ramio jump
    jump: function() {
        // Add a vertical velocity to the ramio
        this.ramio.body.velocity.y = -350;
    },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },

    addRowOfPipes: function() {
        // Randomly pick a number between 1 and 5
        // This will be the hole position


        var lastX = 5;
        for (var i = 0; i < 50; i++) {
            var distance = (Math.floor(Math.random()*10) + 3)*16;
            var height = Math.floor(Math.random() * 10) + 6;
            var width = Math.floor(Math.random() * 10) + 6;
            this.addStructure(distance+lastX,width, height);

            lastX = lastX + distance + (width*16);
        }

    },
    addStructure: function(x, width, height) {
// Middle

for (var h=0; h<height-1; h++) {

var structure_left = game.add.sprite(x, h*16,'structure_left');
this.objects.add(structure_left);

for (var i=1; i<width-1; i++) {
    var structure_middle = game.add.sprite(x+(i*16), h*16,'structure_middle');
    this.objects.add(structure_middle);

}
var structure_right = game.add.sprite(x + (width-1)*16, h*16,'structure_right');
this.objects.add(structure_right);

}
// Bottom

var structure_bottom_left = game.add.sprite(x, (height-1)*16,'structure_bottom_left');
this.objects.add(structure_bottom_left);

for (var i=1; i<width-1; i++) {
    var structure_bottom_middle = game.add.sprite(x + (i * 16), (height-1)*16,'structure_bottom_middle');
    this.objects.add(structure_bottom_middle);
}
var structure_bottom_right = game.add.sprite(x + (width-1)*16, (height-1)*16,'structure_bottom_right');
this.objects.add(structure_bottom_right);
game.physics.arcade.enable(this.objects);

// Add all parts
this.objects.subAll('body.velocity', 2000, true, true);

    }
};



function startGame() {
game = new Phaser.Game(500, 432, Phaser.AUTO, 'game');

// Add the 'mainState' and call it 'main'
game.state.add('startScreen', startScreen);

game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('startScreen');
}

var n = document.getElementById('noise');
var ctx = n.getContext('2d');
var noiseInterval;
var noiseOsc;
function startNoise() {

    noiseInterval = setInterval(setNoise, 1000/50);
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();

    var bufferSize = 2 * audioContext.sampleRate,
        noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate),
        output = noiseBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    noiseOsc = audioContext.createBufferSource();
    noiseOsc.buffer = noiseBuffer;
    noiseOsc.loop = true;
    noiseOsc.start(0);

    noiseOsc.connect(audioContext.destination);
}
function stopNoise() {
    noiseOsc.stop();
    clearInterval(noiseInterval);
    n.style.display = 'noise';
}
function switchToGame() {
    stopNoise();
    startGame();
}
function setNoise() {
    document.body.onkeyup = function(e){
        if(e.keyCode == 32){
            stopNoise();
            startGame();
            document.body.onkeyup = null;
        }
    }
    var id = ctx.createImageData(500,432); // only do this once per page
    var data = id.data;
    for (var i=0; i<data.length; i += 4) {
        var l = Math.floor(Math.random() * 255);
        data[i] = l;
        data[i+1] = l;
        data[i+2] = l;
        data[i+3] = 255;

    }
    ctx.putImageData(id, 0, 0);

}
function playStream(url) {
    document.getElementById('player').src = url;
}
startNoise();
