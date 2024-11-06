// Utility functions to manage cookies
const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
    return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))
        ?.split('=')[1];
};

const clearCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

// ... other code ...

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const socialMediaPage = document.getElementById('social-media-ui');
const landingPage = document.getElementById('landing-page');

// Show login and signup forms
document.getElementById('show-login').addEventListener('click', function (event) {
    event.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

document.getElementById('show-signup').addEventListener('click', function (event) {
    event.preventDefault();
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
});

// Signup form submission
document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const firstname = document.getElementById('signup-firstname').value.trim();
    const lastname = document.getElementById('signup-lastname').value.trim();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const telephone = document.getElementById('signup-telephone').value.trim();
    const address = document.getElementById('signup-address').value.trim();
    const purpose = document.getElementById('signup-purpose').value;
    const password = document.getElementById('signup-password').value;

    if (!validateEmail(email)) {
        alert('Please enter a valid email.');
        return;
    }
    if (!validatePassword(password)) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    try {
        const response = await fetch('/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstname, lastname, username, email, telephone, address, purpose, password })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            landingPage.style.display = 'none';
            socialMediaPage.style.display = 'block';
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Login form submission
document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!validateEmail(email)) {
        alert('Please enter a valid email.');
        return;
    }

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (response.ok) {
            // Set tokens in cookies
            setCookie('authToken', result.token, 1); 
            setCookie('refreshToken', result.refreshToken, 7);
            alert(`Welcome back, ${result.username}!`);
            landingPage.style.display = 'none';
            socialMediaPage.style.display = 'block';
        } else {
            alert(result.error || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Token refresh function
const refreshToken = async () => {
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) return;

    try {
        const response = await fetch('/auth/refresh-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });
        const data = await response.json();
        if (data.token) {
            setCookie('authToken', data.token, 1); 
        } else {
            alert('Unable to refresh token. Please log in again.');
            clearCookie('authToken');
            clearCookie('refreshToken');
        }
    } catch (error) {
        console.error('Failed to refresh token:', error);
    }
};

// Call refreshToken on page load or based on specific events
window.onload = () => {
    refreshToken();
};

// Helper functions for validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateTelephone(telephone) {
    const phoneRegex = /^[0-9]{10}$/; // Assumes 10-digit phone number
    return phoneRegex.test(telephone);
}
