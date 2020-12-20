// Homework #3: If statement and Operators

//Task 1: Socrates
const speciesMen = {
    Singular: "man",
    Plural: "men", 
    Mortality: "mortal",
    printFact: function(){
        console.log((speciesMen.Plural + " are " + speciesMen.Mortality).toUpperCase());
    },
}; 

const socratesObject = {
    Name: "Socrates",
    Type: "Man",
};

speciesMen.printFact();
if ((socratesObject.Type.toUpperCase() === speciesMen.Singular.toUpperCase())
|| (socratesObject.Type.toUpperCase() === speciesMen.Plural.toUpperCase())){
    socratesObject.Mortality = speciesMen.Mortality;
}

console.log((socratesObject.Name + " is/are " + socratesObject.Type).toUpperCase());
console.log(("Therefore, " + socratesObject.Name + " is/are " + socratesObject.Mortality).toUpperCase());

//Task 2: Cake
const cakeFlavour = "chocolate";
if ((cakeFlavour !== "vanilla") && 
(cakeFlavour !== "chocolate")){
    console.log("Cake can only be either chocolate or vanilla.");
}
else if (cakeFlavour !== "vanilla"){
    console.log("The cake is not vanilla.");
    console.log("Yayy!! It is a Chocolate Cake!!");
}
else {
    console.log("It is a Vanilla Cake!!");
}