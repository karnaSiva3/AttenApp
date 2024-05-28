const formOpenBtn = document.querySelector("#form-open"),
    home = document.querySelector(".home"),
    formContainer = document.querySelector(".form-container"),
    formCloseBtn = document.querySelector(".form_close"),
    signupBtn = document.querySelector("#signup"),
    loginBtn = document.querySelector("#login"),
    pwShowHide = document.querySelectorAll(".pw_hide");
formOpenBtn.addEventListener("click", () => home.classList.add("show"));
formCloseBtn.addEventListener("click", () => home.classList.remove("show"));
pwShowHide.forEach((icon) => {
    icon.addEventListener("click", () => {
        let getPwInput = icon.parentElement.querySelector("input");
        if (getPwInput.type === "password") {
            getPwInput.type = "text";
            icon.classList.replace("bxs-hide", "bxs-show");
        }
        else {
            getPwInput.type = "password";
            icon.classList.replace("bxs-show", "bxs-hide");
        }
    })
})
signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formContainer.classList.add("active");
});
loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    formContainer.classList.remove("active");
});
function register(event) {
    event.preventDefault();
    var username = document.getElementById("registeringUsername").value;
    var email = document.getElementById("registeringEmail").value;
    var password = document.getElementById("registeringPassword").value;
    if (username === '' || email === '' || password === '') {
        alert("One or more input fields are blank. Please enter your details to register");
        document.getElementById("registeringUsername").value = '';
        document.getElementById("registeringEmail").value = '';
        document.getElementById("registeringPassword").value = '';
    }
    else {
        localStorage.setItem('ls_username', username);
        localStorage.setItem('ls_email', email);
        localStorage.setItem('ls_password', password);
        alert("Successfully registered");
        document.getElementById("registeringUsername").value = '';
        document.getElementById("registeringEmail").value = '';
        document.getElementById("registeringPassword").value = '';
    }
}
function login(event) {
    event.preventDefault();
    var inputtedUsername = document.getElementById("inputtedUsername").value;
    var inputtedPassword = document.getElementById("inputtedPassword").value;
    var storedUsername = localStorage.getItem('ls_username');
    var storedPassword = localStorage.getItem('ls_password');
    if (inputtedUsername === storedUsername && inputtedPassword === storedPassword) {
        alert('Login Successful!');
        window.location.assign('src/templates/pages/Employee/directory.html');
    }
    else if (inputtedUsername === '' || inputtedPassword === '') {
        alert("One or more input fields are blank. Please enter your details to login");
        document.getElementById("inputtedUsername").value = '';
        document.getElementById("inputtedPassword").value = '';
    }
    else {
        alert("Your credentials are incorrect");
        document.getElementById("inputtedUsername").value = '';
        document.getElementById("inputtedPassword").value = '';
    }
}
function OAuthSignIn() {
    let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    let form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);
    let params = {
        "client_id":"1082031197139-07td9bf0qa5pedmri0vo6sigak1b8fjg.apps.googleusercontent.com",
        "redirect_uri":"http://127.0.0.1:5500",
        "response_type":"token",
        "scope":"https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube.readonly",
        "include_granted_scopes":'true',
        'state':'pass-through-value'
    }
    for (var p in params) {
        let input = document.createElement('input');
        input.setAttribute('type','hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input)
    }
    document.body.appendChild(form);
    form.submit();
}