document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-box');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.querySelector('input[type="email"]').value;
        const password = document.querySelector('input[type="password"]').value;

        try {
            const response = await login(email, password);
            // Store user info if needed
            sessionStorage.setItem('userName', response.user.name);
            
            // Redirect to homepage
            window.location.href = '../HomePage/homePage.html';
        } catch (error) {
            // Show error to user
            alert(error);
        }
    });
});