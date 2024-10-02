import { accounts, saveAccountToStorage } from "../data/accounts.js"; 

// Function to set up the logic for creating an account link
function createAccountLinkLogic() {
    // Add click event listener to the create account link
    document.querySelector('.create-account-link').addEventListener('click', () => {
        // Update the inner HTML of the sign-in container to show account creation form
        document.querySelector('.sign-in-flex').innerHTML = `
            <div class="header">
                <span class="header-text">Create Account</span>
            </div>
            <div class="email-text">Email Address</div>
            <input class="email-input input-field" type="text" placeholder="yourname@domain.com">
            <div class="password-text">
                <span class="password">Password</span>
            </div>
            <input class="password-input input-field" type="password" placeholder="Enter Your Password">
            <div class="password-text">
                <span class="password">Confirm Password</span>
            </div>
            <input class="confirm-password-input input-field" type="password" placeholder="Enter Your Password">
            <button class="create-account-button">Create Account</button>`;
        
        // Set up the logic for the newly created account button
        createAccountButtonLogic();
    });
}

// Function to handle the creation of a new account
function createAccountButtonLogic() {
    // Add click event listener to the create account button
    document.querySelector('.create-account-button').addEventListener('click', () => {
        // Get the email input and convert to lowercase for consistency
        let email = document.querySelector('.email-input').value.toLowerCase();

        // Get password inputs
        const password = document.querySelector('.password-input').value;
        const confirmPassword = document.querySelector('.confirm-password-input').value;

        // Validate email and passwords
        if (email && password && confirmPassword) {

             // Check if an account with the given email already exists
            accounts.forEach((account) => {
                if (account.email === email) {
                    alert("An Account with this email already exists");
                    email = null; // Invalidate email if it already exists
                }
            });

            //confirm password match
            if (password === confirmPassword) {
                // Create a new account object
                const newAccount = {
                    email: email,
                    password: password
                };
                // Save the new account to storage
                saveAccountToStorage(newAccount);

                // Reset the form to the sign-in page
                document.querySelector('.sign-in-flex').innerHTML = `
                    <div class="header">
                        <span class="header-text">Sign In</span>
                    </div>
                    <div class="email-text">Email Address</div>
                    <input class="email-input input-field" type="text" placeholder="yourname@domain.com">
                    <div class="password-text">
                        <span class="password">Password</span>
                        <a class="forgot-password-link" onclick="alert('You probably should have written it down')">Forgot Password?</a>
                    </div>
                    <input class="password-input input-field" type="password" placeholder="Enter Your Password">
                    <button class="sign-in-button">Sign In</button>
                    <div class="create-account">
                        <span class="account-text">Don't have an account?</span>
                        <a class="create-account-link">Create your account</a>
                    </div>`;
                
                // Set up the logic for signing in
                SignInLogic();
                // Re-setup the create account link logic
                createAccountLinkLogic();
            } else {
                alert("Password does not match"); // Alert if passwords do not match
            }
        }
    });
}

// Function to handle sign-in logic
function SignInLogic() {
    // Add click event listener to the sign-in button
    document.querySelector('.sign-in-button').addEventListener('click', () => {
        // Get email and password inputs
        const email = document.querySelector('.email-input').value.toLowerCase();
        const password = document.querySelector('.password-input').value;

        // Validate email and password inputs
        if (email && password) {
            let matchingAccount;
            // Check for a matching account
            accounts.forEach((account) => {
                if (account.email === email && account.password === password) {
                    matchingAccount = account; // Found a matching account
                }
            });

            // If a matching account is found, redirect to the homepage
            if (matchingAccount) {
                window.location.href = "homepage.html";
            } else {
                alert("Incorrect email or password"); // Alert if credentials are incorrect
            }
        }
    });
}

// Initialize the account link and sign-in logic
createAccountLinkLogic();
SignInLogic();
