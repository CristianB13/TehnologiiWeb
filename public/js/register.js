function validateEmail(mail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
}

function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
        password
    );
}

function validateUsername(username) {
    return /^\w{3,25}$/.test(username);
}

const isRequired = (value) => (value === "" ? false : true);

let fname = {
    input: document.getElementById("fname"),
    valid: false,
};
let lname = {
    input: document.getElementById("lname"),
    valid: false,
};
let email = {
    input: document.getElementById("email"),
    valid: false,
};
let username = {
    input: document.getElementById("username"),
    valid: false,
};
let password = {
    input: document.getElementById("password"),
    valid: false,
};
let confirmPassword = {
    input: document.getElementById("confirm-password"),
    valid: false,
};

let signUpButton = document.getElementById("sign-up");

let formInputs = [fname, lname, email, username, password, confirmPassword];

window.addEventListener("click", (e) => {
    for (let i = 0; i < formInputs.length; i++) {
        if (e.currentTarget == formInputs[i].input) {
            formInputs[i].input.nextElementSibling.classList.remove("hidden");
        } else {
            formInputs[i].input.nextElementSibling.classList.add("hidden");
        }
    }
});

fname.input.addEventListener("input", () => {
    fname.input.style.outlineWidth = "3px";
    if (isRequired(fname.input.value.trim())) {
        fname.input.style.outlineColor = "hsl(145, 63%, 40%)";
        document.getElementById("fname-error").classList.add("hidden");
        fname.valid = true;
    } else {
        fname.input.style.outlineColor = "hsl(0, 100%, 34%)";
        document.getElementById("fname-error").classList.remove("hidden");
        fname.valid = false;
    }
});

lname.input.addEventListener("input", () => {
    lname.input.style.outlineWidth = "3px";
    if (isRequired(lname.input.value.trim())) {
        lname.input.style.outlineColor = "hsl(145, 63%, 40%)";
        document.getElementById("lname-error").classList.add("hidden");
        lname.valid = true;
    } else {
        lname.input.style.outlineColor = "hsl(0, 100%, 34%)";
        document.getElementById("lname-error").classList.remove("hidden");
        lname.valid = false;
    }
});

email.input.addEventListener("input", () => {
    email.input.style.outlineWidth = "3px";
    if (validateEmail(email.input.value)) {
        email.input.style.outlineColor = "hsl(145, 63%, 40%)";
        document.getElementById("email-error").classList.add("hidden");
        email.valid = true;
    } else {
        email.input.style.outlineColor = "hsl(0, 100%, 34%)";
        document.getElementById("email-error").classList.remove("hidden");
        email.valid = false;
    }
});

username.input.addEventListener("input", () => {
    username.input.style.outlineWidth = "3px";
    if (validateUsername(username.input.value)) {
        username.input.style.outlineColor = "hsl(145, 63%, 40%)";
        document.getElementById("username-error").classList.add("hidden");
        username.valid = true;
    } else {
        username.input.style.outlineColor = "hsl(0, 100%, 34%)";
        document.getElementById("username-error").classList.remove("hidden");
        username.valid = false;
    }
});

password.input.addEventListener("input", () => {
    password.input.style.outlineWidth = "3px";
    if (validatePassword(password.input.value)) {
        password.input.style.outlineColor = "hsl(145, 63%, 40%)";
        document.getElementById("password-error").classList.add("hidden");
        password.valid = true;
    } else {
        password.input.style.outlineColor = "hsl(0, 100%, 34%)";
        document.getElementById("password-error").classList.remove("hidden");
        password.valid = false;
    }
    confirmPasswordFunction();
});

function confirmPasswordFunction() {
    confirmPassword.input.style.outlineWidth = "3px";
    password.input.style.outlineWidth = "3px";
    if (confirmPassword.input.value == password.input.value) {
        confirmPassword.input.style.outlineColor = "hsl(145, 63%, 40%)";
        document
            .getElementById("confirm-password-error")
            .classList.add("hidden");
        confirmPassword.valid = true;
    } else {
        confirmPassword.input.style.outlineColor = "hsl(0, 100%, 34%)";
        document
            .getElementById("confirm-password-error")
            .classList.remove("hidden");
        confirmPassword.valid = false;
    }
}

confirmPassword.input.addEventListener("input", () => {
    confirmPasswordFunction();
});

function registerUser() {
    let valid = true;
    for (let i = 0; i < formInputs.length; i++) {
        if (!formInputs[i].valid) {
            formInputs[i].input.style.outlineColor = "hsl(0, 100%, 34%)";
            valid = false;
        }
    }

    if (!valid) {
        return;
    }

    const userData = {
        firstName: fname.input.value,
        lastName: lname.input.value,
        email: email.input.value,
        username: username.input.value,
        password: password.input.value,
    };

    fetch("./registerUser", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
        .then(async (res) => {
            if (res.status == 201) {
                window.location.href = "./login";
            } else {
                let message = await res.text() == "email_constraint" ? " Email already in use" : "Username already in use";
                document.getElementById('signup-constraint').innerHTML = message;
                document.getElementById('signup-error').classList.remove('hidden');
            }
        })
        .catch((err) => {
            console.log("error");
        });
}
