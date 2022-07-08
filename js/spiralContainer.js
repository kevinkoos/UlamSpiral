/**
 * Container class for the different layers in the canvas representing different
 * types of numbers to show on the screen.
 */
import Integer from "./integer.js";
import {NUM_TYPE} from "./integer.js";

// color hex value based off the IBM color blind safe palette
const color_tints = {
    'prime': 0xffffff,
    'composite': 0x785ef0,
    'square': 0xdc267f,
    'triangular': 0xffb000,
    'fibonacci': 0x648fff,
    'centerTriangular': 0xffffff,
    'pentagonal': 0xffffff,
    'centerSquare': 0xffffff,
    'twinPrime': 0x20aeff
}

class SpiralContainer {

    constructor(texture) {
        this.collection = new PIXI.Container();
        this.containers = {};
        this.texture = texture;

        for (const prop in NUM_TYPE) {
            this.containers[NUM_TYPE[prop]] = new PIXI.Container();
            this.containers[NUM_TYPE[prop]].visible = false;

            // color tint containers
            let color_tint = new PIXI.filters.ColorMatrixFilter();
            color_tint.tint(color_tints[NUM_TYPE[prop]]);
            this.containers[NUM_TYPE[prop]].filters = [color_tint];
        
            this.collection.addChild(this.containers[NUM_TYPE[prop]]);
        }

        // toggle primes spiral container to show
        this.containers[NUM_TYPE.PRIME].visible = true;
    }


    // toggle type visibility
    toggleType(name) {
        this.containers[name].visible 
            = !this.containers[name].visible;
        this.containers[name].updateTransform();
    }


    // add num from integer obj to correct containers
    addNumber(int) {
        // loop over flags in int
        for (const [key, value] of Object.entries(int.type)) {
            if (value) {
                this.addCircle(key, int);
            }
        }

    }


    // add a circle to indicated container
    addCircle(type, int) {
        let circle = new PIXI.Sprite(this.texture);
        circle.name = int.num;
        circle.x = int.x;
        circle.y = int.y;
        circle.interactive = true;
        circle.on('pointerover', SpiralContainer.hover);

        if (type == NUM_TYPE.COMPOSITE) {
            circle.height = 1 + int.nfactors * 2;
            circle.width = 1 + int.nfactors * 2;
        }

        this.containers[type].addChild(circle);
    }


    // pointer hover event for spites
    static hover() {
        $('#current-value').html('Current: ' + this.name);
    }

}

export default SpiralContainer;