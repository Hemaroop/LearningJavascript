// Assumption: All men are mortal. All Gods are immortal. And all Men and Gods have different names. 

const nameMortalityList = [
    {Name:"Zeus", Type:"God"},
    {Name:"Tony Stark", Type:"Man"},
    {Name:"Thor", Type:"God"},
    {Name:"Steve Rogers", Type:"Man"},
    {Name:"Natasha Romanov", Type:"Woman"},
    {Name:"Scarlet Witch", Type:"Woman"},
    {Name:"Bruce Banner", Type:"Man"}
];

const isMortal = (_name) => {
    if (typeof(_name) === "string")
    {
        const matchedList = nameMortalityList.filter((_identity) => {
            return _identity.Name.toUpperCase() === _name.toUpperCase(); 
        });
        if (matchedList.length == 0)
        {
            return "Unknown";
        }
        else
        {
            if (matchedList[0].Type.toUpperCase() === "MAN" || matchedList[0].Type.toUpperCase() === "WOMAN")
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
    else
    {
        return "Invalid Data Type for name";
    }
};

const outputMortalityList = (inputArr) => {
    return inputArr.map((_name) => {
        return isMortal(_name);
    });
}

inputNamesList = ["Tony Stark", "Natasha Romanov", "Zeus", "Hemaroop", 8];

console.log(outputMortalityList(inputNamesList));

// Cakes Function
const cakeFlavours = ["Vanilla", "Chocolate"]

const getCakeFlavour = (_flavoursArray, _indicator) => {
    if (_indicator)
    {
        return _flavoursArray.filter((_cakeFlav) => {
            return _cakeFlav.toLowerCase().search("chocolate") >= 0;
        });
    }
    else
    {
        return _flavoursArray.filter((_cakeFlav) => {
            return _cakeFlav.toLowerCase().search("chocolate") < 0;
        });
    }
};

console.log(getCakeFlavour(cakeFlavours, false));
console.log(getCakeFlavour(cakeFlavours, true));