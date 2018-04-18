//================================Setup===========================\\
//globally accessible variables
const form = document.getElementById("registrar");
const input = form.querySelector('input');
let text = input.value;
const submitButton = form.querySelector('button');
const ul = document.getElementById('invitedList');

const div = document.createElement('div');
const filterLabel = document.createElement('label');
const filterCheckbox = document.createElement('input');

const errorTextLocation = document.getElementById('validationText');
const animSpeeds = {
    speedCorrect: 400,
    speedWrong: 200,
    speedExists: 700,
};
const listInfoSpans = document.querySelectorAll('#listInfo span');
const listInfoHeader = document.querySelector('h2');

/* NUKE ALL Con-sole LOGS */
// or do a find all regex search for: thatword.log(.*)
if (false) {
    var console = {};
    console.log = function () {};
}

const logTxt = {
    LocalStorageLoaded: "Local Storage 'Guest List' has been loaded",
    LocalStorageUpdated: "Local Storage updated",
    LocalStorageEmpty: "Local Storage 'Guest list' is Empty!",
    filterGuestsHidden: "(Unconfirmed Guests are now hidden)",
    filterGuestsShow: "(All guests are now visible)",
    exsistCheckError: "That person is already on the list!",
    newGuestAdded: '(New guest has been added): ',
    checkboxConfirmed: "is checked as confirmed",
    checkboxUnconfirmed: "is now unconfirmed",
    gotRemoved: "got removed",
    gotRemovedEdit: "got removed during edit",
}

const htmlTxt = {
    classResponded: "responded",
    filterLabelText: "Hide those who haven't responded",
    classFilterArea: "FilterArea",
    classFormCorrect: "formCorrect",
    classFormWrong: "formWrong",
    classFormExsists: "formWrong",
    classFormReset: "formReset",
    errorTextWrong: "That does not seem to be a name!",
    errorTextExists: "That person is already on the guestList!",
    listInfoHeaderSingle: "invitee",
    listInfoHeaderMulti: "invitees",
    confirmedTotalText: "Confirmed:",
    unconfirmedTotalText: "Unconfirmed:",
    labelTextContentDefault: "Unconfirmed",
    classListStatusDefault: "unresponsive",
    confirmedText: "Is Confirmed",
    unconfirmedText: "Unconfirmed",
    nameEditPlaceholder: "Insert a name please!",
    nameChangedTo: "changed to2 :",
    editButtonTitle: "Edit Name",
}

//===============================================================================\\
//==================================LOAD EVERYTHING==============================\\
//===============================================================================\\

document.addEventListener('DOMContentLoaded', () => {
    //=====OnPageLoad======\\
    createFilterArea();
    guestCount(); //Counts all guests, displays values and hides stuff if empty. 
    loadLocalStorage(); //loads 
});

//===============================================================================\\
//==================================LOCAL STORAGE================================\\
//===============================================================================\\

function loadLocalStorage() {
    if (localStorage.getItem('guestList')) {
        console.log(logTxt['LocalStorageLoaded']);
        //set List content to whats stored in Local Storage
        ul.innerHTML = localStorage.getItem('guestList');
        //checks guestcount again 
        guestCount();
        //put Checked checkmarks on all checkboxes with LI responded
        for (let i = 0; i < ul.children.length; i += 1) {
            if (ul.children[i].className == htmlTxt['classResponded']) {
                ul.children[i].children[1].lastElementChild.checked = "true";
            }
        }
    } else {
        console.log(logTxt['LocalStorageEmpty']);
    }
}

function localStorageUpdate() {
    const guestList = ul.innerHTML;
    localStorage.guestList = guestList;
}

//===============================================================================\\
//==================================UPDATE DATA==================================\\
//===============================================================================\\

