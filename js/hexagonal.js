/**
 * Hexagonol spiral class defintion
 */
import Spiral from './spiral.js';

class Hexagonol extends Spiral {

    constructor(size) {
        super(size);
        this.index = 1; // lets us draw the first dot (not in the center)
        this.pos.x = this.unit_size; // start #1 offset of center.

        this.segment_limit = 1;
        this.segment_step = 0;

        this.axial = {x: 1, y: 0}; // axial coordinate system for hex grids
        this.directions = [
            {x: -1, y: -1},
            {x: -1, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 1},
            {x: 1, y: 0}, 
            {x: 0, y: -1}
        ];
        this.step = 0;
        this.cos30 = Math.cos(Math.PI / 6); // cos(30*) for axial -> euclidean
    }


    /**
     * Calculate next position based from polar coordinate equations
     */
    next() {
        
        // update axial coords
        this.axial.x += this.directions[this.step].x;
        this.axial.y += this.directions[this.step].y;

        this.pos.x = this.unit_size * this.cos30 * (2 * this.axial.x - this.axial.y);
        this.pos.y = -(this.axial.y) * (this.unit_size * 1.5);
        this.segment_step++;

        // 5th step around needs an extra segment 
        if ( ((this.segment_step == this.segment_limit) && (this.step !== 4)) || 
                this.segment_step == this.segment_limit+1 ) {
            
            // change directions
            if (this.step == 5) {
                this.step = 0;
                this.segment_limit++;
            } else {
                this.step++; 
            }

            this.segment_step = 0;
        }

        this.index++;
        return [this.index, this.pos];
    }

    
}

function toRadians(arg) {
    return arg * (Math.PI / 180);
}

 export default Hexagonol;