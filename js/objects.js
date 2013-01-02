var inventory = ['a lighter'];

var locations = {

	title : {
        name:'Jailbreak',
        urlslug:'title',
        description: 'Press enter or click the screen to begin!',
        help: 'Demonstrated here:  Calling go() via an image click, handling no input ENTER key press.', 
        visits: 0,
        first_visit: function() { $('#scene').load('rooms/' + this.urlslug + ".htm"); }, // load the scene specific html }, // output() something here to override description on first visit
        return_visit: function() { /* never used for title */ }, 
        commands: {
            'enter': function(){ go('the_cage'); },
        	'look': function() { output('Press enter or click the screen to begin!'); },
        	'n': function() { output('Press enter or click the screen to begin!'); },
        	's': function() { output('Press enter or click the screen to begin!'); },
        	'e': function() { output('Press enter or click the screen to begin!'); },
        	'w': function() { output('Press enter or click the screen to begin!'); },
        	'u': function() { output('Press enter or click the screen to begin!'); },
        	'd': function() { output('Press enter or click the screen to begin!'); },
        }
    },

		
    the_cage : {
        name:"a holding cell",
        urlslug:"the-cage",
        description: 'You awake in a dilapidated jail cell.  You aren\'t sure how you got here, or even who you are.',
        help: 'Demonstrated here: Door state open/closed, picking up an item, changing scene image, changing door state, scalable pseudo-imagemaps',
        visits: 0,
        first_visit: function() { $('#scene').load('rooms/' + this.urlslug + ".htm"); }, // output() something here to override description on first visit
        return_visit: function() {
        	output("You return to re-examine the jail cell.  You aren't sure why.");
        	if (is_carrying('a paperclip')) {
        		$('#scene').load('rooms/' + this.urlslug + ".htm", function(){       // after loading the main scene,
        			//other option would be to load an entirely different scene, so you don't have to load something unnecessary first and use this wonky function to replace it.
        			//however, would likely end up with a lot of scenes for complex scenes.
        			//should handle the paperclip object differently.
        			$('#scene_image').attr('src','rooms/the-cage-no-paperclip.jpg'); //XXX replace the image with the non paperclip version since we're holding it. this sucks
        		});
        	} else {
        		$('#scene').load('rooms/' + this.urlslug + ".htm");
        	}
        	
        }, // output() something here to override description on first visit
        state: { 'door':'closed' },
        commands: {
        	'n':function() { output("You run into a brick wall and feel kind of silly."); },
        	's':function() { output("You run into a brick wall and feel kind of silly."); },
        	'e':function() { output("You run into a brick wall and feel kind of silly."); },
        	'w':function() { 
        		// this method can be used in a simple situtation, but with more complex ones, you would simply overwrite this entire function at the appropriate time.
        		if (l.state.door == 'closed') {
        			output("The bars are in the way.  If only the door were open.");
        		} else {
        			go('hallway');
        		}
        	},
        	'u':function() { output("You climb on top of the sink and accomplish nothing."); },
            'look':function(){
            	if (inventory.indexOf('a paperclip') > -1) {
            		output("You are in a dilapidated jail cell.  There is an unlocked steel door to the west.");
            	} else {
            		output("You are in a dilapidated jail cell.  There is a locked steel door to the west.  You notice something shiny in the sink.  Try clicking it!");
            	}
            },
            'take shiny object':function(){
            	if (is_carrying('a paperclip')) {
            		// already have it
            		output("There's nothing else in the sink.");
            	} else {
                	output("You find a paperclip left in the sink by a previous inmate.  You pick it up, fashion a lockpick and unlock the door.");
                	l.state.door = 'open';
                	add_to_inventory('a paperclip');
                	$('#scene_image').attr('src','rooms/the-cage-no-paperclip.jpg');
            	}
            }
        }
    },
    
    hallway : {
    	name: "a prison hallway",
    	urlslug: "hallway",
    	description: "You are in a hallway.  The cell you were in is open to the east.  You see a door leading outside at the north end of the hall.",
    	help: 'Demonstrated here: Returning to a previous area',
    	visits: 0,
    	first_visit: function() { $('#scene').load('rooms/' + this.urlslug + ".htm"); }, // output() something here to override description on first visit
    	return_visit: function() { $('#scene').load('rooms/' + this.urlslug + ".htm"); },
    	state: {},
        commands: {
        	'look': function() { output(l.description); },
        	's':function() { output("The hallway leads nowhere except north and back into the jail cell east."); },
        	'e':function() { go('the_cage'); },
        	'w':function() { output("The hallway leads nowhere except north and back into the jail cell east."); },
        	'n':function() { go('hedge_entrance'); }
        }
    },

    hedge_entrance : {
    	name: "an entrance to a hedge maze",
    	urlslug: "hedge-entrance",
    	description: "You find yourself at the entrance to a hedge maze.  The entrance is north, but you hate hedge mazes.  Fortunately, there is a can of gasoline here.  There is also a sign with something in latin.",
    	help: 'Simple sequence image swapping, preventing re-use of objects, altering n/s/e/w or other commands in response to actions, preserving a slightly more complex state using any_visit()',
    	visits: 0,
    	first_visit: function() { this.any_visit(); }, // output() something here to override description on first visit
    	return_visit: function() { this.any_visit(); },
    	gas_drag_counts: 0,
    	any_visit: function() {

    		/*if (l.state.gas == 'full') {
	    		$('#scene').load('rooms/' + this.urlslug + ".htm", function(){
	        		$('#gascan').draggable(
	        				{ 
	        				revert: true, 
	        				drag: function() {
	        					l.gas_drag_counts++;
	        				},
	        				stop: function() {
	        					d('gas dragged ' + l.gas_drag_counts + ' times');
	        			        if (l.gas_drag_counts > 300) { // this is a little weird but good enough.  number is small if you drag fast, high if you drag slower and longer.  "area covered" does not really come into it.
	        			        	$('#scene_image').attr('src',"rooms/hedge-entrance-gas-poured.jpg");
	        			        	output('You poured the gas all over the place.  You feel the hairs stand up on the back of your neck.  It\'s been ages since you have lit anything significant on fire.');
	        			        	l.state.gas = 'empty';
	        			        	$('#gascan').draggable('disable');
	        			        }
	        			    }
	        		
	        		});
	    		});
    		} else {*/
    		
    			if (l.state.gas == 'full') {
    				$('#scene').load('rooms/' + this.urlslug + ".htm");	
    			} else if (l.state.hedges == 'burned') {
       				$('#scene').html('<img id="scene_image" src="rooms/hedge-entrance-burned.jpg">');
    			} else {
        			// gas can is empty, has been poured
        			$('#scene').load('rooms/' + this.urlslug + ".htm", function(){
        				$('#scene_image').attr('src',"rooms/hedge-entrance-gas-poured.jpg");
        			});
    			}
    			
    		/*} part of old draggable block */
    	},
    	state: { 'gas':'full',
    		     'hedges':'intact'},
        commands: {
        	'look': function() { output(l.description); },
        	's':function() { go('hallway'); },
        	'e':function() { output("Thick hedges prevent your passage."); },
        	'w':function() { output("Thick hedges prevent your passage."); },
        	'n':function() { output("You could enter, but you remember you hate hedge mazes and refuse, and decide to seek a different path."); },
        	'use gas can': function() {
        		if (l.state.gas == 'full') {
	        		$('#scene_image').attr('src',"rooms/hedge-entrance-gas-poured.jpg");
		        	output('You poured the gas all over the place.  You feel the hairs stand up on the back of your neck.  It\'s been ages since you have lit anything significant on fire.');
		        	l.state.gas = 'empty';
        		}
        	},
        	'read sign':function() { output('The sign reads Lasciate ogne speranza, voi ch\'intrate, which translates to "abandon all hope, all ye who enter here".'); },
        	'use lighter': function() { this['use a lighter'](); }, // alias in case they type it.
        	'use a lighter': function() {
        		
        		if (l.state.hedges == 'burned') {
        			output("You already torched the place... you can't really do any more here with your lighter.");
        		} else { 
            		output('You light the hedges ablaze and sit back to admire your handiwork.  After a while, nothing remains but the ashes of a once great hedge maze.  You are free to continue north.  To the south is the jail you came from, and on the east and west are, let\s say, deadly ravines.');
            		l.description = 'You are standing in front of a burned down hedge maze.  You can travel north.  To the south is the jail you came from, and on the east and west are, let\s say, deadly ravines.';
            		l.state.hedges = 'burned';
            		l.name = 'a burned down hedge maze';
            		name(l.name);
            		
            		/* fire animation sequence */
    				$('#scene').html('<img id="scene_image" style="display:none" src="rooms/hedge-entrance-fire.jpg">');
    				$('#scene_image').load( 
    						function() { 
    							$('#scene_image').fadeIn(500, function() {
    								$('#scene').html('<img id="scene_image" style="display:none" src="rooms/hedge-entrance-burned.jpg">');
    								$('#scene_image').load( 
    										function() { 
    											$('#scene_image').fadeIn(500);
    										} 
    								);
    							});
    						} 
    				);
    				
    				/* need to change the compass actions now */
    				this.n = function() { output('To be continued...'); }; 								  // this is permanent at this point, and does not need to be repeated when revisiting
    				this.e = function() { output('A deadly ravine prevents you from going this way.'); }; // this is permanent at this point, and does not need to be repeated when revisiting
    				this.w = function() { output('A deadly ravine prevents you from going this way.'); }; // this is permanent at this point, and does not need to be repeated when revisiting
        			
        		}
        	}
        }
    }
    
};