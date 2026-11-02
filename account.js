document.addEventListener('DOMContentLoaded', () => {
   
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if(hamburger && navLinks){
        hamburger.addEventListener('click', () => navLinks.classList.toggle('show'));
    }

    const form = document.getElementById('accountForm');
    const errorBox = document.getElementById('errorBox');
    const successBox = document.getElementById('successBox');
    const password = document.getElementById('password');
    const passwordStrength = document.getElementById('passwordStrength');
    const submitBtn = document.getElementById('submitBtn');

    
    password.addEventListener('input', () => {
        const val = password.value;
        if(val.length === 0){ passwordStrength.textContent = ""; return; }
        if(val.length < 6){ passwordStrength.textContent = "Too short ❌"; passwordStrength.style.color = "red"; }
        else if(val.length < 8){ passwordStrength.textContent = "Fair ⚠️"; passwordStrength.style.color = "orange"; }
        else { passwordStrength.textContent = "Strong 💪 ✅"; passwordStrength.style.color = "green"; }
    });

    
    form.addEventListener('reset', () => {
        errorBox.textContent = "";
        successBox.textContent = "";
        passwordStrength.textContent = "";
    });

    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        errorBox.textContent = "";
        successBox.textContent = "";

        const firstName = document.getElementById('firstName').value.trim();
        const surname = document.getElementById('surname').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const username = document.getElementById('username').value.trim();
        const pass = password.value.trim();

        let errors = [];

        
        if(firstName.length < 2) errors.push("First name must be at least 2 characters");
        if(surname.length < 2) errors.push("Surname must be at least 2 characters");
        if(!/^[0-9]{10}$/.test(phone)) errors.push("Phone must be exactly 10 digits (e.g., 0821234567)");
        if(!email.includes('@') || !email.includes('.')) errors.push("Enter valid email");
        if(username.length < 4) errors.push("Username must be at least 4 characters");
        if(pass.length < 6) errors.push("Password must be at least 6 characters");

        if(errors.length > 0){
            errorBox.innerHTML = errors.join("<br>");
            return; // Stop if errors
        }

       
        submitBtn.textContent = "Creating...";
        submitBtn.disabled = true;

        const userData = { firstName, surname, phone, email, username, password: pass };

       
        setTimeout(() => {
            let users = JSON.parse(localStorage.getItem('gardenBloomUsers') || "[]");
            
            if(users.some(u => u.email === email)){
                errorBox.textContent = "This email is already registered. Try login.";
                submitBtn.textContent = "Create Account";
                submitBtn.disabled = false;
                return;
            }
            if(users.some(u => u.username === username)){
                errorBox.textContent = "Username taken, choose another.";
                submitBtn.textContent = "Create Account";
                submitBtn.disabled = false;
                return;
            }

            users.push(userData);
            localStorage.setItem('gardenBloomUsers', JSON.stringify(users));
            localStorage.setItem('gardenBloomUser', firstName);

           
            successBox.innerHTML = `Account created for ${firstName} ${surname}! 🌸<br>Username: ${username}<br>We will contact you on ${phone}`;
            form.reset();
            passwordStrength.textContent = "";
            submitBtn.textContent = "Create Account";
            submitBtn.disabled = false;

         
            console.log("New User Registered:", userData);

        }, 1000);
    });

    document.getElementById('loginLink').addEventListener('click', (e) => {
        e.preventDefault();
        alert("Login page coming soon! For now, test with account you just created. Your data is saved in browser (localStorage).");
    });
});