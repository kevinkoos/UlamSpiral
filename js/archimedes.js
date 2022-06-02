/**
 * Archimedes spiral class defintion also known as Sacks spiral
 */
 import Spiral from './spiral.js';

 class Archimedes extends Spiral {

    constructor() {
        super();
        this.index = 0; // lets us draw the first dot (not in the center)
    }


    /**
     * Calculate next position based from polar coordinate equations
     * Each rotation around the circle should be a perfect square
     */
    next() {
        this.index++;
        this.pos.x = Math.cos(Math.sqrt(this.index)*2*Math.PI) * Math.sqrt(this.index);
        this.pos.y = Math.sin(Math.sqrt(this.index)*2*Math.PI) * Math.sqrt(this.index);
        this.pos.x *= this.unit_size;
        this.pos.y *= this.unit_size;
        return [this.index, this.pos];
    }
    
 }
 
 export default Archimedes;