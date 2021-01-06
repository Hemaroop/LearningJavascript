var namePattern = new RegExp("[A-Za-z]{1,}");
var nonAlphabetChars = new RegExp("[^A-Za-z]+");
var eMailPattern = new RegExp("[A-Za-z0-9._%+-]+@[a-z0-9.-]+[.]{1}[a-z]{2,}$");
var passwordPattern = new RegExp("(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}");

var signUpForm = null;
var logInForm = null;
var accSettingsForm = null;

var currentUser = null;
var nLists = null;
var currentUserLists = null;
var selectedUserList = null;

// Disable an active div element
const disableActiveDiv = (divId) => {
    try {
        var childDivs = document.getElementById(divId).getElementsByTagName("div")
        document.getElementById(divId).setAttribute("class", "inactiveDiv");

        for (var divElement of childDivs) {
            if (divElement.getAttribute("class").search("activeDiv") != -1) {
                divElement.setAttribute("class", "inactiveDiv");
            }
        }

        document.getElementById("loadingMessage").hidden = false;
    } catch (navError) {
        console.log(navError.name);
    }
};

// Enable an inactive div element
const enableInactiveDiv = (divId, elementToFocus) => {
    setTimeout(() => {
        try {
            var childDivs = document.getElementById(divId).getElementsByTagName("div");
            document.getElementById("loadingMessage").hidden = true;
            document.getElementById(divId).setAttribute("class", "activeDiv");
            for (var divElement of childDivs) {
                if (divElement.getAttribute("class").search("inactiveDiv") != -1) {
                    divElement.setAttribute("class", "activeDiv");
                }
            }
            if ((elementToFocus != null) && (elementToFocus != "")) {
                document.getElementById(elementToFocus).focus();
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
    removeListItems("listOfLists");
    removeListItems("listElements");
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
    nLists = null;
    currentUserLists = null;
    selectedUserList = null;    

    document.getElementById("loadingMessage").hidden = false;
    setTimeout(() => {
        enableInactiveDiv("landingPage", "lPSignUp");
    }, 2000);
};

// On clicking Sign Up button on landing page
const goToSignUpPage = () => {
     console.log("You have requested to go to sign up page!!");
    disableActiveDiv("landingPage");
    enableInactiveDiv("signUpPage", "firstName");
    signUpForm = document.getElementById("signUpForm");
    signUpForm.reset();
    document.getElementById("agreeBox").checked = false;
    document.getElementById("submitSignUpForm").addEventListener("click", createAccount);
};

// On clicking Log In button on landing page
const goToLogInPage = () => {
    console.log("You have requested to go to log in page!!");
    disableActiveDiv("landingPage");
    enableInactiveDiv("logInPage", "username");
    logInForm = document.getElementById("logInForm");
    logInForm.reset();
    document.getElementById("submitLogInForm").addEventListener("click", logIntoAccount);
};

// Display an ordered list of to-do lists created by the user
const displayUserLists = (userLists) => {
    for (var userList in userLists) {
        var listItem = document.createElement("li");
        var listItemText = document.createTextNode(userLists[userList]);
        listItem.appendChild(listItemText);
        listItem.setAttribute("id", userList);
        document.getElementById("listOfLists").appendChild(listItem);
        document.getElementById("listOfLists").appendChild(document.createElement("br"));
    }
};

// Remove list display if navigating away from dashboard
const removeListItems = (listId) => {
    var _userLists = document.getElementById(listId).querySelectorAll("li");
    var _lineSpaces = document.getElementById(listId).querySelectorAll("br");

    for (var _uList of _userLists) {
        document.getElementById(listId).removeChild(_uList);
    }
    for (var _lSpace of _lineSpaces) {
        document.getElementById(listId).removeChild(_lSpace);
    }

};

// On successful signing up or logging in 
const goToDashboard = (currentDIvId) => {
    var myStorage = window.localStorage;
    var existingLists = null;
    var currentUserJSON = JSON.parse(myStorage.getItem(currentUser));

    nLists = currentUserJSON.nOfLists;
    currentUserLists = currentUserJSON.userLists;
    selectedUserList = null;

    console.log(nLists);
    if (nLists > 0) {
        displayUserLists(currentUserLists);
    }

    console.log("Taking you to your dashboard...");
    disableActiveDiv(currentDIvId);
    enableInactiveDiv("dashboard", null);
    enableAfterLoginElements();
    document.getElementById("listAdder").addEventListener("click", goToListPage);

    existingLists = document.getElementById("listOfLists").querySelectorAll("li");
    for (var eList of existingLists) {
        eList.addEventListener("click", goToListPage);
    }
};

// On clicking the settings button
const goToUserSettings = () => {
    var myStorage = window.localStorage;
    var currentUserJSON = JSON.parse(myStorage.getItem(currentUser));
    var existingLists = null;
    var _activeDivList = document.getElementsByClassName("activeDiv");

    for (var _activeDiv of _activeDivList) {
        _activeDiv.setAttribute("class", "inactiveDiv");
        if (_activeDiv.getAttribute("id") == "dashboard") {
            removeListItems("listOfLists");
        } else if (_activeDiv.getAttribute("id") == "selectedList") {
            removeListItems("listElements");
        }
    }

    enableInactiveDiv("accSettingsPage", "accFirstName");
    accSettingsForm = document.getElementById("settingsForm");

    document.getElementById("accFirstName").setAttribute("value", currentUserJSON.firstname);
    document.getElementById("accLastName").setAttribute("value", currentUserJSON.lastname);
    document.getElementById("accEMail").setAttribute("value", currentUserJSON.email);
    document.getElementById("accPsswd").setAttribute("value", currentUserJSON.password);

    document.getElementById("submitAccSettingsForm").addEventListener("click", saveUserChanges);
    document.getElementById("backToDashboard").addEventListener("click", goBackFromUserSettings);
};

// Load elements of a selected list
const loadList = (selectedListId) => {
    var myStorage = window.localStorage;
    var currentUserJSON = JSON.parse(myStorage.getItem(currentUser));
    var _sList = currentUserJSON[selectedListId];

    var titleTextNode = null;
    var itemList = null;

    //Populate Title
    document.getElementById("listTitle").innerText = "";
    titleText = document.createTextNode(_sList.title);
    document.getElementById("listTitle").appendChild(titleText);

    //Populate List Elements
    itemList = _sList.items;
    for (var _item in itemList) {
        var itemCheckbox = document.createElement("input"); 
        var liItem = document.createElement("li");
        var liTextNode = document.createTextNode(_item);

        itemCheckbox.setAttribute("type", "checkbox");
        itemCheckbox.checked = itemList[_item];

        liItem.appendChild(liTextNode);
        liItem.appendChild(itemCheckbox);

        document.getElementById("listElements").appendChild(liItem);
        document.getElementById("listElements").appendChild(document.createElement("br"));
    }

};

// On saving title
const saveAndShowTitle = () => {
    var _titleText = document.getElementById("titleInput").value;
    var _titleDoesNotExist = true;
    if (_titleText != null && _titleText != "") {
        var myStorage = window.localStorage;
        var _userLists = currentUserLists;
        for (var _uList in _userLists) {
            if (_uList != selectedUserList && _titleText == _userLists[_uList]) {
                displayErrorMsg("titleErrorMsg", "Another list with this title already exists!!");
                _titleDoesNotExist = false;
                break;
            }
        }
        if (_titleDoesNotExist) {
            document.getElementById("listTitle").innerText = _titleText;
            document.getElementById("listTitle").hidden = false;
            document.getElementById("saveTitle").value = "Modify";
        }
    }
    document.getElementById("titleInput").value = "";
};

// On adding new element
const addToList = () => {
    var _itemText = document.getElementById("listInput").value;
    if (_itemText != null && _itemText) {
        var itemCheckbox = document.createElement("input"); 
        var liItem = document.createElement("li");
        var liTextNode = document.createTextNode(_itemText);

        itemCheckbox.setAttribute("type", "checkbox");
        itemCheckbox.checked = false;

        liItem.appendChild(liTextNode);
        liItem.appendChild(itemCheckbox);

        document.getElementById("listElements").appendChild(liItem);
        document.getElementById("listElements").appendChild(document.createElement("br"));
    }
    document.getElementById("listInput").value = "";
};

// Save changes made to the selected list
const saveAllChanges = () => {
    var myStorage = window.localStorage;
    var currentUserJSON = JSON.parse(myStorage.getItem(currentUser));
    var _listItems = document.getElementById("listElements").querySelectorAll("li");

    if (Number.parseInt(selectedUserList) > currentUserJSON.nOfLists) {
        currentUserJSON.nOfLists = Number.parseInt(selectedUserList);
        nLists = currentUserJSON.nOfLists;
    }

    currentUserJSON.userLists[selectedUserList] = document.getElementById("listTitle").innerText;
    currentUserJSON[selectedUserList] = {};
    currentUserJSON[selectedUserList].title = document.getElementById("listTitle").innerText;
    currentUserJSON[selectedUserList].items = {};

    for (var _lItem of _listItems) {
        currentUserJSON[selectedUserList].items[_lItem.innerText] = _lItem.querySelectorAll("input")[0].checked;
    }

    myStorage.removeItem(currentUser);
    currentUser = currentUserJSON.email;

    myStorage.setItem(currentUser, JSON.stringify(currentUserJSON));
};

// Go Back to Dashboard
const goBackFromListDetails = () => {
    document.getElementById("saveTitle").removeEventListener("click", saveAndShowTitle);
    document.getElementById("addToList").removeEventListener("click", addToList);
    document.getElementById("saveList").removeEventListener("click", saveAllChanges);
    document.getElementById("goToDashboard").removeEventListener("click", goBackFromListDetails);
    removeListItems("listElements");
    goToDashboard("selectedList");
}

// On clicking "Create a new list" or "an existing list"
const goToListPage = (clickListEvent) => {
    var clickedList = clickListEvent.currentTarget;
    var listIdx = 0;

    selectedUserList = clickedList.getAttribute("id");
    document.getElementById("titleInput").value = "";
    document.getElementById("listInput").value = "";

    if (selectedUserList == "listAdder") {
        document.getElementById("listTitle").hidden = true;
        selectedUserList = (nLists + 1).toString();
        document.getElementById("saveTitle").value = "Add";
    } else {
        loadList(selectedUserList);
        document.getElementById("saveTitle").value = "Modify";
    }

    removeListItems("listOfLists");
    disableActiveDiv("dashboard");
    enableInactiveDiv("selectedList", "titleInput");

    document.getElementById("saveTitle").addEventListener("click", saveAndShowTitle);
    document.getElementById("addToList").addEventListener("click", addToList);
    document.getElementById("saveList").addEventListener("click", saveAllChanges);
    document.getElementById("goToDashboard").addEventListener("click", goBackFromListDetails);
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
    var newUserJSON = {"email": sUFormData.get("eMail"), "password": sUFormData.get("Password"), "firstname": sUFormData.get("firstName"), "lastname": sUFormData.get("lastName"), "nOfLists": 0, "userLists":{}};

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
const saveUserChanges = (saveChangesEvent) => {
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
const goBackFromUserSettings = (goBackEvent) => {
    goToDashboard("accSettingsPage");
    document.getElementById("submitAccSettingsForm").removeEventListener("click", saveUserChanges);
    document.getElementById("backToDashboard").removeEventListener("click", goBackFromUserSettings);
    accSettingsForm = null;
};

// This function is called when the document is loaded or refreshed
window.onload = () => {
    goToLandingPage();
};