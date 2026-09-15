// ============================================================
// Post Job Page Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Require authentication as client
    if (!api.isLoggedIn()) {
        window.location.href = '/login.html';
        return;
    }

    const user = api.getUser();
    if (user.role !== 'client') {
        alert('Only clients can post jobs. Please register as a client.');
        window.location.href = '/dashboard.html';
        return;
    }

    const form = document.getElementById('post-job-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const errorEl = document.getElementById('post-job-error');
        const successEl = document.getElementById('post-job-success');

        const title = document.getElementById('job-title').value.trim();
        const company = document.getElementById('job-company').value.trim();
        const budget = document.getElementById('job-budget').value.trim();
        const type = document.getElementById('job-type').value;
        const category = document.getElementById('job-category').value;
        const location = document.getElementById('job-location').value.trim() || 'Remote';
        const skillsRaw = document.getElementById('job-skills').value.trim();
        const description = document.getElementById('job-description').value.trim();

        if (!title || !company || !budget || !category) {
            showError(errorEl, 'Please fill in all required fields');
            return;
        }

        const jobData = {
            title,
            company,
            budget,
            type,
            category,
            location,
            skills: skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
            description
        };

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Posting...';

        try {
            await api.createJob(jobData);
            if (successEl) {
                successEl.textContent = 'Job posted successfully! Redirecting...';
                successEl.classList.remove('hidden');
            }
            if (errorEl) errorEl.classList.add('hidden');

            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1500);
        } catch (err) {
            showError(errorEl, err.message || 'Failed to post job');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Post Job';
        }
    });
});

function showError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
    const successEl = document.getElementById('post-job-success');
    if (successEl) successEl.classList.add('hidden');
    setTimeout(() => el.classList.add('hidden'), 5000);
}
