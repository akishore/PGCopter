var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;
var gameRatio = innerWidth/innerHeight;	
var game = new Phaser.Game(Math.ceil(480*gameRatio), 480, Phaser.AUTO);

// Initialize Phaser, and creates a 400x490px game
//var game = new Phaser.Game(889, 500, Phaser.AUTO, 'gameDiv');

var restartButton;
var gameAlive = true;
var pipe;
var pipesTime = 2927;
var score;
var countLeft = 0;
var verticalSprite;
var build;
var skip = 0;

var main = function(game){}
// Creates a new 'main' state that will contain the game
   main.prototype = {
		// Function called first to load all the assets
		preload: function() { 
			// Change the background color of the game	
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.scale.setScreenSize(true);
			
			game.load.image("layer1", "assets/layer-1_small.png");
			game.load.image("layer3", "assets/layer-3_small.png");
			game.load.image("layer2", "assets/layer-2_small.png");
			game.load.image("layer6", "assets/layer-6_small.png");
			game.load.image("extraPoints", "assets/extraPoints.png");
			game.load.image("player", "assets/plane.png");
			game.load.image("pipe", "assets/obstacle.png");
			game.load.image("pipe1", "assets/purpleBalloon.png");
			game.load.image("pipe2", "assets/brownBalloon.png");
			game.load.image("buildingBase", "assets/buildingBase.png");
			game.load.image("buildingFloor", "assets/buildingFloor.png");
			game.load.image("buildingTop", "assets/buildingTop.png");
			game.load.image("explosion", "assets/explosion.png");
			//game.load.audio("collision", "assets/Aadat.mp3");
		},

		// Fuction called after 'preload' to setup the game 
		create: function() { 		
			//collision = game.add.audio('collision');		
			// // // layers = game.add.group();
			layer1 = game.add.sprite(0, 0, 'layer1');
			layer1_dup = game.add.sprite(900, 0, 'layer1');
			// // // layers.add(layer1);
			// // // // layer1.z = 0;
			
			layer3 = game.add.sprite(0, 0, 'layer3');
			layer3_dup = game.add.sprite(1000, 0, 'layer3');
			
			layer2 = game.add.sprite(0, 0, 'layer2');
			layer2_dup = game.add.sprite(980, 0, 'layer2');
			// // // layers.add(layer2);
			
			// // // layers.add(layer3);
			
			layer6 = game.add.sprite(0, 0, 'layer6');
			layer6_dup = game.add.sprite(1030, 0, 'layer6');
			
			// Create a group of 60 pipes
			pipes1 = game.add.group();
			pipes1.enableBody = true;
			pipes1.createMultiple(60, 'pipe'); 
			
			// Create a group of 60 pipes
			pipes2 = game.add.group();
			pipes2.enableBody = true;
			pipes2.createMultiple(60, 'pipe1'); 
			
			// Create a group of 60 pipes
			pipes3 = game.add.group();
			pipes3.enableBody = true;
			pipes3.createMultiple(60, 'pipe2'); 
			
			building = game.add.group();
			
			// Create a group of 60 pipes
			buildingBase = game.add.group();
			buildingBase.enableBody = true;
			buildingBase.createMultiple(20, 'buildingBase'); 
			
			building.add(buildingBase);
			
			// Create a group of 60 pipes
			buildingFloor = game.add.group();
			buildingFloor.enableBody = true;
			buildingFloor.createMultiple(60, 'buildingFloor'); 
			
			building.add(buildingFloor);
			
			// Create a group of 60 pipes
			buildingTop = game.add.group();
			buildingTop.enableBody = true;
			buildingTop.createMultiple(20, 'buildingTop'); 
			
			building.add(buildingTop);
			
			building.enableBody = true;
		
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
			player.width = 80;
			player.anchor.set(0.5,0.5);
			
			// Add gravity to the player to make it fall
			game.physics.arcade.enable(player);
			player.body.gravity.y = 800; 

			game.input.onDown.add(jump, this);

			// Timer that calls 'addRowOfPipes' ever 2 seconds 
			timer = game.time.events.loop(pipesTime, addObstacles, this);  
			
			//timer = game.time.events.loop(500, moveVerticalObstacle, this); 
			
			// addVerticalPipes();
			//timer = game.time.events.loop(6300, addVerticalObstacle, this);
			
			timer = game.time.events.loop(3967, addFloorsOfBuilding, this);
			
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
			moveBackground(layer2,layer3,layer6);
			moveBackground(layer2_dup,layer3_dup,layer6_dup);
			//moveBackground(layer6);
			// moveBackground(layer6_dup);
			
			// If the player is out of the world (too high or too low), call the 'restartGame' function
			if (player.inWorld == false){
				gameOver(); 
			}
			
			// If the player overlap any pipes, call 'gameOver'
			game.physics.arcade.overlap(player, pipes1, gameOver, null, this);

			game.physics.arcade.overlap(player, pipes2, gameOver, null, this); 
			
			game.physics.arcade.overlap(player, pipes3, gameOver, null, this); 
			
			game.physics.arcade.overlap(player, buildingBase, gameOver, null, this); 
			
			game.physics.arcade.overlap(player, buildingFloor, gameOver, null, this); 
			
			game.physics.arcade.overlap(player, buildingTop, gameOver, null, this); 
		
			// If the player overlap any flying objects, call 'addScore'
			game.physics.arcade.overlap(player, extraPoints, addScore, null, this);
			
			computeScore();
		}
   }
   
   function moveBackground(layer2,layer3,layer6){
	   if (layer2.x < -980){
			layer2.x = 980;	
			layer2.x -= 2;
		}
		else{
			layer2.x -= 2;
		}
		if (layer3.x < -1000){
			layer3.x = 1000;	
			layer3.x -= 1.5;
		}
		else{
			layer3.x -= 1.5;
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
	
	function addVerticalObstacle(){
		if (gameAlive === true){
			var ran = Math.floor(Math.random()*2)+1;
			
			var balloonType = Math.floor(Math.random()*3)+1;
			
			if (balloonType === 1){
				// Get the first dead pipe of our group
				pipe = pipes1.getFirstDead();
			}
			else if (balloonType === 2){
				// Get the first dead pipe of our group
				pipe = pipes2.getFirstDead();
			}
			else{
				// Get the first dead pipe of our group
				pipe = pipes3.getFirstDead();
			}
			
			
			if (ran === 1){
			   pipe.reset(500,0);
			   pipe.angle = -4;
			   pipe.height = 90;
			   pipe.width = 60
			   var tween = game.add.tween(pipe).to({x: 50, y: 600}, 4000);
				tween.start();
		   }
		   else{
				pipe.reset(500,500);
				pipe.angle = -4;
				 pipe.height = 90;
			   pipe.width = 60
			   var tween = game.add.tween(pipe).to({x: 50, y: -200}, 4000);
				tween.start();
		   }
			pipe.giveScore = true;
			// Kill the pipe when it's no longer visible 
			pipe.checkWorldBounds = true;
			pipe.outOfBoundsKill = true;
		}
		
	}
	
	// function moveVerticalObstacle(){
		// var tween = game.add.tween(extraPoints).to({ x: 500,y: 500}, 3000);
		// tween.start();
	// }
	
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
		skip = 0;
		localStorage.setItem("topScore",Math.max(score,topScore));	
		//playAudio("DiceRollAudio");
		//player.animations.play('explode');
		pipes1.forEach(function(pipe){
			if(pipe.inWorld == true){
				pipe.body.velocity.x = 0;
			}
		},this);
		pipes2.forEach(function(pipe){
			if(pipe.inWorld == true){
				pipe.body.velocity.x = 0;
			}
		},this);
		pipes3.forEach(function(pipe){
			if(pipe.inWorld == true){
				pipe.body.velocity.x = 0;
			}
		},this);
		
		buildingBase.forEach(function(build){
			if(build.inWorld == true){
				build.body.velocity.x = 0;
			}
		},this);
		buildingFloor.forEach(function(build){
			if(build.inWorld == true){
				build.body.velocity.x = 0;
			}
		},this);
		buildingTop.forEach(function(build){
			if(build.inWorld == true){
				build.body.velocity.x = 0;
			}
		},this);
		

		verticalSprites.forEach(function(verticalPipes){
			if(verticalPipes.inWorld == true){
				verticalPipes.body.velocity.x = 0;
			}
		},this);
			
		
		player.body.velocity.y = 0;
		player.body.gravity.y = 0; 
		explosion = game.add.sprite(player.x+40, player.y, 'explosion');
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
   function addOnePipe(x, y, balloonType) {
	   if (balloonType === 1){
		   // Get the first dead pipe of our group
			pipe = pipes1.getFirstDead();
	   }
	   else if (balloonType === 2){
		   // Get the first dead pipe of our group
			pipe = pipes2.getFirstDead();
	   }
	   else{
		   // Get the first dead pipe of our group
			pipe = pipes3.getFirstDead();
	   }
	   
		
	   // Set the new position of the pipe
		pipe.reset(x, y);
		 pipe.height = 90;
		  pipe.width = 60

		// Add velocity to the pipe to make it move left
		pipe.body.velocity.x = -200; 
   

        // Kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    }

    // Add a row of 6 pipes with a hole somewhere in the middle
    function addRowOfPipes() {
		if (gameAlive == true){
			var balloonType = Math.floor(Math.random()*3)+1;
			var place = Math.floor(Math.random()*2)+1;
	
			 if (place === 1) 
				addOnePipe(889, 100, balloonType);  
			else{
				addOnePipe(889, 250, balloonType);  
			}
			pipe.giveScore = true;
		}
    }
	
	function addFloorsOfBuilding() {
		if (gameAlive == true){
			build = building.getFirstDead();
			var floors = Math.floor(Math.random()* 3)+4;
			buildingBasePassed = buildingBase.getFirstDead();
			buildingTopPassed = buildingTop.getFirstDead();
			
			buildingBasePassed.reset(889,470);
			for (var i= 0; i<floors; i++){
				buildingFloorPassed = buildingFloor.getFirstDead();
				buildingFloorPassed.reset(889,470-(i*30));
				buildingFloorPassed.body.velocity.x = -200;
			}
			buildingTopPassed.reset(889,(490-(floors*30)));
			
			buildingBasePassed.body.velocity.x = -200;
			
			buildingTopPassed.body.velocity.x = -200;
			buildingTopPassed.giveScore = true;
		}
	}
	
	
	function addObstacles() {
		if (skip === 3){
			addVerticalObstacle();
			skip = 0;
		}
		
		else{
			addRowOfPipes();
			skip += 1;
		}
	}
	
	function computeScore() {
		pipes1.forEach(function(pipe){
			if (pipe.inWorld == true && pipe.x+pipe.width<player.x && pipe.giveScore){
				score += 1;
				updateScore();
				pipe.giveScore = false;
			}
		},this);
		pipes2.forEach(function(pipe){
			if (pipe.inWorld == true && pipe.x+pipe.width<player.x && pipe.giveScore){
				score += 1;
				updateScore();
				pipe.giveScore = false;
			}
		},this);
		pipes3.forEach(function(pipe){
			if (pipe.inWorld == true && pipe.x+pipe.width<player.x && pipe.giveScore){
				score += 1;
				updateScore();
				pipe.giveScore = false;
			}
		},this);
		
		buildingTop.forEach(function(build){
			if (build.inWorld == true && build.x+build.width<player.x && build.giveScore){
				score += 1;
				updateScore();
				build.giveScore = false;
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
		score += 5;
        updateScore();
		extraPoints.destroy();
	}
	
	function addObjects() {		
		if (gameAlive === true){
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
		
	}
	
	// function playAudio(audioID) {
	// var audioElement = document.getElementById(audioID);
	// var url = audioElement.getAttribute('src');
	// my_media = new Media(url,
			// // success callback
			 // function () { my_media.release(); },
			// // error callback
			 // function (err) { my_media.release(); }
	// );
		   // // Play audio
	// my_media.play();
// }

