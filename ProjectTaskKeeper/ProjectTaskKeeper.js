var namePattern = new RegExp("[A-Za-z]{1,}");
var nonAlphabetChars = new RegExp("[^A-Za-z]+");
var eMailPattern = new RegExp("[A-Za-z0-9._%+-]+@[a-z0-9.-]+[.]{1}[a-z]{2,}$");
var passwordPattern = new RegExp("(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}");

var signUpForm = null;
var logInForm = null;
var accSettingsForm = null;

var currentUser = null;

// Disable an active div element
const disableActiveDiv = (divId) => {
    try {
        var childDivs = document.getElementById(divId).getElementsByTagName("div")
        document.getElementById(divId).setAttribute("class", "inactiveDiv");

        for (var divElement of childDivs) {
            if (divElement.getAttribute("class").search("activeDiv") != -1)
            divElement.setAttribute("class", "inactiveDiv");    
        }

        document.getElementById("loadingMessage").hidden = false;
    } catch (navError) {
        console.log(navError.name);
    }
};

// Enable an inactive div element
const enableInactiveDiv = (divId) => {
    setTimeout(() => {
        try {
            var childDivs = document.getElementById(divId).getElementsByTagName("div");
            document.getElementById("loadingMessage").hidden = true;
            document.getElementById(divId).setAttribute("class", "activeDiv");
            for (var divElement of childDivs) {
                divElement.setAttribute("class", "activeDiv");    
            }
        } catch (navError) {
            console.log(navError.name);
        }
    }, 200);
};

// After login
const enableAfterLoginElements = () => {
    var afterLogInElements = document.getElementsByClassName("activeAfterLogin");

    for (var aLIElement of afterLogInElements) {
        aLIElement.hidden = false;
        if (aLIElement.getAttribute("id") == "userButtons") {
            var myButtons = aLIElement.querySelectorAll("img");
            aLIElement.style.display = "inline-block";

            for (var myButton of myButtons) {
                if (myButton.getAttribute("id").toLowerCase().search("settings") != -1) {
                    myButton.addEventListener("click", goToUserSettings);
                } else if (myButton.getAttribute("id").toLowerCase().search("logout") != -1) {
                    myButton.addEventListener("click", goToLandingPage);
                }
            }

        } else { 
            aLIElement.style.display = "block";
        }
    }
};

// Before login and after logout
const disableAfterLoginElements = () => {
    var afterLogInElements = document.getElementsByClassName("activeAfterLogin");

    for (var aLIElement of afterLogInElements) {
        if (aLIElement.getAttribute("id") == "userButtons") {
            var myButtons = aLIElement.querySelectorAll("img");

            for (var myButton of myButtons) {
                if (myButton.getAttribute("id").toLowerCase().search("settings") != -1) {
                    myButton.removeEventListener("click", goToUserSettings);
                } else if (myButton.getAttribute("id").toLowerCase().search("logout") != -1) {
                    myButton.removeEventListener("click", goToLandingPage);
                }
            }
        }
        aLIElement.hidden = true;
        aLIElement.style.display = "none";
    }
};

