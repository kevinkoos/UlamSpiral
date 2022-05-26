/**
 * @fileoverview Main file for controlling the ulam spiral visualization
 * @author Kevin Koos
 */
import { NUM_TYPE } from './integer.js';
import Integer from './integer.js';
import SpiralContainer from './spiralcontainer.js';
import Discrete from './discrete.js';


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
let unit_scale = 0.2;
let zoom_scale = 1;
let zoom_step = 0.1;
let mouse_pos = null;
let delay = 100;
let timeout = false;

// start the app
let app = new PIXI.Application({ 
  width: innerWidth, 
  height: innerHeight,
  resizeTo: window,
  antialias: true,
});
$('#container')[0].appendChild(app.view);
app.stage.interactive = true;

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
let spiral_container = new SpiralContainer(texture);
let frame = spiral_container.collection;
frame.pivot.set(0.5);
frame.x = innerWidth / 2;
frame.y = innerHeight / 2;
frame.scale.y = -1;
frame.interactive = true;
frame.interactiveChildren = false;

// center sample circle
let circle = new PIXI.Sprite(texture);
circle.tint = 0x00ffff;

frame.addChild(circle);
app.stage.addChild(frame);

let index_max = 10000;
let index = 0;
let batch_size = 5;
let i = 0;

// start the ui
init_ui();

// start first spiral
let spiral = new Discrete();

// animation ticker
app.ticker.add( (dt) => {
  
  if (index < index_max) {

    while (i < batch_size) {
      
      let int = new Integer(spiral.next());
      index = int.num;
      
      int.checkNumber();
    
      spiral_container.addNumber(int);
    
      i++
    }
    
    i = 0;
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
      } 
  });

  // spiral type dropdown menu
  $('#spiral-dropdown').ddslick({
    data: ddData,
    imagePosition: "right",
    width: 240,
    selectText: "Select your spiral type.",
    onSelected: function (data) {
        console.log(data);
    }
  });
  $('#spiral-dropdown')[0].style.width = '100%';

  // reset zoom button
  $('#reset-btn').button().on('click', (ev) => {
    ev.preventDefault();
    zoom_scale = 1;
    app.stage.x = 0;
    app.stage.y = 0;
    app.stage.scale.set(zoom_scale);
  });

  // help button
  $('#help-btn').button({
    showLabel: false,
    icon: "ui-icon-info"
  });

  // debounce resize event controller
  $(window).on('resize', (ev) => {
    clearTimeout(timeout);
    timeout = setTimeout(resize, delay);
  });

  // zoom and panning event
  $(app.view)
  .on('wheel', (ev) => {
    zoom(ev.clientX, ev.clientY, ev.originalEvent.deltaY < 0);
  })
  .on('mousedown', (ev) => {
    mouse_pos = {x: ev.offsetX, y: ev.offsetY};
  })
  .on('mouseup', (ev) => {
    mouse_pos = null;
  })
  .on('mousemove', (ev) => {
    if (mouse_pos) {
      app.stage.x += (ev.offsetX - mouse_pos.x);
      app.stage.y += (ev.offsetY - mouse_pos.y);
      mouse_pos = { x: ev.offsetX, y: ev.offsetY };
    }
  });

}

/**
 * zoom control function
 */
function zoom(x, y, zoomin) {
  const direction = zoomin ? 1 : -1;
  const old_pos = {
    x: (x - app.stage.x) / app.stage.scale.x,
    y: (y - app.stage.y) / app.stage.scale.y
  };
  
  zoom_scale *= 1 + direction * zoom_step;
  const new_pos = {
    x: (old_pos.x ) * zoom_scale + app.stage.x, 
    y: (old_pos.y) * zoom_scale + app.stage.y
  };

  app.stage.x -= (new_pos.x-x);
  app.stage.y -= (new_pos.y-y);
  app.stage.scale.set(zoom_scale);
}


/**
 * resize event function
 */
function resize() {
  // render at new size
  app.renderer.resize(innerWidth, innerHeight);

  // center spiral container
  frame.x = innerWidth/2;
  frame.y = innerHeight/2;
}

