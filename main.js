/**
 * @fileoverview Main file for controlling the ulam spiral visualization
 * @author Kevin Koos
 */

var unit_length = 5;
var box_size = 3;
var scale_factor = 3

var index = 1;
//var index_max = window.innerWidth * window.innerHeight - 1;
var index_max = 1000;
var cx = 0, cy = 0;  // current pos
var dx = unit_length, dy = 0;  // direction vector
var segment_length = 1;
var seg_step = 0;
var skip_frame = 0;
var skip_step = 0;

/**
 * Initializes the canvas and starts the drawing
 */
$(window).on('load', function () {
  var canvas = document.getElementById('window');

  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
  
    // set width and height to window size
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    // translate origin to center
    ctx.translate(window.innerWidth / 2, window.innerHeight / 2);

    // scale
    ctx.scale(scale_factor, -scale_factor)

    // sample box
    ctx.save();
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(0, 0, box_size, box_size);
    ctx.restore();

    draw(ctx);
  }

  /**
   * Main draw function for the canvas
   * @param context: 
   * @returns none
   */
  function draw() {
  
    //update position
    cx += dx;
    cy += dy;
    seg_step++;
  
    //draw
    ctx.fillRect(cx, cy, box_size, box_size);
  
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
    
    index++;
  
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

  function is_prime(){

  }

});
