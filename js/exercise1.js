    let id_form = document.querySelector("#id_form");
    let id_name = document.querySelector("#id_name");
    let id_email1 = document.querySelector("#id_email1");
    let id_email2 = document.querySelector("#id_email2");
    let id_Nvalid = document.querySelector("#id_Nvalid");
    let id_Evalid = document.querySelector("#id_Evalid");
    let id_password = document.querySelector("#id_password");
    let id_Pvalid = document.querySelector("#id_Pvalid");
    id_email1.addEventListener("input", checkEmail);
    id_email2.addEventListener("input", checkEmail);
    id_name.addEventListener("input", checkName);
    id_password.addEventListener("input", checkPassword);
    let users = JSON.parse(localStorage.getItem("users")) || [];


    id_form.addEventListener("submit", (e) => {
        e.preventDefault();
        const isNameValid = checkName();
        const isEmailValid = checkEmail();
        const isPasswordValid = checkPassword();
        if (isNameValid && isEmailValid && isPasswordValid) {

            let newUser = {
                name: id_name.value,
                email: id_email1.value,
                password: id_password.value
            };
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            window.location.href = "../project-folder/login.html";
        } 
    });
    function isEmailExists(email) {
        return users.some(user => user.email === email);
    }

    function checkEmail() {
        if (id_email1.value === id_email2.value&&id_email1.value.length>0) {
            if (isEmailExists(id_email1.value)) {
                id_Evalid.textContent = "Email already exists";
                id_Evalid.style.color = "red";
                return false;
            } else {
                id_Evalid.textContent = "Emails match";
                id_Evalid.style.color = "green";
                return true;
            }
        } else {
            id_Evalid.textContent = "Emails do not match";
            id_Evalid.style.color = "red";
            return false;
        }
    }
    
    function checkName() {
        if (id_name.value.length < 2) {
            id_Nvalid.textContent = "Name must be at least 2 characters long";
            id_Nvalid.style.color = "red";
            return false;
        } else {
            id_Nvalid.textContent = "";
            return true; 
        }
    }
    function checkPassword() {
        let passLength = id_password.value.length;
        if (passLength <= 2) {
            id_Pvalid.textContent = "Weak password";
            id_Pvalid.style.color = "red";
            return false;
        } else if (passLength < 6) {
            id_Pvalid.textContent = "Medium password";
            id_Pvalid.style.color = "orange";
            return false;
        } else {
            id_Pvalid.textContent = "Strong password";
            id_Pvalid.style.color = "green";
            return true;
    }}