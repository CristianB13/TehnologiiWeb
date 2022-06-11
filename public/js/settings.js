let settingsButton = document.getElementById('settings-button');
let updateUserResponse = document.getElementById('update-user-response');

const isRequired = (value) => (value === "" ? false : true);

async function getUserData(){
    let userData = await fetch('./me', {
        method : 'GET'
    });
    userData = await userData.json();
    return userData;
}

function permitEdit(element){
    element.parentElement.firstElementChild.removeAttribute("disabled");
}

settingsButton.addEventListener('click', async () => {
    updateUserResponse.classList.add('hidden');
    let user = await getUserData();
    fname.value = user.first_name;
    lname.value = user.last_name;
})

let firstNameError = document.getElementById('fname-error');
let lastNameError = document.getElementById('lname-error');

fname.addEventListener('input', () => {
    if(!isRequired(fname.value)){
        firstNameError.classList.remove('hidden');
    } else {
        firstNameError.classList.add('hidden');
    }
})

lname.addEventListener('input', () => {
    if(!isRequired(lname.value)){
        lastNameError.classList.remove('hidden');
    } else {
        lastNameError.classList.add('hidden');
    }
})

async function updateUserData(){
    if(!isRequired(fname.value) || !isRequired(lname.value)) return;
    let response = await fetch('./updateUser', {
        method: 'PUT',
        body : JSON.stringify({
            "fname" : fname.value,
            "lname" : lname.value
        })
    });

    if(response.status != 200){
        updateUserResponse.innerText = "Something went wrong ...";
        
    } else {
        updateUserResponse.innerText = "Updated successfully";
    }
    settingsButton.click();
    updateUserResponse.classList.remove('hidden');
}