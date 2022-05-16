/**
 * @fileoverview Main file for controlling the ulam spiral visualization
 * @author Kevin Koos
 */

var unit_length = 5;
var box_size = 3;
var scale_factor = 3

var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];

var index = 5; // start index
//var index_max = window.innerWidth * window.innerHeight - 1;
var index_max = 10000;
var cx = -unit_length, cy = unit_length;  // current pos
var dx = 0, dy = -unit_length;  // direction vector
var segment_length = 2;
var seg_step = 0;
var skip_frame = 0;
var skip_step = 0;
var inc_limit = 2;

/**
 * Initializes the canvas and starts the drawing
 */
var canvas = document.getElementById('window');

if (canvas.getContext) {
  var ctx = canvas.getContext('2d');

  // initialize the canvas
  init_canvas(ctx);

  // initalize the ui
  init_ui(ctx);

  // start drawing
  draw(ctx);
}


  
function init_canvas() {
  // set width and height to window size
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  // translate origin to center
  ctx.translate(window.innerWidth / 2, window.innerHeight / 2);

  // scale
  ctx.scale(scale_factor, -scale_factor);

  // center box and 2,3,5 boxes
  ctx.save();
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.fillRect(0, 0, box_size, box_size);
  ctx.restore();
  ctx.fillRect(unit_length, 0, box_size, box_size);
  ctx.fillRect(unit_length, unit_length, box_size, box_size);
  ctx.fillRect(cx, cy, box_size, box_size);
}

function init_ui() {
  $('#ui-window').draggable();
}

/**
 * Main draw function for the canvas
 * @param context: 
 * @returns none
 */
function draw() {

  while (true) {

    for (var i = 0; i < inc_limit; i++){
      //update position
      cx += dx;
      cy += dy;
      seg_step++;
        
      //corner
      if (seg_step == segment_length) {
        
        //increase side length size
        if (dx == 0) {
          segment_length++;
        }
    
        //turn
        var temp = dx;
        dx = -dy;
        dy = temp;
    
        //reset segment index
        seg_step = 0;
      }
      
      //increment num
      index++;
    }

    if (inc_limit == 2) {
      inc_limit = 4;
    } else {
      inc_limit = 2;
    }

    //check and draw
    if (is_prime(index)) {
      ctx.fillRect(cx, cy, box_size, box_size);
      break;
    }
  }

  //quicken animation
  if (skip_frame == skip_step) {
    skip_step = 0;
    if (index < index_max) {
      window.requestAnimationFrame(draw);
    }
  } else {
    skip_step++;
    draw();
  }
}

/**
 * Checks primality of given number.
 */
function is_prime(num){

  if (primes.includes(num)) { 
    return true; 
  }

  for (var i = 0; i < primes.length; i++) {

    if (num % primes[i] == 0) {
      return false;
    }

  }

  primes.push(num);
  return true;
}

