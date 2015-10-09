var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;
var gameRatio = innerWidth/innerHeight;	
var game = new Phaser.Game(Math.ceil(500*gameRatio), 500, Phaser.AUTO);

// Initialize Phaser, and creates a 400x490px game
// var game = new Phaser.Game(889, 500, Phaser.AUTO, 'gameDiv');

var restartButton;
var gameAlive = true;
var pipe;
var pipesTime = 2927;
var score;
var verticalSprite;
var build;
var skip = 0;
var count = 0;
var continuousCount = 0;
var my_media;

var playAudio = function(audioID) {
	
	var audioElement = document.getElementById(audioID);
	if (!typeof new Audio().loop == 'boolean' && audioID === "Plane") {
		audioElement.addEventListener('ended', function () {
			this.currentTime = 0;
			this.play();
		}, false);
	}
	var url = audioElement.getAttribute('src');
	my_media = new Media(url,
			// success callback
			 function () { my_media.release(); },
			// error callback
			 function (err) { my_media.release(); }
	);
		   // Play audio
	my_media.play();
}

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
			game.load.image("explosion", "assets/explosion.png");
			game.load.spritesheet("buildingSprites","assets/spritesheet.png",110,233,5);
			//game.load.audio("collision", "assets/0897.ogg");
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
			
			buildingFloor3 = game.add.group();
			buildingFloor4 = game.add.group();
			buildingFloor5 = game.add.group();
			buildingFloor6 = game.add.group();
			
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

			building3 = game.add.sprite(1289, 200, 'buildingSprites',2);
			game.physics.arcade.enable(building3);
			building3.giveScore = true;
			
			building4 = game.add.sprite(1289, 200, 'buildingSprites',3);
			game.physics.arcade.enable(building4);
			building4.giveScore = true;
			
			building5 = game.add.sprite(1289, 200, 'buildingSprites',4);
			game.physics.arcade.enable(building5);
			building5.giveScore = true;
			
			building6 = game.add.sprite(1289, 200, 'buildingSprites',5);
			game.physics.arcade.enable(building6);
			building6.giveScore = true;
				
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
			
			timer = game.time.events.loop(3967, addFloorsOfBuilding, this);
			
			score = 0;
			functionCalled = 0;
			
			//timer = game.time.events.loop(3000, addObjects, this); 

			playAudio("Plane");
			//timer = game.time.events.loop(15000, playPlaneSound, this);  
			
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
			
			// If the player is out of the world (too high or too low), call the 'restartGame' function
			if (player.inWorld == false){
				gameOver(); 
			}
			
			// If the player overlap any pipes, call 'gameOver'
			game.physics.arcade.overlap(player, pipes1, gameOver, null, this);

			game.physics.arcade.overlap(player, pipes2, gameOver, null, this); 
			
			game.physics.arcade.overlap(player, pipes3, gameOver, null, this); 
			
			game.physics.arcade.overlap(player, building3, gameOver, null, this); 
			
			game.physics.arcade.overlap(player, building4, gameOver, null, this); 
			
			game.physics.arcade.overlap(player, building5, gameOver, null, this); 
			
			game.physics.arcade.overlap(player, building6, gameOver, null, this); 
		
			// If the player overlap any flying objects, call 'addScore'
			game.physics.arcade.overlap(player, extraPoints, addScore, null, this);
			
			computeScore();
		}
   }
   
   function moveBackground(layer2,layer3,layer6){
	   if (layer2.x < -980){
			layer2.x = 980;	
			layer2.x -= 3;
		}
		else{
			layer2.x -= 3;
		}
		if (layer3.x < -1000){
			layer3.x = 1000;	
			layer3.x -= 2;
		}
		else{
			layer3.x -= 2;
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
	
	function playPlaneSound(){
		playAudio("Plane");
	}
	
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
		my_media.pause();
		gameAlive = false;
		skip = 0;
		functionCalled = functionCalled+1;
		localStorage.setItem("topScore",Math.max(score,topScore));	
		
		if (functionCalled === 1){
			playAudio("Collision");
		}
		
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
		
		if (building3.inWorld === true){
			building3.body.velocity.x = 0;
		}
		if (building4.inWorld === true){
			building4.body.velocity.x = 0;
		}
		if (building5.inWorld === true){
			building5.body.velocity.x = 0;
		}
		if (building6.inWorld === true){
			building6.body.velocity.x = 0;
		}
		
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
			my_media.pause();
			gameAlive = true;
			skip = 0;
			game.state.start("Main",true,false);	
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
			var floors = Math.floor(Math.random()* 4)+3;
			if (continuousCount < 4 && count === floors){
				continuousCount++;
				addFloorsOfBuilding();
			}
			else{
				if (floors === 3){
					building3.reset(989,(450-110));
					building3.body.velocity.x = -200;
					continuousCount = 1;
					count = floors;
				}
				
				else if (floors === 4){
					building4.reset(989, (450-141));
					building4.body.velocity.x = -200;
					continuousCount = 1;
					count = floors;
				}
				
				else if (floors === 5){
					building5.reset(989, (450-171));
					building5.body.velocity.x = -200;
					continuousCount = 1;
					count = floors;
				}
				
				else if (floors === 6){
					building6.reset(989, (450-203));
					building6.body.velocity.x = -200;
					continuousCount = 1;
					count = floors;
				}	
			}
					
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
		
		if (building3.inWorld === true && building3.x+building3.width<player.x && building3.giveScore){
			score += 1;
			updateScore();
			building3.giveScore = false;
		}
		if (building4.inWorld === true && building4.x+building4.width<player.x && building4.giveScore){
			score += 1;
			updateScore();
			building4.giveScore = false;
		}
		if (building5.inWorld === true && building5.x+building4.width<player.x && building5.giveScore){
			score += 1;
			updateScore();
			building5.giveScore = false;
		}
		if (building6.inWorld === true && building6.x+building6.width<player.x && building6.giveScore){
			score += 1;
			updateScore();
			building6.giveScore = false;
		}
		
		
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

