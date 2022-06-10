let username = {
    input: document.getElementById("username"),
    valid: false,
};

let password = {
    input: document.getElementById("password"),
    valid: false,
};

formInputs = [username, password];

const isRequired = (value) => (value === "" ? false : true);

username.input.addEventListener("input", () => {
    document.getElementById("login-error").classList.add('hidden');
    if (isRequired(username.input.value.trim())) {
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
    document.getElementById("login-error").classList.add('hidden');
    if (isRequired(password.input.value.trim())) {
        password.input.style.outlineColor = "hsl(145, 63%, 40%)";
        document.getElementById("password-error").classList.add("hidden");
        password.valid = true;
    } else {
        password.input.style.outlineColor = "hsl(0, 100%, 34%)";
        document.getElementById("password-error").classList.remove("hidden");
        password.valid = false;
    }
});

function loginUser() {
    let valid = true;

    for (let i = 0; i < formInputs.length; i++) {
        if (!formInputs[i].valid && formInputs[i].input.value == "") {
            formInputs[i].input.style.outlineColor = "hsl(0, 100%, 34%)";
            valid = false;
        }
    }

    if (!valid) {
        return;
    }

    const userData = {
        username: username.input.value,
        password: password.input.value,
    };

    fetch("./loginUser", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
        .then((res) => {
            console.log(res);
            if (res.status == 200) {
                console.log("succes");
                window.location.href = './myAccount';
            } else if (res.status == 401) {
                console.log("bad request");
                document.getElementById("login-error").classList.remove('hidden');
            }
        })
        .catch((err) => {
            console.log("error");
        });
}
