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
var spiral_type = 'desc';

var ddData = [
  {
    text: "Discrete",
    value: 0,
    selected: true,
    description: "Discrete spiral on a grid.",
    imageSrc: "discrete.svg"
  },
  {
    text: "Archimedean",
    value: 1,
    selected: false,
    description: "Archimedean spiral.",
    imageSrc: "archimedean.svg"
  }
];

/**
 * Initializes the canvas and starts the drawing
 */
const canvas = document.getElementById('window');
const panzoom = Panzoom(canvas, {
  maxScale: 1,
  minScale: 0.1,
  step: 0.3,
  cursor: 'default',
  roundPixels: true
});

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

  // spiral type dropdown menu
  $('#spiral-dropdown').ddslick({
    data: ddData,
    width: 280,
    imagePosition: "right",
    selectText: "Select your spiral type.",
    onSelected: function (data) {
        console.log(data);
    }
  });

  // zoom slider binding
  $('#zoom-slider').on('input', (event) => {
    panzoom.zoom(event.target.valueAsNumber);
  });

  // mousewheel zoom event
  $(window).on('mousewheel', (event) => {
    var zoom = $('#zoom-slider')[0];
    console.log('step!');
    if (event.originalEvent.wheelDelta/120 > 0) {
      zoom.stepUp();
    } else {
      zoom.stepDown();
    }
    panzoom.zoom(zoom.value);
  });

  // resize event
  $(window).on('resize', (event) => {
    var pan_x = (window.innerWidth - ctx.canvas.width) / 2;
    var pan_y = (window.innerHeight - ctx.canvas.height) / 2;
    panzoom.pan(pan_x, pan_y);
  });
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
      
      //TODO: turn this into a function for turn generalization
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

