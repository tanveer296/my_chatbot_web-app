/*
   ============================================
   LOGIN PAGE JAVASCRIPT
   ============================================
   This file handles the login form submission and communicates with the FastAPI backend.
   
   KEY CONCEPT: This is WHY we need JavaScript!
   - HTML forms can submit data, but FastAPI returns JSON
   - We need JavaScript to read JSON responses and handle them
   - JavaScript allows us to stay on the same page and show errors without page reload
*/

// Get references to HTML elements we'll need to interact with
const loginForm = document.getElementById('loginForm');      // The <form> element
const errorMessage = document.getElementById('errorMessage'); // The error message <div>
const loginButton = document.getElementById('loginButton');   // The submit button

// Add an event listener to the form - watches for the submit event
loginForm.addEventListener('submit', async (e) => {
    // Prevent default form submission behavior (which would reload the page)
    e.preventDefault();

    // Get the values entered by the user
    const email = document.getElementById('email').value;       // Email field value
    const password = document.getElementById('password').value; // Password field value

    // Hide any previous error messages
    errorMessage.classList.remove('show');

    // Disable the submit button to prevent multiple clicks
    loginButton.disabled = true;

    // Try to send login request to backend
    try {
        // *** THIS IS THE KEY PART! ***
        // fetch() sends an HTTP request to the FastAPI backend
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',  // POST method sends data to the server
            headers: {
                'Content-Type': 'application/json',  // Tell server we're sending JSON
            },
            // Convert JavaScript object to JSON string and send it
            body: JSON.stringify({
                email: email,      // User's email
                password: password // User's password
            })
        });

        // Parse the JSON response from FastAPI
        // The backend returns something like: {"success": true, "message": "..."}
        const data = await response.json();

        // Check if login was successful (HTTP status 200 OK)
        if (response.ok) {
            // Success! Redirect to welcome page with email in URL
            // encodeURIComponent makes the email safe to put in URL
            window.location.href = '/chat.html?email=' + encodeURIComponent(email);
        } else {
            // Login failed - show error message from backend
            // data.detail contains the error message from FastAPI
            errorMessage.textContent = data.detail || 'Login failed';
            errorMessage.classList.add('show');  // Make error visible

            // Re-enable button so user can try again
            loginButton.disabled = false;
        }

    } catch (error) {
        // Network error occurred (server is down or not responding)
        errorMessage.textContent = 'Connection error. Is the server running?';
        errorMessage.classList.add('show');  // Make error visible

        // Re-enable button so user can try again
        loginButton.disabled = false;
    }
});
