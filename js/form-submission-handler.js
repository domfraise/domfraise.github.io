function validEmail(email) { // see:
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

// get all data in form and return object
function getFormData(elementName) {
    var elements = document.getElementById(elementName).elements; // all form elements
    var fields = Object.keys(elements).map(function (k) {
        if (elements[k].name !== undefined) {
            return elements[k].name;
            // special case for Edge's html collection
        } else if (elements[k].length > 0) {
            return elements[k].item(0).name;
        }
    }).filter(function (item, pos, self) {
        return self.indexOf(item) == pos && item;
    });
    var data = {};
    fields.forEach(function (k) {
        data[k] = elements[k].value;
        var str = ""; // declare empty string outside of loop to allow
                      // it to be appended to for each item in the loop
        if (elements[k].type === "checkbox") { // special case for Edge's html collection
            str = str + elements[k].checked + ", "; // take the string and append
                                                    // the current checked value to
                                                    // the end of it, along with
                                                    // a comma and a space
            data[k] = str.slice(0, -2); // remove the last comma and space
                                        // from the  string to make the output
                                        // prettier in the spreadsheet
        } else if (elements[k].length) {
            for (var i = 0; i < elements[k].length; i++) {
                if (elements[k].item(i).checked) {
                    str = str + elements[k].item(i).value + ", "; // same as above
                    data[k] = str.slice(0, -2);
                }
            }
        }
    });
    // console.log(data);
    return data;
}

function sendPhoneData(phoneFormData) {
    $.post("https://script.google.com/macros/s/AKfycbx7zrLF9fZT2BI7KrGBY2TMQgN7kaOw6xr9hUjBTu2hCm_zfWk/exec",
        phoneFormData
        , function (data, state) {
        });
}

function sendEmailData(phoneFormData) {
    $.post("https://script.google.com/macros/s/AKfycbyF79MWC21MIxcFxn-s9rqwLCEvQxhD_yL3TPN6Zbq1XFs8sQ0/exec",
        phoneFormData
        , function (data, state) {
        });
}

function handleFormSubmit(event) {  // handles form submit withtout any jquery
    event.preventDefault();           // we are submitting via xhr below
    var data = getFormData("gform");         // get the values submitted in the form
    var url = event.target.action;  //
    link = url
    // console.log(url)
    sendPhoneData(data)
    changeTextInElement('phoneForm', 'Thanks for your feedback!');
    alignElement('phoneForm', 'center');
}

function handleFormSubmitEmails(event) {  // handles form submit withtout any jquery
    event.preventDefault();           // we are submitting via xhr below
    var data = getFormData("emailForm");         // get the values submitted in the form
    var url = event.target.action;  //
    link = url;
    // console.log(url)
    sendEmailData(data);
    changeTextInElement('emailFormDiv', 'Thanks for your email, you\'ll be the first to know when we launch!');
    alignElement('emailFormDiv', 'center');
}

function loaded() {
    console.log('contact form submission handler loaded successfully');
    // bind to the submit event of our form
    var phoneForm = document.getElementById('gform');
    phoneForm.addEventListener("submit", handleFormSubmit, false);
    var emailForm = document.getElementById('emailForm');
    emailForm.addEventListener("submit", handleFormSubmitEmails, false);

}

/**
 * @param elementID:  id given in HTML
 * @param text: a string which the innerHTML will change to.
 */
function changeTextInElement(elementID, text) {
    document.getElementById(elementID).innerHTML = text;
}

/**
 * @param elementID: id given in HTML
 * @param alignment: values of {left|right|center|justify|initial|inherit}
 */
function alignElement(elementID, alignment) {
    document.getElementById(elementID).style.textAlign = alignment
}


document.addEventListener('DOMContentLoaded', loaded, false);
