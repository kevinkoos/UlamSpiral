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
let zoom_step = 0.1;

// start the app
let app = new PIXI.Application({ 
  width: innerWidth, 
  height: innerHeight,
  resizeTo: window        
});
$('#container')[0].appendChild(app.view);


// circle template to generate texture
let gr = new PIXI.Graphics();  
gr.beginFill(0xFFFFFF);
gr.lineStyle(0);
gr.drawCircle(0, 0, 25);
gr.scale.set(0.4 * unit_scale);
gr.endFill();

// generate texture from template graphics
let texture = app.renderer.generateTexture(gr);
texture.defaultAnchor.set(0.5); // center

// container
let spiral = new PIXI.Container();
spiral.pivot.set(0.5);
spiral.x = innerWidth / 2;
spiral.y = innerHeight / 2;
spiral.interactive = true;
spiral.interactiveChildren = false;

// center sample circle
let circle = new PIXI.Sprite(texture);
circle.tint = 0x00ffff;

spiral.addChild(circle);
app.stage.addChild(spiral);


let elapsed = 0.0;
let index = 1;
let index_max = 20000;

let pos = { x: 0, y: 0 };
let delta = { x: 1, y: 0 };

let segment_limit = 1;
let segment_step = 0;

let delay = 100;
let timeout = false;

// start the ui
init_ui();

// animation ticker
app.ticker.add( (dt) => {
  elapsed += dt;
  
  while (index < index_max) {

    pos.x += delta.x;
    pos.y += delta.y;
    segment_step++;

    if (segment_step == segment_limit) {

      if (delta.x == 0) {
        segment_limit++;
      }

      var temp = delta.x;
      delta.x = -delta.y;
      delta.y = temp;

      segment_step = 0;
    }

    index++

    if (is_prime(index)) {
      let prime_circle = new PIXI.Sprite(texture);
      prime_circle.x = pos.x * unit_size;
      prime_circle.y = pos.y * unit_size;
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

  // zoom slider and event
  $('#zoom-slider').slider({
    value: zoom_scale,
    orientation: 'horizontal',
    max: 2,
    min: 0.1,
    step: zoom_step,
    range: 'min',
    slide: (ev, ui) => {
      spiral.scale.set(ui.value);
      zoom_scale = ui.value;
    }
  });
  

  // debounce resize event controller
  $(window).on('resize', (ev) => {
    clearTimeout(timeout);
    timeout = setTimeout(resize, delay);
  });

  // zoom event handler
  app.view.addEventListener('mousewheel', (ev) => {
    if (ev.deltaY < 0) { 
        zoom_scale += zoom_step;
    }
    else if (ev.deltaY > 0) { // scroll down
      zoom_scale -= zoom_step;
    }
    spiral.scale.set(zoom_scale);
    // update slider value
    $('#zoom-slider').slider('value', zoom_scale);
  });

}

/**
 * resize event function
 */
function resize() {
  // render at new size
  app.renderer.resize(innerWidth, innerHeight);

  // center spiral container
  spiral.x = innerWidth/2;
  spiral.y = innerHeight/2;
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

