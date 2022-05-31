/**
 * Number encapsulation for checking qualites of numbers
 */

// enum of type of numbers being tracked
// add an enum, function, and map entry for each type
export const NUM_TYPE = {
    PRIME: 'prime',
    COMPOSITE: 'composite',
    SQUARE: 'square',
    CUBE: 'cube',
    TRIANGULAR: 'triangular',
    FIBONACCI: 'fibonacci'
};


class Integer {
    
    static primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    
    
    constructor([num, pos]) {
        this.num = num;
        this.pos = pos;
        this.nfactors = 0; // # of UNIQUE prime factors
        this.type = {};
        
        for (const prop in NUM_TYPE) {
            this.type[NUM_TYPE[prop]] = false;
        }
        
        this.checkNumber();
    }
    
    
    // getters
    get x() { return this.pos.x }
    get y() { return this.pos.y } 
    
    
    // set flags for number and count factors
    checkNumber() {
        [this.type[NUM_TYPE.PRIME], this.nfactors] = Integer.is_prime(this.num);
        this.type[NUM_TYPE.COMPOSITE] = !this.type[NUM_TYPE.PRIME];
        
        for (const [key, value] of Object.entries(NUM_FUNC)) {
            this.type[key] = value(this.num);
        }
        
    }
    
    /**
     * Checks primality of given number. Bases on the iterative modulus sieve
     * with some optimizations. 
     * TODO: add in number of factors found, may extract method
     */
    static is_prime(num) {
        let is_comp = false;
        let nfactors = 0;
        
        if (Integer.primes.includes(num)) { 
            return [true, 0]; 
        }
        
        for (var i = 0; i < Integer.primes.length; i++) {
            if (num % Integer.primes[i] == 0) {
                is_comp = true;
                nfactors++;
            }
        }
        
        if (is_comp) {
            return [false, nfactors]
        } else {
            Integer.primes.push(num);
            return [true, 0];
        }
    }
    
    
    /**
     * Check if number is a perfect square
     */
    static is_square(num) {
        let rt = Math.floor(Math.sqrt(num))
        return (rt*rt == num);
    }
    
    
    /**
     * Check if a number is a perfect cube
     */
    static is_cube(num) {
        let rt = Math.floor(Math.cbrt(num))
        return (rt*rt*rt == num);
    }

    
    /**
     * Check if a number is a triangular number
     * If n is the mth tri number n = m*(m+1)/2 so
     * m=(sqrt(8n+1)-1)/2 => 8n+1 is a perfect square
     */
    static is_triangular(num) {
        return Integer.is_square(8*num+1);
    }
    
    
    /**
     * Check is a number is a fibonacci number
     * based on Gessels test
     */
    static is_fibonacci(num) {
        return (Integer.is_square(5*num*num+4) ||
        Integer.is_square(5*num*num-4));
    }
    
}

// map key values to corresponing functiuon
const NUM_FUNC = {
    'square': Integer.is_square,
    'cube': Integer.is_cube,
    'triangular': Integer.is_triangular,
    'fibonacci': Integer.is_fibonacci
}

export default Integer;