// On first loading, refreshing or logging out
const goToLandingPage = () => {
    var getDivList = document.querySelectorAll("div");
    for (var divElement of getDivList) {
        if (divElement.getAttribute("class") != "activeAfterLogin") {
            divElement.setAttribute("class", "inactiveDiv");
        }
    }

    disableAfterLoginElements();
    signUpForm = null;
    logInForm = null;
    accSettingsForm = null;
    currentUser = null;

    document.getElementById("loadingMessage").hidden = false;
    setTimeout(() => {
        document.getElementById("loadingMessage").hidden = true;
        document.getElementById("landingPage").setAttribute("class", "activeDiv");
    }, 2000);
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

// On successful signing up or logging in 
const goToDashboard = (currentDIvId) => {
    console.log("Taking you to the dashboard...");
    disableActiveDiv(currentDIvId);
    enableInactiveDiv("dashboard");
    enableAfterLoginElements();
};

// On clicking the settings button
const goToUserSettings = () => {
    var myStorage = window.localStorage;
    var currentUserJSON = JSON.parse(myStorage.getItem(currentUser));

    disableActiveDiv("dashboard");
    enableInactiveDiv("accSettingsPage");
    accSettingsForm = document.getElementById("settingsForm");

    document.getElementById("accFirstName").setAttribute("value", currentUserJSON.firstname);
    document.getElementById("accLastName").setAttribute("value", currentUserJSON.lastname);
    document.getElementById("accEMail").setAttribute("value", currentUserJSON.email);
    document.getElementById("accPsswd").setAttribute("value", currentUserJSON.password);

    document.getElementById("submitAccSettingsForm").addEventListener("click", saveChanges);
    document.getElementById("backToDashboard").addEventListener("click", goBack);
};

// Error messages for form fields
const displayErrorMsg = (msgElementId, msgTxt) => {
    document.getElementById(msgElementId).innerText = msgTxt;
    document.getElementById(msgElementId).hidden = false;

    setTimeout(() => {
        document.getElementById(msgElementId).innerText = "";
        document.getElementById(msgElementId).hidden = true;
    }, 3000);

};

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
};

// Storing mew user details
const storeNewUserData = (sUFormData) => {
    var pTKStorage = window.localStorage;
    var newUserJSON = {"email": sUFormData.get("eMail"), "password": sUFormData.get("Password"), "firstname": sUFormData.get("firstName"), "lastname": sUFormData.get("lastName")};

    pTKStorage.setItem(sUFormData.get("eMail"), JSON.stringify(newUserJSON));
    currentUser = sUFormData.get("eMail");
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

    currentUser = userName;
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
                            signUpForm = null;
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
                    logInForm = null;
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

// On clicking Save Changes on Account Settings Page
const saveChanges = (saveChangesEvent) => {
    var accSettingsFormData = new FormData(accSettingsForm);
    var myStorage = window.localStorage;
    var currentUserJSON = JSON.parse(myStorage.getItem(currentUser));

    if (testPattern(namePattern, "First Name", accSettingsFormData.get("firstName"), "settingsErrorMsg")) {
        if (testPattern(namePattern, "Last Name", accSettingsFormData.get("lastName"), "settingsErrorMsg")) {
            if (testPattern(eMailPattern, "E-mail", accSettingsFormData.get("eMail"), "settingsErrorMsg")) {
                if ((!verifyUserName(accSettingsFormData.get("eMail")) && (accSettingsFormData.get("eMail") != currentUserJSON.email)) || (accSettingsFormData.get("eMail") === currentUserJSON.email)) {
                    if (testPattern(passwordPattern, "Password", accSettingsFormData.get("Password"), "settingsErrorMsg")) {
                        
                        currentUserJSON.firstname = accSettingsFormData.get("firstName");
                        currentUserJSON.lastname = accSettingsFormData.get("lastName");
                        currentUserJSON.password = accSettingsFormData.get("Password");

                        if (accSettingsFormData.get("eMail") != currentUserJSON.email) {
                            currentUserJSON.email = accSettingsFormData.get("eMail")
                            myStorage.removeItem(currentUser);
                            currentUser = currentUserJSON.email;
                        }

                        myStorage.setItem(currentUser, JSON.stringify(currentUserJSON));
                        displayErrorMsg("settingsErrorMsg", "Changes saved successfully!!");    
                    
                    }
                }
                else {
                    displayErrorMsg("settingsErrorMsg", "Account already exists!! Use a different e-mail address.");
                }
            }
        }
    }
};

// On clicking Back on Account Settings Page
const goBack = (goBackEvent) => {
    goToDashboard("accSettingsPage");
    document.getElementById("submitAccSettingsForm").removeEventListener("click", saveChanges);
    document.getElementById("backToDashboard").removeEventListener("click", goBack);
    accSettingsForm = null;
};

// This function is called when the document is loaded or refreshed
window.onload = () => {
    goToLandingPage();
};