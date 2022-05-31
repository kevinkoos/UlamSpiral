/**
 * Container class for the different layers in the canvas representing different
 * types of numbers to show on the screen.
 */
import Integer from "./integer.js";
import {NUM_TYPE} from "./integer.js";

class SpiralContainer {

    constructor(texture) {
        this.collection = new PIXI.Container();
        this.containers = {};
        this.texture = texture;

        for (const prop in NUM_TYPE) {
            this.containers[NUM_TYPE[prop]] = new PIXI.Container();
            this.containers[NUM_TYPE[prop]].visible = false;

            this.collection.addChild(this.containers[NUM_TYPE[prop]]);
        }

        // toggle primes spiral container to show
        this.containers[NUM_TYPE.PRIME].visible = true;
    }


    // return the graphics container
    get container() {
        return this.collection;
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

        this.containers[type].addChild(circle);
    }

}

export default SpiralContainer;