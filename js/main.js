/**
 * @fileoverview Main file for controlling the ulam spiral visualization
 * @author Kevin Koos
 */
import { NUM_TYPE } from './integer.js';
import Integer from './integer.js';
import SpiralContainer from './spiralContainer.js';
import Discrete from './discrete.js';
import Archimedes from './archimedes.js';
import Vogel from './vogel.js';
import Hexagonol from './hexagonal.js';

// constants
let zoom_scale = 1;
let zoom_step = 0.1;
let mouse_pos = null;
let delay = 100;
let timeout = false;
let unit_size = 10;

// spiral types
let spirals = {
  'discrete': Discrete,
  'archimedes': Archimedes,
  'vogel': Vogel,
  'hexagonal': Hexagonol
}

// start the app
let app = new PIXI.Application({ 
  width: innerWidth, 
  height: innerHeight,
  resizeTo: window,
  antialias: true,
});
$('#container')[0].appendChild(app.view);
app.stage.interactive = true;

console.log(app.renderer.constructor.name);

// generate texture from template graphics
let texture = app.renderer.generateTexture(generate_template());
texture.defaultAnchor.set(0.5); // center

// container
let spiral_container = new SpiralContainer(texture);
let frame = init_frame(spiral_container);

// center sample circle
let circle = new PIXI.Sprite(texture);
circle.tint = 0x00ffff;

frame.addChild(circle);
app.stage.addChild(frame);

let index_max = 10000;
let index = 0;
let batch_size = 10;
let i = 0;

// start the ui
init_ui();

// start first spiral
let spiral = new spirals['discrete'](unit_size);

// animation ticker
app.ticker.add( (dt) => {

  i = 0;
  while (i < batch_size) {

    if (index < index_max) {
    
      let int = new Integer(spiral.next());
      index = int.num;

      int.checkNumber();
    
      spiral_container.addNumber(int);
    
    }
        
    i++;
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

  $('#help-window').dialog({ 
    dialogClass: 'help-window',
    show: true,
    autoOpen: false,
    position: { my: 'top+50', at: 'top'}
  });
  
  $('#spiral-dropdown').multiselect({
    header: false,
    selectedList: 1,
    click: (ev, ui) => { 
      // update icon in select menu bar
      $('#spiral-icon').remove();
      let icon = document.createElement('img');
      icon.setAttribute('src', 'images/' + ui.value + '.svg');
      icon.id = 'spiral-icon';
      $('#spiral-dropdown_ms').prepend(icon);

      // change spiral and reset values
      reset();      
      spiral = new spirals[ui.value](unit_size);

    }
  });
  let icon = document.createElement('img');
  icon.setAttribute('src', 'images/discrete.svg');
  icon.id = 'spiral-icon';
  $('#spiral-dropdown_ms').prepend(icon);


  $('#number-type').multiselect({
    header: false,
    selectedList: 4,
    noneSelectedText: "Select a number type.",
    click: (ev, ui) => {
      spiral_container.toggleType(ui.value);
    }
  });

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
    icon: "ui-icon-info",
    showLabel: false
  }).on('click', (ev) => {
    $('#help-window').dialog('open');
  });

  $('#github-btn').button({
    icons: {primary: 'ui-icon-github', secondary: null},
    showLabel: false
  }).on('click', (ev) => {
    window.open('https://github.com/kevinkoos/UlamSpiral', '_blank');
  });

  $('#wiki-btn').button({
    icons: {primary: 'ui-icon-wiki', secondary: null},
    showLabel: false
  }).on('click', (ev) => {
    window.open('https://en.wikipedia.org/wiki/Ulam_spiral', '_blank');
  });

  // speed control
  $('#batch-spinner').spinner({
    min: 5,
    max: 100,
    spin: (ev, ui) => {
      batch_size = ui.value;
    }
  }).on('wheel', (ev) => {
    if (ev.originalEvent.deltaY < 0) {
      $('#batch-spinner').spinner("stepUp");
    } else {
      $('#batch-spinner').spinner("stepDown");
    }
  });

  // gap control
  $('#size-spinner').spinner({
    min: 1,
    max: 100,
    spin: (ev, ui) => {
      unit_size = ui.value;
    }
  }).on('wheel', (ev) => {
    if (ev.originalEvent.deltaY < 0) {
      $('#size-spinner').spinner("stepUp");
    } else {
      $('#size-spinner').spinner("stepDown");
    }
  });
  $('#size-spinner').tooltip();

  // increase max of generations
  $('#inc-max-btn').button({
    showLabel: false
  }).on('click', (ev) => {
    index_max += 10000;
    $('#total-value').html('N: ' + index_max);
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
  .on('pointerdown', (ev) => {
    mouse_pos = {x: ev.offsetX, y: ev.offsetY};
  })
  .on('pointerup', (ev) => {
    mouse_pos = null;
  })
  .on('pointermove', (ev) => {
    if (mouse_pos) {
      app.stage.x += (ev.offsetX - mouse_pos.x);
      app.stage.y += (ev.offsetY - mouse_pos.y);
      mouse_pos = { x: ev.offsetX, y: ev.offsetY };
    }
  });

  // hide and show buttons
  $('#hide-btn').button({
    icon: "ui-icon-caret-1-n",
    showLabel: false
  }).on('click', (ev) => {
    $('#ui-window').css('display', 'none');
    $('#container-btns').css('display', 'block');
  });
  $('#show-btn').button({
    icon: "ui-icon-caret-1-s",
    showLabel: false
  }).on('click', (ev) => {
    $('#container-btns').css('display', 'none');
    $('#ui-window').css('display', 'block');
  });



  // update numbers
  update_total();

}


/**
 * updates the total number
 */
function update_total() {
  $('#total-value').html('N: ' + index_max);
}


/**
 * initialize frame (container of all number types)
 */
function init_frame(container) {
  let frame = spiral_container.collection;
  frame.pivot.set(0.5);
  frame.x = innerWidth / 2;
  frame.y = innerHeight / 2;
  frame.scale.y = -1;
  frame.interactive = true;
  frame.interactiveChildren = true;

  return frame;
}


/**
 * reset containers for changing spirals
 */
function reset() {
  app.stage.removeChild(frame);
  spiral_container = new SpiralContainer(texture);
  frame = init_frame(spiral_container);
  app.stage.addChild(frame);

  // center sample circle
  let circle = new PIXI.Sprite(texture);
  circle.tint = 0x00ffff;

  frame.addChild(circle);

  index = 0;
  i = 0;
  index_max = 10000;
  update_total();

  $('#number-type').multiselect('value', 'prime');
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


/**
 * generates the texture used for circles
 */
function generate_template() {
  // circle template to generate texture
  let gr = new PIXI.Graphics();  
  gr.beginFill(0xFFFFFF);
  gr.lineStyle(0);
  gr.drawCircle(0, 0, 2.5);
  gr.endFill();

  return gr;
}