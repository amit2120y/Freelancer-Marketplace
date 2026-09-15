// ============================================================
// Auth Page Logic — Login & Register handlers
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect to dashboard
    if (api.isLoggedIn()) {
        window.location.href = '/dashboard.html';
        return;
    }

    // ── Login Form ─────────────────────────────────────────────
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button[type="submit"]');
            const errorEl = document.getElementById('login-error');

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                showError(errorEl, 'Please fill in all fields');
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Logging in...';

            try {
                await api.login(email, password);
                window.location.href = '/dashboard.html';
            } catch (err) {
                showError(errorEl, err.message || 'Invalid credentials');
                btn.disabled = false;
                btn.innerHTML = 'Log In';
            }
        });
    }

    // ── Register Form ──────────────────────────────────────────
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        // Toggle freelancer-specific fields
        const roleSelect = document.getElementById('reg-role');
        const freelancerFields = document.getElementById('freelancer-fields');

        if (roleSelect && freelancerFields) {
            roleSelect.addEventListener('change', () => {
                if (roleSelect.value === 'freelancer') {
                    freelancerFields.classList.remove('hidden');
                } else {
                    freelancerFields.classList.add('hidden');
                }
            });
        }

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = registerForm.querySelector('button[type="submit"]');
            const errorEl = document.getElementById('register-error');

            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            const role = document.getElementById('reg-role').value;

            if (!name || !email || !password || !confirmPassword) {
                showError(errorEl, 'Please fill in all required fields');
                return;
            }

            if (password !== confirmPassword) {
                showError(errorEl, 'Passwords do not match');
                return;
            }

            if (password.length < 6) {
                showError(errorEl, 'Password must be at least 6 characters');
                return;
            }

            const userData = { name, email, password, role };

            // Add freelancer-specific fields
            if (role === 'freelancer') {
                const title = document.getElementById('reg-title')?.value.trim();
                const skillsRaw = document.getElementById('reg-skills')?.value.trim();
                const hourlyRate = document.getElementById('reg-hourly')?.value;
                const location = document.getElementById('reg-location')?.value.trim();

                if (title) userData.title = title;
                if (skillsRaw) userData.skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);
                if (hourlyRate) userData.hourlyRate = Number(hourlyRate);
                if (location) userData.location = location;
            }

            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Creating account...';

            try {
                await api.register(userData);
                window.location.href = '/dashboard.html';
            } catch (err) {
                showError(errorEl, err.message || 'Registration failed');
                btn.disabled = false;
                btn.innerHTML = 'Create Account';
            }
        });
    }
    // ── Google Sign-In Setup ────────────────────────────────────
    const googleBtn = document.getElementById('btn-google-signin');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            const roleSelect = document.getElementById('reg-role');
            const role = roleSelect ? roleSelect.value : 'freelancer';

            // Check if GIS is available
            if (window.google && window.google.accounts && window.google.accounts.id) {
                try {
                    google.accounts.id.initialize({
                        client_id: "422690163904-1bknh8sjnolu1s19g73453a18uv1n9le.apps.googleusercontent.com",
                        callback: (response) => handleGoogleSignIn(response.credential, role)
                    });
                    google.accounts.id.prompt((notification) => {
                        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                            // Fallback to quick simulated Google login for demonstration
                            triggerDemoGoogleLogin(role);
                        }
                    });
                } catch (e) {
                    triggerDemoGoogleLogin(role);
                }
            } else {
                triggerDemoGoogleLogin(role);
            }
        });
    }
});

async function handleGoogleSignIn(credential, role = 'freelancer') {
    const errorEl = document.getElementById('login-error') || document.getElementById('register-error');
    try {
        await api.googleLogin(credential, role);
        window.location.href = '/dashboard.html';
    } catch (err) {
        showError(errorEl, err.message || 'Google Sign-In failed');
    }
}

function triggerDemoGoogleLogin(role = 'freelancer') {
    // Generate simulated Google ID token payload for instant demo
    const mockHeader = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const mockPayload = btoa(JSON.stringify({
        sub: "google-1092837465",
        name: "Ananya Sharma",
        email: "ananya.google@example.com",
        picture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80"
    }));
    const mockCredential = `${mockHeader}.${mockPayload}.mockSignature`;
    handleGoogleSignIn(mockCredential, role);
}

function showError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 5000);
}