//ACTION: runs its content (functions) when something changes
function updateOnChange() {
    localStorageUpdate();
    guestCount();
}
//ACTION: Counts all guests, displays values and hides stuff if empty. 
function guestCount() {
    let attendingGuests = 0;
    let unconfirmedGuests = 0;
    let totalGuests = 0;
    const filterCheckboxArea = document.querySelector('.filterArea');

    for (let i = 0; i < ul.children.length; i += 1) {
        const guestStatus = ul.children[i].className;
        if (guestStatus == htmlTxt['classResponded']) {
            attendingGuests += 1;
            totalGuests = attendingGuests + unconfirmedGuests;
        } else if (guestStatus == "unresponsive") {
            unconfirmedGuests += 1;
            totalGuests = attendingGuests + unconfirmedGuests;
        }
    }
    if (totalGuests > 0) {
        if (totalGuests == 1) {
            listInfoHeader.innerHTML = totalGuests + ' ' + htmlTxt.listInfoHeaderSingle;
        } else {
            listInfoHeader.innerHTML = totalGuests + ' ' + htmlTxt.listInfoHeaderMulti;
        }
        listInfoSpans[0].innerHTML = htmlTxt.confirmedTotalText +
            " <span>" + attendingGuests + "</span>";
        listInfoSpans[1].innerHTML = htmlTxt.unconfirmedTotalText +
            " <span>" + unconfirmedGuests + "</span>";
        filterCheckboxArea.style.display = "";
        ul.style.display = "";
    } else if (totalGuests < 1) {
        //clears the page 
        listInfoHeader.innerHTML = "";
        listInfoSpans[0].innerHTML = "";
        listInfoSpans[1].innerHTML = "";
        filterCheckboxArea.style.display = "none";
        ul.style.display = "none";
    }
}
//===============================================================================\\
//==================================FILTER CHECKBOX AREA=========================\\
//===============================================================================\\

//creation of responded filter area (+ its checkbox)
function createFilterArea() {
    div.className = "filterArea";
    filterLabel.textContent = htmlTxt['filterLabelText'];
    filterCheckbox.type = 'checkbox';
    filterLabel.appendChild(filterCheckbox);
    div.appendChild(filterLabel);
    const listInfo = document.querySelector('#listInfo');
    listInfo.parentNode.insertBefore(div, listInfo.nextSibling);
}

function filterUnresponsive(e) {
    const isChecked = e.target.checked;
    const attendList = ul.children;
    if (isChecked) {
        console.log(logTxt['filterGuestsHidden']);
        for (let i = 0; i < attendList.length; i += 1) {
            let li = attendList[i];
            if (li.className === htmlTxt['classResponded']) {
                li.style.display = '';
            } else {
                li.style.display = 'none';
            }
        }
    } else {
        for (let i = 0; i < attendList.length; i += 1) {
            let li = attendList[i];
            li.style.display = '';
        }
        console.log(logTxt['filterGuestsShow']);
    }
}

//===============================================================================\\
//==================================GUESTS FUNCTIONS===========================\\
//===============================================================================\\

//DATA VALIDATION CODE
const dataValidation = {
    inputCheck: () => {
        if (text && text.length < 27) {
            return true;
        } else {
            return false;
        }
    },
    existCheck: () => {
        for (let i = 0; i < ul.children.length; i += 1) {
            const guestName = ul.children[i].firstChild.innerHTML;
            if (text == guestName) {
                return true;
            }
        }
    },
    correct: () => {
        input.value = "";
        form.className = htmlTxt['classFormCorrect'];
        errorTextLocation.style.display = 'none';
        window.setTimeout(() => {
            form.className = htmlTxt['classFormReset'];
        }, animSpeeds['speedCorrect']);
    },
    wrong: () => {
        form.className = htmlTxt["classFormWrong"];
        errorTextLocation.style.display = 'block';
        errorTextLocation.innerHTML = htmlTxt["errorTextWrong"];
        window.setTimeout(() => {
            input.value = "";
            form.className = htmlTxt['classFormReset'];
        }, animSpeeds['speedWrong']);
    },
    exists: () => {
        form.className = htmlTxt["classFormExsists"];
        errorTextLocation.style.display = 'block';
        errorTextLocation.innerHTML = htmlTxt['errorTextExists'];
        window.setTimeout(() => {
            input.value = "";
            form.className = htmlTxt['classFormReset'];
        }, animSpeeds['speedExists']);
    },
};

