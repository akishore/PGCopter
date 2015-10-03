// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(889, 500, Phaser.AUTO, 'gameDiv');

var main = function(game){}
// Creates a new 'main' state that will contain the game
   main.prototype = {
		// Function called first to load all the assets
		preload: function() { 
			// Change the background color of the game			
			game.load.image("layer1", "assets/layer-1_small.png");
			game.load.image("layer2", "assets/layer-2_small.png");
			// game.load.image("layer3", "assets/layer-3.png");
			// game.load.image("layer4", "assets/layer-4.png");
			// game.load.image("layer5", "assets/layer-5.png");
			game.load.image("layer6", "assets/layer-6_small.png");
		},

		// Fuction called after 'preload' to setup the game 
		create: function() { 
			// map = game.add.tilemap('map');
			
			// //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
			// //  The second parameter maps this name to the Phaser.Cache key 'layer1'
			// map.addTilesetImage('FullSky', 'layer1');
			
			// //  Creates a layer from the World1 layer in the map data.
			// //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
			// layer = map.createLayer('World1');
			
			// //  This resizes the game world to match the layer dimensions
			// layer.resizeWorld();
			
			// map.addTilesetImage('CloudSky', 'layer2');
		
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
			
			// layer2.z = 1;
			// layers.add(layer1);
			// layers.add(layer2);
			// var tween = game.add.tween(layer2).to({ x: -100,y: 0}, 3000);
			// tween.start();
			
			// var tween = game.add.tween(layer6).to({ x: -100,y: 0}, 7000);
			// tween.start();
		},

		// This function is called 60 times per second
		update: function() {
			moveBackground(layer2,layer6);
			moveBackground(layer2_dup,layer6_dup);
			//moveBackground(layer6);
			// moveBackground(layer6_dup);
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
	
	function updateBackground(){
		layers.autoScroll(-100,0);
	}
