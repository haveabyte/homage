var l; // global location variable.  this always has the current location we're on
//var cmdqueue = []; // a history of commands

var key_codes_by_number = {  // just a lazy lookup object for event.keyCode
		13:'enter',
		37:'arrow_left',
		38:'arrow_up',
		39:'arrow_right',
		40:'arrow_down'
};

var key_codes_by_name = {  // just a lazy lookup object for event.keyCode
		'enter':13,
		'arrow_left':37,
		'arrow_up':38,
		'arrow_right':39,
		'arrow_down':40
};


$(document).ready(function() { // JQuery runs this when the DOM is fully loaded
	refresh_inventory(); // redraw this on screen in case some items are preloaded from start of game
	go('title'); // load the title screen and first location, user takes it from there.
});

function go(loc) {
	l = locations[loc]; 		// load the current location into global l variable.
	//$('#scene').html(''); 		// blank out any existing scene HTML, using JQuery
	name(l.name); 				// output the location name, see function name()
	output(l.description); 		// output the location description, see function output()
	help(l.help); 				// writes the help text, see function help()
	visit(l); 					// we call this function anytime a location is visited so that certain first/repeat visit things can happen
																																									d('go() finished'); 		// d(msg) is our universal debug function
	//update_url('#'+l.urlslug); 	// prototype back button handling
}

function visit(loc) { 		// we call this function anytime a location is visited so that certain first/repeat visit things can happen
    if(loc.visits == 0) { 	// all location specific objects are called like this
    	loc.first_visit(); 	// first time in this room, run the function attached to first_visit in the current location object
    } else {
    	loc.return_visit(); // a return visit to this room, run the function attached to return_visit in the current location object
    }
    loc.visits++;  			//increment the visits count for this location every time
}

// Input

function focusInput() {
	document.getElementById('input').focus();  //XXX focuses the input box.  should jqueryify this
}

function parse(force) { // parses both typed commands and clicked commands, because clicked commands may be typed, so it's better to handle them all together to avoid having to define things twice in the location object.
	d('parse function called');
	var cmd; // cmd to be processed could be a few things so we make a variable
	
	if (force != undefined) {  // if something was passed to the parse() function directly...
																																									d('parsing forced command? ' + force);
		cmd = force;       	   // use force value if supplied, otherwise, use the input.
		if (l.commands[cmd]) { // if the command is defined in the location objects command section...
			l.commands[cmd](); // execute it.
		} else {
			if (cmd == 'look') {
				// helpfully just output the location description again if the designer didn't define look to be something unique from the initial description
				output(l.description);
			}
			output("Sorry, I don't know what you mean."); // need smarter fallback command handling
		}
	} else {
		cmd = $('#input').val(); // since nothing was forced, use the input - but we'll need to check to see if they hit ENTER
		d('found cmd ' + cmd + ' in the input box');
		if (cmd != '') {
																																									d('cmd = ' + cmd);
			// they pressed enter and something was found in the input box
			cmd = cmd.toLowerCase(); // manage case sensitivity
			clearInput(); // just deletes contents of user input box

			// here we will ensure the command exists before executing it to avoid JS errors.
			if (l.commands[cmd]) { // if the command is defined in the location objects command section...
				l.commands[cmd](); // execute it.
				return; // only one thing is possible so we should immediately exit
			} else {
				if (cmd == 'look') {
					// helpfully just output the location description again if the designer didn't define look to be something unique from the initial description
					output(l.description);
				}
				output("Sorry, I don't know what you mean."); // need smarter fallback command handling
				return; // only one thing is possible so we should immediately exit
			}
		}
		
		// if they didn't type anything and just pressed enter
		if (cmd == '') { 
																																									d('parsing enter due to blank input');
																																									d(l.commands['enter']()); // run locations.thislocation.enter function.
			return; // only one thing is possible so we should immediately exit
		}
	}
}

function add_to_inventory(item) {
	inventory.push(item); // just add the item's name into the inventory array at the end
	refresh_inventory(); // just redraws the inventory section
}

function refresh_inventory() { // just redraws the inventory section
	$('#carrying').html('');// clear the display of what we are carrying, because we should redraw it
	inventory.forEach(
			function(item) { // call this function for every item in the inventory
				$('#carrying').html($('#carrying').html() + " &nbsp; <a onclick=\"parse('use " + item + "');\">" + item + "</a>	"); // append item to inventory.  comma separated - might want to wrap these in <div> or <span> for enhanced styling.
			}
	);
}

function is_carrying(item) { // a simple check to see if we're currently carrying a particular item
	for (var i = 0;i < inventory.length; i++) {
		if (inventory[i] == item) { // if the item requested exists
			return(true);
		}
	}
	return(false);
}

/*function queue(cmd) { // possibly used for smart back handling and possible playback of commands from the beginning
	d('pushing ' + cmd + ' into cmdqueue');
	return(cmdqueue.push(cmd));
}*/

function help(text) {
	$('#help').html(text); // write something to the help div
}

function update_url(tag) { // prototype back button handling by appending #tags to the URL
	// strip current #tag off
	var lh = location.href;
	lh = lh.replace(/\#.*/,''); //replaces #..... with nothing
	location.href = lh + tag;  
}

function clearInput() {
	$('#input').val(''); // removes text from the user input box
}

function valid(func) { // a test to see if something is a function.  
	if ( typeof func == 'function' ) { d('function is valid'); return(true); } else { return(false); }
}

// Output

function name(text) {
	$('#name').html(text); // a simple way to display the location name.  you could do some elaborate image loading thing here if you wanted
}

function output(text) {
	$('#output').html(text); // a simple way to display the output text.  you could do some elaborate image loading thing here if you wanted
}

function pause(sec) {
	// ignore for now
	return;
}

function d(msg) { // a debugger
	var d = new Date();
	var out = d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds() + " " + " Message: " + msg;
    delete d;
	$('#debug').html(out + '\n' + $('#debug').val()); // comment out this line to stop printing debug output to the page
	console.log(out);
	return;
}