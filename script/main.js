/**
 * @fileoverview Main file for controlling the ulam spiral visualization
 * @author Kevin Koos
 */
let primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];

// data for dropdown menu
let ddData = [
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

// constants
let unit_size = 10;
let unit_scale = 0.2;
let zoom_scale = 1;

// start the app
let app = new PIXI.Application({ width: innerWidth, height: innerHeight,
  resizeTo: window        
});
let renderer = app.renderer;
$('#container')[0].appendChild(app.view);
init_ui();

// circle template to generate texture
let gr = new PIXI.Graphics();  
gr.beginFill(0xFFFFFF);
gr.lineStyle(0);
gr.drawCircle(0, 0, 25);
gr.scale.set(0.4 * unit_scale);
gr.endFill();

// generate texture from template graphics
let texture = renderer.generateTexture(gr);
texture.defaultAnchor.set(0.5); // center

// container
let spiral = new PIXI.Container();
spiral.x = innerWidth / 2;
spiral.y = innerHeight / 2;

// center sample circle
let circle = new PIXI.Sprite(texture);

spiral.addChild(circle);
app.stage.addChild(spiral);


let elapsed = 0.0;
let index = 1;
let index_max = 20000;
let cx = 0, cy = 0;
let dx = 1, dy = 0;
let segment_limit = 1;
let segment_step = 0;

// animation ticker
app.ticker.add((delta) => {
  elapsed += delta;
  
  // center container
  spiral.x = innerWidth/2;
  spiral.y = innerHeight/2;

  while (index < index_max) {

    cx += dx;
    cy += dy;
    segment_step++;

    if (segment_step == segment_limit) {

      if (dx == 0) {
        segment_limit++;
      }

      var temp = dx;
      dx = -dy;
      dy = temp;

      segment_step = 0;
    }

    index++

    if (is_prime(index)) {
      let prime_circle = new PIXI.Sprite(texture);
      prime_circle.x = cx * unit_size;
      prime_circle.y = cy * unit_size;
      spiral.addChild(prime_circle);
      break;
    }

  }

});


/**
 * Initializes the UI
 */
function init_ui() {
  // ui window functionality
  $('#ui-window').draggable({ 
      containment: "#container", 
      scroll: false,
      stop: function(e, ui) { 
        var percLeft = ui.position.left/ui.helper.parent().width()*100;
        var percTop = ui.position.top/ui.helper.parent().height()*100;
        ui.helper.css('left', percLeft + '%');      
        ui.helper.css('top', percTop + '%');    
        } })
    .resizable({ 
      aspectRatio: false
  });

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

}

/**
 * Checks primality of given number. Bases on the iterative modulus sieve
 * with some optimizations. 
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

