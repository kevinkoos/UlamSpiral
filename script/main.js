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

let scale_factor = 1;

// start the app
let app = new PIXI.Application({ width: innerWidth, height: innerHeight,
          resizeTo: window        
});
let renderer = app.renderer;
$('#container')[0].appendChild(app.view);

// circle template to generate texture
let gr = new PIXI.Graphics();  
gr.beginFill(0xFFFFFF);
gr.lineStyle(0);
gr.drawCircle(0, 0, 25);
gr.scale.set(0.4 * scale_factor);
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

// animation ticker
app.ticker.add((delta) => {
  elapsed += delta;
  
  // center container
  spiral.x = innerWidth/2;
  spiral.y = innerHeight/2;

});



















init_ui();
  
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

