/**
 * Vogel spiral class defintion
 */
 import Spiral from './spiral.js';

 class Vogel extends Spiral {

    constructor() {
        super();
        this.index = 0; // lets us draw the first dot (not in the center)
        this.phi = (1 + Math.sqrt(5)) / 2; // golden ratio
        this.scale = 7;

        this.arg = 1;
        this.r = 1;
    }


    /**
     * Calculate next position based from polar coordinate equations
     */
    next() {
        this.index++;
        this.r = this.scale * Math.sqrt(this.index)
        this.arg = this.index * 2*Math.PI / (this.phi*this.phi); // golden angle

        this.pos.x = this.r * Math.cos(this.arg);
        this.pos.y = this.r * Math.sin(this.arg);
        return [this.index, this.pos];
    }
    
 }
 
 export default Vogel;