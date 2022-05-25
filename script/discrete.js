/**
 * Discrete spiral class defintion
 */
import Spiral from './spiral.js';

class Discrete extends Spiral {

    constructor() {
        super();
        this.segment_limit = 1;
        this.segment_step = 0;
    }


    /**
     * Generate next number and position in counter clockwise pattern 
     */
    next() {

        this.pos.x += this.delta.x;
        this.pos.y += this.delta.y;
        this.segment_step++;

        if (this.segment_step == this.segment_limit) {

            if (this.delta.x == 0) {
                this.segment_limit++;
            }
    
            let temp = this.delta.x;
            this.delta.x = -this.delta.y;
            this.delta.y = temp;
    
            this.segment_step = 0;

        }

        this.index++;

        return [this.index, this.pos];
    }
    
}

export default Discrete;