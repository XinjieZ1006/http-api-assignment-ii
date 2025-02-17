const handleResponse = async (res, parseRes) => {
    const pageContent = document.querySelector('#content');

    let contentType = res.headers.get('Content-type');

    switch (res.status) {
        case 200:
            pageContent.innerHTML = `<b>Success</b>`
            break;
        case 404:
            pageContent.innerHTML = `<b>Not found</b>`
            break;
        case 201:
            pageContent.innerHTML = `<b>Created</b>`
            break;
        case 204:
            pageContent.innerHTML = `<b>Updated (No content)</b>`
            break;
        case 400:
            pageContent.innerHTML = `<b>Bad Request</b>`;
            break;
    }

    // determine if response should be parsed
    const resText = await res.text();
    let resJson;
    if (resText) {
        resJson = JSON.parse(resText);
    } else {
        resJson = {};
    }
    console.log(resJson);
    if (parseRes) {
        let jsonString = JSON.stringify(resJson);
        //pageContent.innerHTML += `<p>${jsonString}</p>`
        if (resJson.message) {
            pageContent.innerHTML += `<p>${resJson.message}</p>`
        }
        else if(resJson.users){
            pageContent.innerHTML += `<p>${JSON.stringify(resJson.users)}</p>`
        }
        else {
            //pageContent.innerHTML += `<p>Received</p>`
        }
    }
}

const sendFetch = async (userForm) => {
    const url = userForm.querySelector('#urlField').value;
    const method = userForm.querySelector('#methodSelect').value;
    const options = {
        method,
        headers: { 'Accept': 'application/json' }
    }
    try {
        let response = await fetch(url, options);
        handleResponse(response, method === 'get');
    }
    catch {
        console.log('oopsie there is an error...');
    }
}

const postFetch = async (nameForm) => {
    const name = nameForm.querySelector("#nameField").value;
    const age = nameForm.querySelector("#ageField").value;
    const url = nameForm.action;
    const method = nameForm.method;

    const formData = {
        name: name,
        age: age,
    };
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
    }
    //console.log(options);
    try {
        let response = await fetch(url, options);
        handleResponse(response, true);
    }
    catch (error) {
        console.log(error);
    }
}

// set up buttons
const sendButton = document.querySelector("#send");
const userForm = document.querySelector('#userForm');
const nameForm = document.querySelector('#nameForm');
const page = document.querySelector("#page");
const type = document.querySelector("#type");

//sendButton.onclick = () => { sendFetch(page.value, type.value) };
userForm.onsubmit = (e) => {
    e.preventDefault();
    sendFetch(userForm);
    return false;
};
nameForm.onsubmit = (e) => {
    e.preventDefault();
    postFetch(nameForm);
    return false;
}