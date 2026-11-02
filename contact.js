document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if(hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('show'));

    const form = document.getElementById('contactForm');
    const errorBox = document.getElementById('errorBox');
    const successBox = document.getElementById('successBox');
    const emailPreview = document.getElementById('emailPreview');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        errorBox.textContent = "";
        successBox.textContent = "";
        emailPreview.style.display = "none";

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();

        
        let errors = [];
        if(name.length < 2) errors.push("Full name must be at least 2 characters");
        if(!email.includes('@')) errors.push("Valid email required");
        if(phone.length < 10) errors.push("Phone must be at least 10 digits");
        if(!subject) errors.push("Select a subject");
        if(message.length < 10) errors.push("Message must be at least 10 characters");

        if(errors.length > 0){
            errorBox.innerHTML = errors.join("<br>");
            return;
        }

        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        setTimeout(() => {
           
            const emailContent = `
                <h3 style="color:#a92e8c; margin-bottom:10px;">📧 Email Ready to Send</h3>
                <p><strong>To:</strong> gardenbloom@gmail.com</p>
                <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr style="margin:10px 0;">
                <p><strong>Message:</strong></p>
                <p style="background:white; padding:10px; border-radius:5px;">${message}</p>
                <hr style="margin:10px 0;">
                <p style="font-size:0.8rem; color:gray;">Sent from Garden Bloom Contact Form - ${new Date().toLocaleString()}</p>
                <a href="mailto:gardenbloom@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`)}" 
                   style="display:inline-block; margin-top:10px; background:#a92e8c; color:white; padding:8px 15px; border-radius:8px; text-decoration:none;">
                   Open in Email App
                </a>
            `;

            emailPreview.innerHTML = emailContent;
            emailPreview.style.display = "block";
            successBox.textContent = `Thank you ${name}! Your message compiled into email format below. ✅`;
            
            
            let messages = JSON.parse(localStorage.getItem('contactMessages') || "[]");
            messages.push({name, email, phone, subject, message, date: new Date().toISOString()});
            localStorage.setItem('contactMessages', JSON.stringify(messages));

            form.reset();
            submitBtn.textContent = "Send Message";
            submitBtn.disabled = false;

            console.log("Contact Form Compiled to Email:", {to: "gardenbloom@gmail.com", from: email, subject, message});
        }, 800);
    });
});