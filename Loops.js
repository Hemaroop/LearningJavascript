// Homework 6: Loops 

const startNumber = 1;
const stopNumber = 100;

// I like Extra Credits...
const checkPrime = (num) => {
    let checkTillNum = Math.sqrt(num);
    for (let divisor = 2; divisor <= checkTillNum; divisor++) {
        if (num % divisor === 0) {
            return 0;
        }
    }
    return 1;
}


const fizzBuzzWhile = () => {
    let i = startNumber;
    while (i <= stopNumber) {
        if ( i > 1 && checkPrime(i) === 1) {
            console.log("Prime");
        }
        else if (i % 15 === 0){
            console.log("FizzBuzz");
        }
        else if (i % 3 === 0) {
            console.log("Fizz");
        }
        else if (i % 5 === 0) {
            console.log("Buzz");
        }
        else {
            console.log(i);
        }
        i++;
    }
};

const fizzBuzzFor = () => {
    for (let i = startNumber; i <= stopNumber; i++) {
        if (i > 1 && checkPrime(i) === 1) {
            console.log("Prime");
        }
        else if (i % 15 === 0){
            console.log("FizzBuzz");
        }
        else if (i % 3 === 0) {
            console.log("Fizz");
        }
        else if (i % 5 === 0) {
            console.log("Buzz");
        }
        else if (i % 5 === 0) {
            console.log("Buzz");
        }
        else {
            console.log(i);
        }
    }
};

//fizzBuzzWhile();
fizzBuzzFor();