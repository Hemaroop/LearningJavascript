var namePattern = new RegExp("[A-Za-z]{1,}");
var nonAlphabetChars = new RegExp("[^A-Za-z]+");
var eMailPattern = new RegExp("[A-Za-z0-9._%+-]+@[a-z0-9.-]+[.]{1}[a-z]{2,}$");
var passwordPattern = new RegExp("(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}");

var signUpForm = null;
var logInForm = null;

// Disable an active div element
const disableActiveDiv = (divId) => {
    try {
        document.getElementById(divId).setAttribute("class", "inactiveDiv");
        document.getElementsByTagName("h3")[0].hidden = false;
    } catch (navError) {
        console.log(navError.name);
    }
};

// Enable an inactive div element
const enableInactiveDiv = (divId) => {
    setTimeout(() => {
        try {
            var childDivs = document.getElementById(divId).getElementsByTagName("div");
            document.getElementsByTagName("h3")[0].hidden = true;
            document.getElementById(divId).setAttribute("class", "activeDiv");
            for (var divElement of document.getElementById(divId).getElementsByTagName("div")) {
                divElement.setAttribute("class", "activeDiv");    
            }
        } catch (navError) {
            console.log(navError.name);
        }
    }, 200);
};

// On clicking Sign Up button on landing page
const goToSignUpPage = () => {
     console.log("You have requested to go to sign up page!!");
    disableActiveDiv("landingPage");
    enableInactiveDiv("signUpPage");
    signUpForm = document.getElementById("signUpForm");
    signUpForm.reset();
    document.getElementById("agreeBox").checked = false;
    document.getElementById("submitSignUpForm").addEventListener("click", createAccount);
};

// On clicking Log In button on landing page
const goToLogInPage = () => {
    console.log("You have requested to go to log in page!!");
    disableActiveDiv("landingPage");
    enableInactiveDiv("logInPage");
    logInForm = document.getElementById("logInForm");
    logInForm.reset();
    document.getElementById("submitLogInForm").addEventListener("click", logIntoAccount);
};

const goToDashboard = (currentDIvId) => {
    console.log("Taking you to the dashboard...");
    disableActiveDiv(currentDIvId);
    enableInactiveDiv("dashboard");
}

// Error messages for form fields
const displayErrorMsg = (msgElementId, msgTxt) => {
    document.getElementById(msgElementId).innerText = msgTxt;
    document.getElementById(msgElementId).hidden = false;
}

// Test for required patterns and show error messages if necessary
const testPattern = (rePattern, fieldName, fieldValue, errorMsgElementId) => {

    var patternFound = rePattern.test(fieldValue);
    console.log(fieldValue);
    console.log(patternFound);

    if (fieldValue == "") {
        displayErrorMsg(errorMsgElementId, fieldName + " cannot be empty.");
        return patternFound;
    }

    if (rePattern == namePattern) {
        patternFound = (patternFound && !(nonAlphabetChars.test(fieldValue)));
        if (patternFound == false) {
            displayErrorMsg(errorMsgElementId, fieldName + " must contain alphabets only.");
        }
    }
    else if (patternFound == false) {
        if (rePattern == passwordPattern) {
            displayErrorMsg(errorMsgElementId, fieldName + " must be at least 8 characters in length and contain atleast one uppercase alphabet, one lowercase alphabet and one numeric character.");
        }
        if (rePattern == eMailPattern) {
            displayErrorMsg(errorMsgElementId, fieldName + " must look line thanos@infinitystones.au");
        }
    }

    return patternFound;
}

// Storing mew user details
const storeNewUserData = (sUFormData) => {
    var pTKStorage = window.localStorage;
    var newUserJSON = {"email": sUFormData.get("eMail"), "password": sUFormData.get("Password"), "firstname": sUFormData.get("firstName"), "lastname": sUFormData.get("lastName")};

    pTKStorage.setItem(sUFormData.get("eMail"), JSON.stringify(newUserJSON));
};

// Verify existence of Username for Log In
const verifyUserName = (userName) => {
    var myStorage = window.localStorage;

    if (null == myStorage.getItem(userName)) {
        return false;
    }

    return true;
};

// Verify user's password for Log In
const verifyPassword = (userName, userPassword) => {
    var myStorage = window.localStorage;
    var _storedPassword = JSON.parse(myStorage.getItem(userName)).password;

    if (userPassword != _storedPassword) {
        return false;
    }

    return true;
};

// On clicking Sign Up on Sign Up page
const createAccount = (signUpFormSubmitEvent) => {
    var signUpFormData = new FormData(signUpForm);

    console.log(signUpFormData);

    document.getElementById("signUpErrorMsg").hidden = true;

    if (testPattern(namePattern, "First Name", signUpFormData.get("firstName"), "signUpErrorMsg")) {
        if (testPattern(namePattern, "Last Name", signUpFormData.get("lastName"), "signUpErrorMsg")) {
            if (testPattern(eMailPattern, "E-mail", signUpFormData.get("eMail"), "signUpErrorMsg")) {
                if (!verifyUserName(signUpFormData.get("eMail"))) {
                    if (testPattern(passwordPattern, "Password", signUpFormData.get("Password"), "signUpErrorMsg")) {
                        if (signUpFormData.get("Acceptance") != null) {
                            storeNewUserData(signUpFormData);
                            console.log("Account successfully created!!");
                            goToDashboard("signUpPage");
                            document.getElementById("submitSignUpForm").removeEventListener("click", createAccount);                        
                        }
                        else {
                            displayErrorMsg("signUpErrorMsg", "You have to accept Terms Of Use.");
                        }
                    }
                }
                else {
                    displayErrorMsg("signUpErrorMsg", "Account already exists!! Use a different e-mail address.");
                }
            }
        }
    }
};

// On clicking Log In on Log In page
const logIntoAccount = (userLogInEvent) => {
    var logInFormData = new FormData(logInForm);

    if (testPattern(eMailPattern, "Username", logInFormData.get("userName"), "logInErrorMsg")) {
        if (verifyUserName(logInFormData.get("userName"))) {
            if (testPattern(passwordPattern, "Password", logInFormData.get("LogInPassword"), "logInErrorMsg")) {
                if (verifyPassword(logInFormData.get("userName"), logInFormData.get("LogInPassword"))) {
                    console.log("Log-in credentials match!!");
                    goToDashboard("logInPage");
                    document.getElementById("submitLogInForm").removeEventListener("click", logIntoAccount);
                }
                else {
                    displayErrorMsg("logInErrorMsg", "Incorrect password!!");        
                }
            }
        }
        else {
            displayErrorMsg("logInErrorMsg", "No user with this email address!! Please sign up!!");
        }
    }

};

// This function is called when the document is loaded or refreshed
window.onload = () => {
    var getDivList = document.querySelectorAll("div");
    for (var divElement of getDivList) {
        divElement.setAttribute("class", "inactiveDiv");
    }
    document.getElementsByTagName("h3")[0].hidden = false;

    setTimeout(() => {
        document.getElementsByTagName("h3")[0].hidden = true;
        document.getElementById("landingPage").setAttribute("class", "activeDiv");
    }, 2000);
};