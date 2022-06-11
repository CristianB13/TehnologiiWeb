let deleteAccountError = document.getElementById('delete-account-error');
async function deleteMyAccount(){
    let response = await fetch('./deleteAccount', {
        method: 'DELETE'
    });
    if(response.status != 200 ){
        deleteAccountError.classList.remove('hidden');
    } else {
        window.location = "./login";
    }
}