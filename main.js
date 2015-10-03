// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(889, 500, Phaser.AUTO, 'gameDiv');

var restartButton;
var gameAlive = true;
var pipe;
var pipesTime = 2000;
var score;
var countLeft = 0;
var verticalSprite;

var main = function(game){}
// Creates a new 'main' state that will contain the game
   main.prototype = {
		// Function called first to load all the assets
		preload: function() { 
			// Change the background color of the game			
			game.load.image("layer1", "assets/layer-1_small.png");
			game.load.image("layer2", "assets/layer-2_small.png");
			game.load.image("layer6", "assets/layer-6_small.png");
			game.load.image("player", "assets/plane.png");
			game.load.image("pipe", "assets/obstacle.png");
		},

		// Fuction called after 'preload' to setup the game 
		create: function() { 		
			// // // layers = game.add.group();
			layer1 = game.add.sprite(0, 0, 'layer1');
			layer1_dup = game.add.sprite(900, 0, 'layer1');
			// // // layers.add(layer1);
			// // // // layer1.z = 0;
			
			layer2 = game.add.sprite(0, 0, 'layer2');
			layer2_dup = game.add.sprite(980, 0, 'layer2');
			// // // layers.add(layer2);
			
			//layer3 = game.add.sprite(0, 0, 'layer3');
			// // // layers.add(layer3);
			
			layer6 = game.add.sprite(0, 0, 'layer6');
			layer6_dup = game.add.sprite(1030, 0, 'layer6');
			
			// Create a group of 60 pipes
			pipes = game.add.group();
			pipes.enableBody = true;
			pipes.createMultiple(60, 'pipe'); 
			
			verticalSprites = game.add.group();
			
		
			// extraPoints = game.add.group();
			// extraPoints.enableBody = true;
			// extraPoints.createMultiple(2, 'extraPoints');  

			extraPoints = game.add.sprite(150,-30,'extraPoints');
			game.physics.enable(extraPoints,Phaser.Physics.ARCADE)
			extraPoints.visible = false;
			extraPoints.appeared = false;
			
			// Set the physics system
			game.physics.startSystem(Phaser.Physics.ARCADE);

			// Display the player on the screen
			player = game.add.sprite(250, 100, 'player');
			player.anchor.set(0.5,0.5);
			
			// Add gravity to the player to make it fall
			game.physics.arcade.enable(player);
			player.body.gravity.y = 800; 

			game.input.onDown.add(jump, this);

			// Timer that calls 'addRowOfPipes' ever 2 seconds 
			timer = game.time.events.loop(pipesTime, addRowOfPipes, this);  
			
			//timer = game.time.events.loop(500, moveVerticalPipes, this); 
			
			// addVerticalPipes();
			// timer = game.time.events.loop(2000, addVerticalPipes, this);
			
			score = 0;
			// if (score <= 10){
				// pipesTime = 2000;
				// timer = game.time.events.loop(pipesTime, addRowOfPipes, this);  
			// }
			// else{
				// pipesTime = 1000;
				//timer = game.time.events.loop(pipesTime, addRowOfPipes, this);  
			// }
			
			timer = game.time.events.loop(3000, addObjects, this);  
			
			topScore = localStorage.getItem("topScore")==null?0:localStorage.getItem("topScore");
			scoreText = game.add.text(10,10,"-",{
				font:"bold 16px Arial", fill: "#ffffff" 
			});
			
			//player.animations.add("explode",'player',30,true);
			updateScore();

		},

		// This function is called 60 times per second
		update: function() {
			moveBackground(layer2,layer6);
			moveBackground(layer2_dup,layer6_dup);
			//moveBackground(layer6);
			// moveBackground(layer6_dup);
			
			// If the player is out of the world (too high or too low), call the 'restartGame' function
			if (player.inWorld == false){
				gameOver(); 
			}
			
			// If the player overlap any pipes, call 'gameOver'
			game.physics.arcade.overlap(player, pipes, gameOver, null, this); 
		
			// If the player overlap any flying objects, call 'addScore'
			game.physics.arcade.overlap(player, extraPoints, addScore, null, this);
			
			// If the player overlap vertically swing Obstacle, call 'gameOver'
			//game.physics.arcade.overlap(player, verticalSprites, gameOver, null, this);
			
			// // If the player overlap any dynamite, call 'gameOver'
			// game.physics.arcade.overlap(player, dynamite, gameOver, null, this); 
			
			computeScore();
			//this.restartButton.onInputDown.add(this.restartGame,this);
		}
   }
   
   function moveBackground(layer2,layer6){
	   if (layer2.x < -980){
			layer2.x = 980;	
			layer2.x -= 5;
		}
		else{
			layer2.x -= 5;
		}
		if (layer6.x < -980){
			layer6.x = 980;	
			layer6.x -= 1;
		}
		else{
			layer6.x -= 1;
		}
			
   }
   
	game.state.add("Main",main);
    game.state.start("Main");
	
	function addVerticalPipes(){
		verticalSprite = game.add.sprite(889, 200, 'verticalObstacle');
		game.physics.enable(verticalSprite,Phaser.Physics.ARCADE);
		verticalSprite.animations.add('right', [0, 1, 2, 3,4,5,6,7,8,9], 10, true);
		verticalSprite.giveScore = true;
		verticalSprites.add(verticalSprite);
	}
	
	function moveVerticalPipes(){
		if (verticalSprite != undefined){
			verticalSprite.animations.play('right');
		}
	}
	
	function updateScore(){
		scoreText.text = "Score: "+score+"\nBest: "+topScore;	
	}
	
	// Make the player jump 
    function jump() {
		if (gameAlive == true){
			// Add a vertical velocity to the player
			player.body.velocity.y = -250;
			//blaster.play();
		}
		else{
			player.body.velocity.y = 0;
			player.body.gravity.y = 0; 
		}
        
    }
	
	function gameOver() {
		gameAlive = false;
		localStorage.setItem("topScore",Math.max(score,topScore));	
		
		//player.animations.play('explode');
		pipes.forEach(function(pipe){
			if(pipe.inWorld == true){
				pipe.body.velocity.x = 0;
			}
		},this);	

		verticalSprites.forEach(function(verticalPipes){
			if(verticalPipes.inWorld == true){
				verticalPipes.body.velocity.x = 0;
			}
		},this);
			
		
		player.body.velocity.y = 0;
		player.body.gravity.y = 0; 
		explosion = game.add.sprite(player.x, player.y, 'explosion');
		explosion.anchor.set(0.5,0.5);
		
		// Add Game Over label at the centre of the screen
		game.labelGameOver = game.add.text(800/2, 460/3, "Game Over", { font: "20px Arial", fill: "#ffffff" });  

		// Add Game Over label at the centre of the screen (game.world.centerX)
		restartButton = game.add.button(800/2, 460/2, 'player', restart, this);

		//end try
		function restart() {
			gameAlive = true;
			game.state.start("Main");	
		}
	}
	
    // Add a pipe on the screen
   function addOnePipe(x, y) {
        // Get the first dead pipe of our group
        pipe = pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

        // Add velocity to the pipe to make it move left
		pipe.body.velocity.x = -200; 
		
        // Kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    }

    // Add a row of 6 pipes with a hole somewhere in the middle
    function addRowOfPipes() {
		if (gameAlive == true){
			var place = Math.floor(Math.random()*2)+1;
	
			 if (place === 1) 
				addOnePipe(889, 100);  
			else{
				addOnePipe(889, 250);  
			}
			pipe.giveScore = true;
		}
    }
	
	function addObstacles() {
		var type = Math.floor(Math.random()*2);
			
			if (type === 0){
				addRowOfPipes();
			}
			
			else{
				addVerticalPipes();
			}
	}
	
	function computeScore() {
		pipes.forEach(function(pipe){
			if (pipe.inWorld == true && pipe.x+pipe.width<player.x && pipe.giveScore){
				score += 1;
				updateScore();
				pipe.giveScore = false;
			}
		},this);
		
		verticalSprites.forEach(function(verticalSpriteCount){
			if (verticalSpriteCount.inWorld == true && verticalSpriteCount.x+verticalSpriteCount.width<player.x && verticalSpriteCount.giveScore){
				score += 1;
				updateScore();
				verticalSpriteCount.giveScore = false;
			}
		},this);
	}
	
	// Add extra points when advantageous object is collected
	function addScore() {
		score += 50;
        updateScore();
		extraPoints.destroy();
	}
	
	function addObjects() {		
		if (score >= 3 && extraPoints.appeared == false){
			// Get the first dead points of our group
			// var points = extraPoints.getFirstDead();
			extraPoints.visible = true;
			var tween = game.add.tween(extraPoints).to({ x: 500,y: 500}, 3000);
			tween.start();
			// // Set the new position of the points
			// points.reset(889, 250);

			// // Add velocity to the points to make it move left
			// points.body.velocity.x = -400; 
				   
			// Kill the points when it's no longer visible 
			extraPoints.checkWorldBounds = true;
			extraPoints.outOfBoundsKill = true;
			extraPoints.appeared = true;
			}
			
		// else if (score === 10){
			// // Get the first dead points of our group
			// var dynamite = dynamite.getFirstDead();

			// // Set the new position of the points
			// dynamite.reset(889, 250);

			// // Add velocity to the points to make it move left
			// dynamite.body.velocity.x = -300; 
				   
			// // Kill the points when it's no longer visible 
			// dynamite.checkWorldBounds = true;
			// dynamite.outOfBoundsKill = true;
			// }
	}

