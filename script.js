window.onload = function() {
	//audio
	var rain_audio = new sound("resources/rain.mp3");
	var guitar_1 = new sound("resources/guitar_1.mp3");
	var c = document.getElementById("myCanvas");

	c.width  = 0;
	c.height = 0;
	var w = 0;
	var h = 0;
	var shp_h = 0;
	var shp_w = 0;
	var bg_h = 0;
	var bg_w = 0;
	auto_resize();

	var ctx = c.getContext("2d");

	ctx.fillStyle = "blue";
	ctx.fillRect(0, 0, w, h);


	var shp = new Image();   // Create new img element
	shp_path = 'resources/sheep_nobg/sheep_nobg';

	var is_jumping = false;
	var time = 0;
	var slowness = 60;

	var bg = new Image();   // Create new img element
	bg.src = 'resources/nice_background.jpg'; 


	var bg_pos = 0;


	bg.addEventListener("load", function() {
    	ctx.drawImage(bg, w-bg_w, h-bg_h, bg_w,  bg_h);
	});
	function update(t, dt) {
	  //auto resize
	  auto_resize();


	  // Update Sheep
	  var timestring = Math.floor(dt/slowness)%16+1;
	  if (timestring == 16 && is_jumping == true) {
	  	shp_path = 'resources/sheep_nobg/sheep_nobg';
	  	is_jumping = false;
	  }
	  if (timestring < 10) {
	  	timestring = "0" + String(timestring);
	  }
	  else {
	  	timestring = String(timestring);
	  }
	  shp.src = shp_path +'.0' + timestring + ".png";

	  //update background
	  bg_pos = -((t%(2*w*slowness/7))/(slowness/7));






	}

	function draw() {
	  // Draw the bg of the world
	  ctx.clearRect(0, 0, w, h);
	  ctx.drawImage(bg, w-bg_w + bg_pos, h-bg_h, bg_w,  bg_h);

	  ctx.save();  // save the current canvas state
      ctx.translate(w, 0);
	  ctx.scale(-1, 1);
      ctx.drawImage(bg, -(w + bg_pos), h-bg_h, bg_w,  bg_h);
      ctx.restore();

      ctx.drawImage(bg, w-bg_w + bg_pos + 2*w, h-bg_h, bg_w,  bg_h);

      //draw shp

	  if (is_jumping) {
	  	ctx.drawImage(shp, w/6, h-shp_h - (8 - Math.abs((Math.floor(time/slowness)%16) - 8))*h/200, shp_w, shp_h);
	  }
	  else {
	  	ctx.drawImage(shp, w/6, h-shp_h, shp_w, shp_h);
	  }


	}

	function loop(t) {
		time = t;
		var dt = t - last_t
		update(t, dt)
		draw()
		window.requestAnimationFrame(loop)
	}
	var last_t = 0
	window.requestAnimationFrame(loop)


	$(document).keydown(function(e){
	    if (e.keyCode == 32) {
	       	console.log( "space pressed" );
	       	if (!is_jumping) {
	       		shp_path = 'resources/sheep_jumping/sheep_jumping'
	       		last_t = time;
	       		is_jumping = true;
	       }

	    }
	});


	function auto_resize() {
		c.width  = window.innerWidth;
		c.height = window.innerHeight;
		w = c.width;
		h = c.height;
		shp_h = 2*h/5;
		shp_w = 2*w/5;
		bg_h = h;
		bg_w = w;
	}

	document.addEventListener("click", function(){
		rain_audio.switch();
		guitar_1.switch();

	});


	function sound(src) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		document.body.appendChild(this.sound);
		//this.sound.loop = true;


		this.play = function(){
		    this.sound.play();
		}
		this.stop = function(){
		    this.sound.pause();
		}

		this.switch = function() {
			if (this.sound.paused) {
				this.play();
			 }
			else {
			  	this.stop();
			}
		}
		this.sound.addEventListener('timeupdate', function(){
			console.log("buffer");
			console.log(this.currentTime, this.duration);
	    	var buffer = .44;
	    	if(this.currentTime > this.duration - buffer){
	        	this.currentTime = 0
	     	    this.play()
	    	}
		});
	}



};
