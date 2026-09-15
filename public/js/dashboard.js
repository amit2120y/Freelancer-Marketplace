// ============================================================
// Dashboard Page Logic
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
    // Require authentication
    if (!api.isLoggedIn()) {
        window.location.href = '/login.html';
        return;
    }

    const user = api.getUser();
    if (!user) {
        api.logout();
        return;
    }

    // Populate user info
    const nameEl = document.getElementById('dash-user-name');
    const roleEl = document.getElementById('dash-user-role');
    const avatarEl = document.getElementById('dash-user-avatar');

    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role === 'client' ? 'Client Account' : 'Freelancer Account';
    if (avatarEl) avatarEl.src = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=C41E1E&color=fff`;

    // Show/hide sections based on role
    const clientSection = document.getElementById('client-section');
    const freelancerSection = document.getElementById('freelancer-section');

    if (user.role === 'client') {
        if (clientSection) clientSection.classList.remove('hidden');
        if (freelancerSection) freelancerSection.classList.add('hidden');
        await loadClientDashboard();
    } else {
        if (clientSection) clientSection.classList.add('hidden');
        if (freelancerSection) freelancerSection.classList.remove('hidden');
        await loadFreelancerDashboard(user);
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            api.logout();
        });
    }
});

async function loadClientDashboard() {
    try {
        const jobsRes = await api.getJobs();
        const jobs = jobsRes.data || [];

        // Stats
        const user = api.getUser();
        const myJobs = jobs.filter(j => j.postedBy?._id === user._id || j.postedBy === user._id);

        document.getElementById('stat-posted-jobs').textContent = myJobs.length;
        document.getElementById('stat-total-proposals').textContent = myJobs.reduce((sum, j) => sum + (j.proposals || 0), 0);
        document.getElementById('stat-active-contracts').textContent = myJobs.filter(j => j.status === 'in-progress').length;

        // Render my jobs list
        const container = document.getElementById('my-jobs-list');
        if (container) {
            if (myJobs.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12 text-charcoal-700">
                        <i class="fas fa-briefcase text-4xl mb-3 block opacity-40"></i>
                        <p class="font-medium">No jobs posted yet</p>
                        <a href="/post-job.html" class="text-crimson-400 hover:text-crimson-300 text-sm mt-2 inline-block">Post your first job →</a>
                    </div>
                `;
            } else {
                container.innerHTML = myJobs.map(j => `
                    <div class="bg-charcoal-900/50 border border-charcoal-800 rounded-xl p-5 flex items-center justify-between hover:border-crimson-500/30 transition-colors">
                        <div class="flex-1">
                            <h4 class="text-white font-semibold text-sm mb-1">${j.title}</h4>
                            <div class="flex items-center gap-3 text-xs text-warmwhite/50">
                                <span>${j.company}</span>
                                <span>•</span>
                                <span>${j.budget}</span>
                                <span>•</span>
                                <span class="text-crimson-400">${j.proposals || 0} proposals</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${
                                j.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                j.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                'bg-charcoal-800/60 text-warmwhite/40 border border-charcoal-700'
                            }">${j.status}</span>
                            <button class="text-warmwhite/40 hover:text-crimson-400 transition-colors text-xs delete-job-btn" data-id="${j._id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');

                // Attach delete handlers
                container.querySelectorAll('.delete-job-btn').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        if (confirm('Are you sure you want to delete this job?')) {
                            try {
                                await api.deleteJob(btn.dataset.id);
                                btn.closest('div.bg-charcoal-900\/50').remove();
                            } catch (err) {
                                alert('Failed to delete job: ' + err.message);
                            }
                        }
                    });
                });
            }
        }
    } catch (err) {
        console.error('Load client dashboard error:', err);
    }
}

async function loadFreelancerDashboard(user) {
    try {
        const proposalsRes = await api.getMyProposals();
        const proposals = proposalsRes.data || [];

        // Stats
        document.getElementById('stat-proposals-sent').textContent = proposals.length;
        document.getElementById('stat-accepted').textContent = proposals.filter(p => p.status === 'accepted').length;
        document.getElementById('stat-pending').textContent = proposals.filter(p => p.status === 'pending').length;

        // Render proposals list
        const container = document.getElementById('my-proposals-list');
        if (container) {
            if (proposals.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12 text-charcoal-700">
                        <i class="fas fa-paper-plane text-4xl mb-3 block opacity-40"></i>
                        <p class="font-medium">No proposals submitted yet</p>
                        <a href="/" class="text-crimson-400 hover:text-crimson-300 text-sm mt-2 inline-block">Browse open jobs →</a>
                    </div>
                `;
            } else {
                container.innerHTML = proposals.map(p => `
                    <div class="bg-charcoal-900/50 border border-charcoal-800 rounded-xl p-5 flex items-center justify-between hover:border-crimson-500/30 transition-colors">
                        <div class="flex-1">
                            <h4 class="text-white font-semibold text-sm mb-1">${p.job?.title || 'Untitled Job'}</h4>
                            <div class="flex items-center gap-3 text-xs text-warmwhite/50">
                                <span>${p.job?.company || ''}</span>
                                <span>•</span>
                                <span>Bid: ₹${p.bidAmount}</span>
                                <span>•</span>
                                <span>${new Date(p.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <span class="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${
                            p.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            p.status === 'rejected' ? 'bg-crimson-500/10 text-crimson-400 border border-crimson-500/20' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }">${p.status}</span>
                    </div>
                `).join('');
            }
        }
    } catch (err) {
        console.error('Load freelancer dashboard error:', err);
    }
}