//create a attendee list item
function createLI(text) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);
    const label = document.createElement('label');
    label.textContent = htmlTxt['labelTextContentDefault'];
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.title = "set as confirmed";
    label.appendChild(checkbox);
    li.className = htmlTxt['classListStatusDefault'];
    li.appendChild(label);

    const editButton = document.createElement('button');
    editButton.textContent = "Edit";
    editButton.title = htmlTxt['editButtonTitle'];
    li.appendChild(editButton)

    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
    removeButton.title = "Remove guest";
    li.appendChild(removeButton);
    return li;
}
//Adds new guest if datavalidation is OK.
function addNewGuest() {
    text = input.value;
    if (dataValidation['inputCheck']()) {
        if (dataValidation['existCheck']()) {
            console.log(logTxt['exsistCheckError']);
            dataValidation['exists']();
        } else {
            dataValidation['correct']();
            console.log(logTxt['newGuestAdded'] + text);
            const li = createLI(text);
            ul.appendChild(li);
            updateOnChange();
        }
    } else {
        dataValidation['wrong']();
    }
}
//Changes the class of a Guest checkbox based on if checkbox is toggled
function checkboxClassToggle(e) {
    const checkbox = e.target;
    const checked = checkbox.checked;
    const listItem = checkbox.parentNode.parentNode;

    if (checked) {
        listItem.className = 'responded';
        listItem.querySelector('label input').title = "Set as Unconfirmed";
        if (listItem.querySelector('span')) {
            console.log("[" + listItem.firstChild.textContent + "] " + logTxt['checkboxConfirmed']);
            checkbox.parentNode.firstChild.textContent = htmlTxt['confirmedText'];
            updateOnChange();
        }
    } else {

        listItem.className = 'unresponsive';
        listItem.querySelector('label input').title = "sSet as Confirmed";
        const theSpan = listItem.querySelector('span');

        if (theSpan) {
            //BUG: Fires weirdly while during edit
            console.log("[" + theSpan.textContent + "] " + logTxt['checkboxUnconfirmed']);
            checkbox.parentNode.firstChild.textContent = htmlTxt['unconfirmedText'];

        }
        updateOnChange();
    }
}
//Button functions on a guest list item. Remove/edit/save
function guestButtonEvents(e) {
    if (e.target.tagName == 'BUTTON') {
        const button = e.target;
        const li = button.parentNode;
        const ul = li.parentNode;
        const firstChild = li.firstElementChild;
        const action = button.textContent.toLowerCase();

        const nameActions = {
            remove: () => {
                const spanContent = li.firstChild.textContent;
                const inputValue = li.firstChild.value;
                if (inputValue) {
                    console.log("[" + inputValue + "] " + logTxt['gotRemovedEdit']);
                } else {
                    console.log("[" + spanContent + "] " + logTxt['gotRemoved']);
                }
                ul.removeChild(li);
                updateOnChange();
            },
            edit: () => {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = firstChild.textContent;
                input.setAttribute('placeholder', htmlTxt['nameEditPlaceholder']);
                li.insertBefore(input, firstChild);
                li.removeChild(firstChild);
                button.textContent = "Save";
            },
            save: () => {
                const span = document.createElement('span');
                if (firstChild.value && firstChild.value.length < 27) {
                    span.textContent = firstChild.value;
                    li.insertBefore(span, firstChild);
                    li.removeChild(firstChild);
                    button.textContent = "Edit";
                    //print after new name is saved
                    console.log(logTxt['nameChangedTo'] + " " + firstChild.value);
                    updateOnChange();
                }
            }
        };
        //checks button for name, and runs the function with that name
        nameActions[action]();
    }
}
//===============================================================================\\
//==================================EVENT LISTENERS==============================\\
//===============================================================================\\

//Listen to filterCheckbox if user wants to hide unreponsive guests
filterCheckbox.addEventListener('change', (e) => {
    filterUnresponsive(e);
})

//listen to the inputfield for adding new attendees and add if DataValidation is ok
form.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewGuest();
});

//listen to checkbox on Guests and changes class based on checkbox toggle
ul.addEventListener('change', (e) => {
    checkboxClassToggle(e);
});

//listen to a click event on a button in the list item. And remove said list.
ul.addEventListener('click', (e) => {
    guestButtonEvents(e);
});

//=============================================\\
//===Inspired by Treehouse javascript course===\\
//=============================================\\
/*
The project started out as a Treehouse javascript assignment, 
turned into a fun project with alot more features and some other changes. 
*/
