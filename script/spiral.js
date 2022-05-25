/**
 * Spiral class definition of the 
 */
const unit_size = 5;

class Spiral {

    /**
     * pos: x and y positions
     * delta: x and y delta of next step
     */
    constructor() {
        this.pos = { x: 0, y: 0 };
        this.delta = { x: unit_size, y: 0 };
        this.index = 1;
    }

    /**
     * Override function, generate next number and position
     */
    next() {

    }

}

export default Spiral;