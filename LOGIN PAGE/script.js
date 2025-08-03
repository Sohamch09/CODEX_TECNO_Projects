        const tabs = document.querySelectorAll('.tab');
        const forms = document.querySelectorAll('.form');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const securedPage = document.getElementById('secured-page');
        const notification = document.getElementById('notification');
        const authCard = document.getElementById('auth-card');
        
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        
        if (users.length === 0) {
            users.push({
                name: "Demo User",
                email: "demo@example.com",
                password: "password123"
            });
            localStorage.setItem('users', JSON.stringify(users));
        }
        
                                                                          //tab switch
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                
                tabs.forEach(t => t.classList.remove('active'));
                
                
                tab.classList.add('active');
                
                
                forms.forEach(form => form.classList.remove('active'));
                
                
                const tabName = tab.getAttribute('data-tab');
                document.getElementById(`${tabName}-form`).classList.add('active');
            });
        });
        
        
        function showNotification(message, isSuccess = false) {
            const icon = isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle';
            notification.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
                
            notification.className = isSuccess 
                ? 'notification success' 
                : 'notification';
                
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
        
        
        function showError(elementId, message) {
            const errorElement = document.getElementById(elementId);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        function hideError(elementId) {
            document.getElementById(elementId).style.display = 'none';
        }
        
        
        function validateLogin() {
            let isValid = true;
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            
            hideError('login-email-error');
            hideError('login-password-error');
            
            
            if (!email) {
                showError('login-email-error', 'Email is required');
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                showError('login-email-error', 'Email is invalid');
                isValid = false;
            }
            
            
            if (!password) {
                showError('login-password-error', 'Password is required');
                isValid = false;
            } else if (password.length < 6) {
                showError('login-password-error', 'Password must be at least 6 characters');
                isValid = false;
            }
            
            return isValid;
        }
        
        // Validate registration form
        function validateRegistration() {
            let isValid = true;
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;
            
            // Reset errors
            hideError('register-name-error');
            hideError('register-email-error');
            hideError('register-password-error');
            hideError('register-confirm-error');
            
            // Validate name
            if (!name) {
                showError('register-name-error', 'Name is required');
                isValid = false;
            }
            
            // Validate email
            if (!email) {
                showError('register-email-error', 'Email is required');
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                showError('register-email-error', 'Email is invalid');
                isValid = false;
            } else if (users.some(user => user.email === email)) {
                showError('register-email-error', 'Email is already registered');
                isValid = false;
            }
            
            // Validate password
            if (!password) {
                showError('register-password-error', 'Password is required');
                isValid = false;
            } else if (password.length < 6) {
                showError('register-password-error', 'Password must be at least 6 characters');
                isValid = false;
            }
            
            // Validate password confirmation
            if (!confirm) {
                showError('register-confirm-error', 'Please confirm your password');
                isValid = false;
            } else if (password !== confirm) {
                showError('register-confirm-error', 'Passwords do not match');
                isValid = false;
            }
            
            return isValid;
        }
        
        
        document.getElementById('login-btn').addEventListener('click', () => {
            if (!validateLogin()) return;
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Find user
            const user = users.find(user => user.email === email);
            
            if (!user) {
                showNotification('Email not registered. Please register first.');
                return;
            }
            
            if (user.password !== password) {
                showNotification('Incorrect password. Please try again.');
                return;
            }
            
            // Successful login
            authCard.style.display = 'none';
            securedPage.style.display = 'block';
            showNotification('Login successful! Welcome back.', true);
        });
        
        // Registration functionality
        document.getElementById('register-btn').addEventListener('click', () => {
            if (!validateRegistration()) return;
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            // Create user object
            const user = {
                name,
                email,
                password
            };
            
            // Add user to array
            users.push(user);
            
            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Show success notification
            showNotification('Account created successfully! You can now login.', true);
            
            // Switch to login form
            tabs.forEach(t => t.classList.remove('active'));
            tabs[0].classList.add('active');
            forms.forEach(form => form.classList.remove('active'));
            loginForm.classList.add('active');
            
            // Clear form
            document.getElementById('register-name').value = '';
            document.getElementById('register-email').value = '';
            document.getElementById('register-password').value = '';
            document.getElementById('register-confirm').value = '';
        });
        
        // Logout 
        document.getElementById('logout-btn').addEventListener('click', () => {
            securedPage.style.display = 'none';
            authCard.style.display = 'block';
            document.getElementById('login-email').value = '';
            document.getElementById('login-password').value = '';
            showNotification('You have been logged out successfully', true);
        });