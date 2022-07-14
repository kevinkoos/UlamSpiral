/**
 * Spiral class definition of the 
 */

class Spiral {

    /**
     * pos: x and y positions
     * delta: x and y delta of next step
     */
    constructor(size) {
        this.pos = { x: 0, y: 0 };
        this.index = 1;
        this.unit_size = size;
    }

    /**
     * Override function, generate next number and position
     */
    next() {

    }

}

export default Spiral;