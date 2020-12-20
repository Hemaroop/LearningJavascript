// Welcome to Homework 5 : Switch statements

// Constants for conversion between units of measurement
const secondsInMinute = 60;
const minutesInHour = 60;
const hoursInDay = 24;

// Different labels for same unit of measurement
const secLabels = ["second", "seconds"];
const minLabels = ["minute", "minutes"];
const hourLabels = ["hour", "hours"];
const dayLabels = ["day", "days"];

// Our beautiful function without loops
const timeAdder = (value1, label1, value2, label2) => {
    // Check if label is correct and complies with its associated value
    function labelCheck(value,label) {
        switch (value) {
            case 1:
                switch (label)
                {
                    case secLabels[0]:
                    case minLabels[0]:
                    case hourLabels[0]:
                    case dayLabels[0]:
                        return 0;
                    default:
                        return -1;
                }
            break;
            default:
                switch (label) {
                    case secLabels[1]:
                    case minLabels[1]:
                    case hourLabels[1]:
                    case dayLabels[1]:
                        return 0;
                    default:
                        return -1;
                }
        }
    }

    // Check if both values and labels are valid
    function valueLabelCheck(value,label) {
        switch (value) {
            case 0:
                return -1;
            default:
                return labelCheck(value,label);
        }
    }

    // Convert string labels into numbers
    function returnLabelIndex(label) {
        switch (label) {
            case secLabels[0]:
            case secLabels[1]:
                return 0;
            case minLabels[0]:
            case minLabels[1]:
                return 1;
            case hourLabels[0]:
            case hourLabels[1]:
                return 1;
            case dayLabels[0]:
            case dayLabels[1]:
                return 1;
        }
    }

    // Returns a single value and label index 
    function combinedValues(val1, lab1, val2, lab2) {
        let val3 = 0;
        let lab3 = 0;
        switch (lab1) {
            case 0:
                if (val1 % secondsInMinute === 0) {
                    val1 /= secondsInMinute;
                    lab1 += 1;
                }
                else {
                    lab3 = lab1;
                    break;
                }
            case 1:
                if (lab1 === lab2) {
                    val3 = val1 + val2;
                    lab3 = lab1;
                    break;
                }
                else if (val1 % minutesInHour === 0) {
                    val1 /= minutesInHour;
                    lab1 += 1;
                }
                else {
                    lab3 = lab1;
                    break;
                }
            case 2:
                if (lab1 === lab2) {
                    val3 = val1 + val2;
                    lab3 = lab1;
                }
                else if (val1 % hoursInDay === 0) {
                    val1 /= hoursInDay;
                    lab1 += 1;
                    val3 = val1 + val2;
                    lab3 = lab1;
                }
                else {
                    lab3 = lab1;
                }
            break;
        }
        if ( lab3 !== lab2 ) {
            switch (lab2) {
                case 3:
                    val2 *= hoursInDay;
                    lab2 -= 1;
                case 2:
                    if ( lab3 === lab2 ) {
                        val3 = val1 + val2;
                        break;
                    }
                    else {
                        val2 *= minutesInHour;
                        lab2 -= 1;
                    }
                case 1:
                    if ( lab3 === lab2 ) {
                        val3 = val1 + val2;
                    }
                    else
                    {
                        val2 *= secondsInMinute;
                        lab2 -= 1;
                        val3 = val1 + val2;
                    }
                break;                                
            }
        }
        return [val3, lab3];
    }

    // Return appropriate label using value and label index
    function returnLabel(value, lIndex) {
        if (value === 1) {
            switch (lIndex) {
                case 1:
                    return minLabels[0];
                case 2:
                    return hourLabels[0];
                case 3:
                    return dayLabels[0]; 
            }
        }
        else {
            switch (lIndex) {
                case 0:
                    return secLabels[1];
                case 1:
                    return minLabels[1];
                case 2:
                    return hourLabels[1];
                case 3:
                    return dayLabels[1]; 
            }
        }
    }

    // Everything else
    let l1 = 0;
    let l2 = 0;
    let l3 = 0;
    let value3 = 0;

    if (typeof(value1) === "number" && typeof(value2) === "number" && 
        typeof(label1) === "string" && typeof(label2) === "string") {
        if (valueLabelCheck(value1, label1) === 0 && valueLabelCheck(value2, label2) === 0) {
            l1 = returnLabelIndex(label1);
            l2 = returnLabelIndex(label2);
            if (l1 !== l2) {
                if (l1 < l2) {
                    [value3, l3] = combinedValues(value1, l1, value2, l2);
                }
                else {
                    [value3, l3] = combinedValues(value2, l2, value1, l1);
                }
            }
            else {
                value3 = value1 + value2;
                l3 = l1;
            }
            switch (l3) {
                case 0:
                    if (value3 % hoursInDay === 0)
                    {
                        value3 /= hoursInDay;
                        l3 += 1;
                    }
                case 1:
                    if (value3 % minutesInHour === 0)
                    {
                        value3 /= minutesInHour;
                        l3 += 1;
                    }                    
                case 2:
                    if (value3 % hoursInDay === 0)
                    {
                        value3 /= hoursInDay;
                        l3 += 1;
                    }
                break;
            }
            return [value3, returnLabel(value3, l3)];
        }
        else {
            return "Failed value and label checks";
        }
    }
    else {
        return "Incorrect argument type";
    }
};

console.log(timeAdder(30, "seconds", 2, "minutes"));
//console.log(timeAdder(1439, "minutes", 86460, "seconds"));
