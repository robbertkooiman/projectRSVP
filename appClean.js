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
    listInfoHeader: "Invitees: ",
    confirmedTotalText: "Is Confirmed:",
    unconfirmedTotalText: "Unconfirmed:",
    labelTextContentDefault: "Unconfirmed",
    classListStatusDefault: "unresponsive",
    confirmedText: "Is Confirmed",
    unconfirmedText: "Unconfirmed",
    nameEditPlaceholder: "Insert a name please!",
    nameChangedTo: "changed to2 :"
}

document.addEventListener('DOMContentLoaded', () => {

    createFilterArea();
    guestCount();
    loadLocalStorage();
});

function loadLocalStorage() {
    if (localStorage.getItem('guestList')) {
        ul.innerHTML = localStorage.getItem('guestList');
        guestCount();
        for (let i = 0; i < ul.children.length; i += 1) {
            if (ul.children[i].className == htmlTxt['classResponded']) {
                ul.children[i].children[1].lastElementChild.checked = "true";
            }
        }
    } else {
    }
}

function localStorageUpdate() {
    const guestList = ul.innerHTML;
    localStorage.guestList = guestList;
}

function updateOnChange() {
    localStorageUpdate();
    guestCount();
}

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
        listInfoHeader.innerHTML = htmlTxt['listInfoHeader'] + " (" + totalGuests + ")";
        listInfoSpans[0].innerHTML = htmlTxt['confirmedTotalText'] + " " + attendingGuests;
        listInfoSpans[1].innerHTML = htmlTxt['unconfirmedTotalText'] + " " + unconfirmedGuests;
        filterCheckboxArea.style.display = "";
    } else if (totalGuests < 1) {

        listInfoHeader.innerHTML = "";
        listInfoSpans[0].innerHTML = "";
        listInfoSpans[1].innerHTML = "";
        filterCheckboxArea.style.display = "none";
    }
}

function createFilterArea() {
    div.className = "filterArea";
    filterLabel.textContent = htmlTxt['filterLabelText'];
    filterCheckbox.type = 'checkbox';
    filterLabel.appendChild(filterCheckbox);
    div.appendChild(filterLabel);
    const mainInfo = document.querySelector('.mainInfo');
    ul.parentNode.insertBefore(div, mainInfo);
}

function filterUnresponsive(e) {
    const isChecked = e.target.checked;
    const attendList = ul.children;
    if (isChecked) {
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
    }
}

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

function createLI(text) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);
    const label = document.createElement('label');
    label.textContent = htmlTxt['labelTextContentDefault'];
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    label.appendChild(checkbox);
    li.className = htmlTxt['classListStatusDefault'];
    li.appendChild(label);

    const editButton = document.createElement('button');
    editButton.textContent = "Edit";
    li.appendChild(editButton)

    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
    li.appendChild(removeButton);
    return li;
}

function addNewGuest() {
    text = input.value;
    if (dataValidation['inputCheck']()) {
        if (dataValidation['existCheck']()) {
            dataValidation['exists']();
        } else {
            dataValidation['correct']();
            const li = createLI(text);
            ul.appendChild(li);
            updateOnChange();
        }
    } else {
        dataValidation['wrong']();
    }
}

function checkboxClassToggle(e) {
    const checkbox = e.target;
    const checked = checkbox.checked;
    const listItem = checkbox.parentNode.parentNode;
    if (checked) {
        listItem.className = 'responded';
        if (listItem.querySelector('span')) {
            checkbox.parentNode.firstChild.textContent = htmlTxt['confirmedText'];
            updateOnChange();
        }
    } else {
        listItem.className = 'unresponsive';
        const theSpan = listItem.querySelector('span');
        if (theSpan) {
            checkbox.parentNode.firstChild.textContent = htmlTxt['unconfirmedText'];
        }
        updateOnChange();
    }
}

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
                } else {
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
                    updateOnChange();
                }
            }
        };
        nameActions[action]();
    }
}

filterCheckbox.addEventListener('change', (e) => {
    filterUnresponsive(e);
})

form.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewGuest();
});

ul.addEventListener('change', (e) => {
    checkboxClassToggle(e);
});

ul.addEventListener('click', (e) => {
    guestButtonEvents(e);
});