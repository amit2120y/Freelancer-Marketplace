// ============================================================
// FreelanceHub — Main App Logic (API-Driven)
// Classic Red Palette: charcoal / crimson / warmwhite
// ============================================================

// Static category data (not stored in DB — cosmetic only)
const categories = [
    { name: "Development",         icon: "fa-code",                 color: "#C41E1E", jobs: "1,420+", desc: "React, Next.js, Node.js & Full-stack" },
    { name: "AI & Data Science",   icon: "fa-brain",                color: "#8B1414", jobs: "850+",   desc: "PyTorch, LLMs, Computer Vision" },
    { name: "UI/UX Design",        icon: "fa-pen-nib",              color: "#E83232", jobs: "920+",   desc: "Figma Design Systems & Web Flow" },
    { name: "Mobile Development",  icon: "fa-mobile-screen-button", color: "#10B981", jobs: "640+",   desc: "Flutter, Swift & React Native" },
    { name: "DevOps & Cloud",      icon: "fa-cloud-bolt",           color: "#F59E0B", jobs: "430+",   desc: "AWS, Kubernetes & CI/CD Pipelines" },
    { name: "Marketing & Growth",  icon: "fa-chart-line",           color: "#A91818", jobs: "780+",   desc: "SEO, Performance & Content Strategy" }
];

// ============================================================
// RENDER FUNCTIONS
// ============================================================

function renderCategories(items) {
    return items.map(c => `
        <div class="modern-card p-6 cursor-pointer group hover:border-crimson-500/40">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110" style="background: ${c.color}18; color: ${c.color};">
                <i class="fas ${c.icon} text-xl"></i>
            </div>
            <h3 class="font-bold text-charcoal-950 text-base mb-1 group-hover:text-crimson-500 transition-colors">${c.name}</h3>
            <p class="text-charcoal-700 text-xs mb-3 leading-relaxed">${c.desc}</p>
            <span class="inline-flex items-center text-xs font-semibold text-crimson-500">
                ${c.jobs} open jobs <i class="fas fa-arrow-right text-[10px] ml-1.5 transition-transform group-hover:translate-x-1"></i>
            </span>
        </div>
    `).join("");
}

function renderJobs(items) {
    return items.map(j => `
        <div class="modern-card p-6 flex flex-col justify-between relative ${j.featured ? 'border-crimson-300/40 ring-1 ring-crimson-500/10' : ''}">
            <div>
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <img src="${j.logo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(j.company) + '&background=C41E1E&color=fff'}" alt="${j.company}" class="w-11 h-11 rounded-xl object-cover border border-warmwhite shadow-sm" />
                        <div>
                            <h4 class="font-semibold text-charcoal-950 text-sm">${j.company}</h4>
                            <p class="text-charcoal-700 text-xs flex items-center gap-1.5 mt-0.5">
                                <span><i class="far fa-clock text-[10px]"></i> ${j.posted || 'Recently'}</span>
                                <span>•</span>
                                <span><i class="fas fa-globe text-[10px]"></i> ${j.location}</span>
                            </p>
                        </div>
                    </div>
                    ${j.featured ? '<span class="pill-badge pill-primary"><i class="fas fa-sparkles mr-1 text-[10px]"></i> Featured</span>' : '<span class="text-xs text-charcoal-700">' + (j.proposals || 0) + ' bids</span>'}
                </div>

                <h3 class="font-bold text-charcoal-950 text-base mb-3 hover:text-crimson-500 cursor-pointer transition-colors leading-snug">
                    ${j.title}
                </h3>

                <div class="flex flex-wrap gap-1.5 mb-6">
                    ${(j.skills || []).map(s => `<span class="skill-tag">${s}</span>`).join("")}
                </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-warmwhite mt-2">
                <div>
                    <span class="text-xs text-charcoal-700 block font-medium">Budget</span>
                    <span class="text-base font-bold text-charcoal-950">${j.budget}</span>
                </div>
                <button class="bg-charcoal-950 hover:bg-crimson-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors" data-action="apply-job" data-id="${j._id}">
                    Apply Now
                </button>
            </div>
        </div>
    `).join("");
}

function renderFreelancers(items) {
    return items.map(f => `
        <div class="modern-card p-6 flex flex-col justify-between text-center relative group">
            <div>
                <div class="relative w-20 h-20 mx-auto mb-4">
                    <img src="${f.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(f.name) + '&background=C41E1E&color=fff'}" alt="${f.name}" class="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white group-hover:scale-105 transition-transform duration-300" />
                    ${f.verified ? '<span class="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white" title="Verified Expert"><i class="fas fa-check"></i></span>' : ''}
                </div>

                ${f.badge ? `<div class="inline-flex items-center gap-1 bg-crimson-500/10 text-crimson-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2 border border-crimson-500/20">
                    <i class="fas fa-award text-[10px]"></i> ${f.badge}
                </div>` : ''}

                <h3 class="font-bold text-charcoal-950 text-lg group-hover:text-crimson-500 transition-colors">${f.name}</h3>
                <p class="text-charcoal-700 text-xs font-medium mb-3 line-clamp-1">${f.title || ''}</p>

                <div class="flex items-center justify-center space-x-3 text-xs text-charcoal-800 mb-4 bg-warmwhite py-2 rounded-xl border border-warmwhite">
                    <span class="font-semibold text-amber-500"><i class="fas fa-star text-xs"></i> ${f.rating || 0}</span>
                    <span class="text-charcoal-700">•</span>
                    <span class="font-medium">${f.jobsDone || 0} jobs</span>
                    <span class="text-charcoal-700">•</span>
                    <span class="font-semibold text-charcoal-950">₹${f.hourlyRate || 0}/hr</span>
                </div>

                <div class="flex flex-wrap justify-center gap-1.5 mb-6">
                    ${(f.skills || []).slice(0, 3).map(s => `<span class="skill-tag">${s}</span>`).join("")}
                    ${(f.skills || []).length > 3 ? `<span class="skill-tag bg-warmwhite">+${f.skills.length - 3}</span>` : ''}
                </div>
            </div>

            <div class="pt-4 border-t border-warmwhite flex gap-2">
                <button class="w-full bg-warmwhite hover:bg-rosegray/30 text-charcoal-950 text-xs font-semibold py-2.5 rounded-lg transition-colors border border-warmwhite" data-action="view-profile" data-id="${f._id}">
                    Profile
                </button>
                <button class="w-full bg-crimson-500 hover:bg-crimson-400 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-sm shadow-crimson-500/30" data-action="hire" data-id="${f._id}" data-name="${f.name}">
                    Hire
                </button>
            </div>
        </div>
    `).join("");
}

function renderTestimonials(items) {
    return items.map(t => `
        <div class="bg-white rounded-2xl p-8 border border-warmwhite shadow-sm flex flex-col justify-between hover:border-crimson-300/40 hover:shadow-md transition-all duration-300">
            <div>
                <div class="flex items-center space-x-1 mb-4 text-amber-400 text-xs">
                    ${Array.from({ length: t.rating || 5 }, () => '<i class="fas fa-star"></i>').join("")}
                </div>
                <p class="text-charcoal-800 text-sm leading-relaxed mb-6 font-normal">"${t.quote}"</p>
            </div>
            <div class="flex items-center space-x-3.5 pt-4 border-t border-warmwhite">
                <img src="${t.avatar || ''}" alt="${t.name}" class="w-11 h-11 rounded-full object-cover border border-warmwhite" />
                <div>
                    <h4 class="font-bold text-charcoal-950 text-sm">${t.name}</h4>
                    <p class="text-charcoal-700 text-xs">${t.role}</p>
                </div>
            </div>
        </div>
    `).join("");
}

// ============================================================
// AUTH-AWARE NAVBAR
// ============================================================

function updateNavbar() {
    const desktopActions = document.querySelector('.nav-actions-desktop');
    const mobileActions = document.querySelector('.nav-actions-mobile');

    if (!desktopActions) return;

    if (api.isLoggedIn()) {
        const user = api.getUser();
        desktopActions.innerHTML = `
            <a href="/dashboard.html" class="text-sm font-semibold text-warmwhite/70 hover:text-white transition-colors px-3 py-2">
                <i class="fas fa-th-large mr-1"></i> Dashboard
            </a>
            <div class="flex items-center space-x-2 cursor-pointer group" id="nav-user-menu">
                <img src="${user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=C41E1E&color=fff'}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover border-2 border-crimson-500/50 group-hover:border-crimson-400 transition-colors" />
                <span class="text-sm font-semibold text-warmwhite/70 group-hover:text-white transition-colors">${user.name.split(' ')[0]}</span>
            </div>
            <button id="nav-logout-btn" class="text-sm text-warmwhite/40 hover:text-crimson-400 transition-colors px-2 py-2" title="Log out">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        `;

        if (mobileActions) {
            mobileActions.innerHTML = `
                <a href="/dashboard.html" class="text-warmwhite/70 hover:text-white py-2 font-semibold block">Dashboard</a>
                <button class="text-crimson-400 hover:text-crimson-300 py-2 font-semibold block w-full mobile-logout-btn">Log Out</button>
            `;
        }

        // Logout handler
        setTimeout(() => {
            document.getElementById('nav-logout-btn')?.addEventListener('click', () => api.logout());
            document.querySelector('.mobile-logout-btn')?.addEventListener('click', () => api.logout());
        }, 0);
    } else {
        desktopActions.innerHTML = `
            <a href="/login.html" class="text-sm font-semibold text-warmwhite/70 hover:text-white transition-colors px-3 py-2">Log In</a>
            <a href="/register.html" class="bg-crimson-500 hover:bg-crimson-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-crimson-500/30 hover:shadow-crimson-500/50">Get Started</a>
        `;

        if (mobileActions) {
            mobileActions.innerHTML = `
                <a href="/login.html" class="text-warmwhite/70 hover:text-white py-2 font-semibold block">Log In</a>
                <a href="/register.html" class="bg-crimson-500 text-white py-3 rounded-xl font-bold shadow-md block text-center">Get Started</a>
            `;
        }
    }
}

// ============================================================
// DATA LOADING FROM API
// ============================================================

async function loadJobs() {
    try {
        const res = await api.getJobs();
        const jobGrid = document.getElementById("job-grid");
        if (jobGrid && res.data) {
            jobGrid.innerHTML = renderJobs(res.data);
        }
    } catch (err) {
        console.error('Failed to load jobs:', err);
    }
}

async function loadFreelancers() {
    try {
        const res = await api.getFreelancers();
        const freelancerGrid = document.getElementById("freelancer-grid");
        if (freelancerGrid && res.data) {
            freelancerGrid.innerHTML = renderFreelancers(res.data);
        }
    } catch (err) {
        console.error('Failed to load freelancers:', err);
    }
}

async function loadReviews() {
    try {
        const res = await api.getReviews();
        const testimonialGrid = document.getElementById("testimonial-grid");
        if (testimonialGrid && res.data) {
            testimonialGrid.innerHTML = renderTestimonials(res.data);
        }
    } catch (err) {
        console.error('Failed to load reviews:', err);
    }
}

// ============================================================
// MOUNT & INITIALIZATION
// ============================================================

async function initApp() {
    // Render static categories
    const categoryGrid = document.getElementById("category-grid");
    if (categoryGrid) categoryGrid.innerHTML = renderCategories(categories);

    // Load dynamic data from API
    await Promise.all([loadJobs(), loadFreelancers(), loadReviews()]);

    // Update navbar based on auth state
    updateNavbar();

    // Init interactive features
    initMobileMenu();
    initScrollReveal();
    initCounterAnimation();
    initSearch();

    console.log("⚡ FreelanceHub Loaded Successfully (API-Driven)");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}

// ============================================================
// INTERACTIVE EVENT HANDLERS & TOAST SYSTEM
// ============================================================

document.addEventListener("click", function (e) {
    // Smooth scrolling
    const link = e.target.closest("a[href^='#']");
    if (link) {
        const href = link.getAttribute("href");
        if (href && href !== "#") {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
                closeMobileMenu();
            }
        }
    }

    // Action handlers
    const actionEl = e.target.closest("[data-action]");
    if (actionEl) {
        e.preventDefault();
        const action = actionEl.getAttribute("data-action");
        const id = actionEl.getAttribute("data-id");

        switch (action) {
            case "login":
                window.location.href = '/login.html';
                break;
            case "signup":
                window.location.href = '/register.html';
                break;
            case "post-job":
                if (api.isLoggedIn()) {
                    window.location.href = '/post-job.html';
                } else {
                    showToast("🔐", "Login Required", "Please log in as a client to post a job.");
                    setTimeout(() => window.location.href = '/login.html', 1500);
                }
                break;
            case "apply-job":
                if (api.isLoggedIn()) {
                    handleApplyJob(id);
                } else {
                    showToast("🔐", "Login Required", "Please log in as a freelancer to apply.");
                    setTimeout(() => window.location.href = '/login.html', 1500);
                }
                break;
            case "view-profile":
                showToast("👤", "Profile", "Loading freelancer profile...");
                break;
            case "hire":
                if (api.isLoggedIn()) {
                    const name = actionEl.getAttribute("data-name") || 'this freelancer';
                    showToast("🤝", "Direct Offer", `Opening contract terms for ${name}...`);
                } else {
                    showToast("🔐", "Login Required", "Please log in to hire talent.");
                    setTimeout(() => window.location.href = '/login.html', 1500);
                }
                break;
            default:
                showToast("⚡", "FreelanceHub", "Feature coming soon!");
        }
    }
});

async function handleApplyJob(jobId) {
    const user = api.getUser();
    if (user.role !== 'freelancer') {
        showToast("⚠️", "Wrong Account", "Only freelancer accounts can submit proposals.");
        return;
    }

    const coverLetter = prompt("Enter your cover letter for this proposal:");
    if (!coverLetter) return;

    const bidAmount = prompt("Enter your bid amount (₹):");
    if (!bidAmount || isNaN(bidAmount)) {
        showToast("⚠️", "Invalid Bid", "Please enter a valid number.");
        return;
    }

    try {
        await api.submitProposal({
            job: jobId,
            coverLetter,
            bidAmount: Number(bidAmount)
        });
        showToast("✅", "Proposal Sent!", "Your proposal has been submitted successfully.");
        // Reload jobs to update proposal count
        await loadJobs();
    } catch (err) {
        showToast("❌", "Error", err.message || "Failed to submit proposal.");
    }
}

function showToast(icon, title, message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast-enter bg-charcoal-950 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-charcoal-800 flex items-center space-x-3.5 min-w-[280px] max-w-md";
    toast.innerHTML = `
        <span class="text-xl">${icon}</span>
        <div class="flex-1">
            <p class="font-bold text-xs text-white">${title}</p>
            <p class="text-warmwhite/50 text-[11px] mt-0.5">${message}</p>
        </div>
        <button class="text-warmwhite/40 hover:text-white text-xs" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(10px)";
            toast.style.transition = "all 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }
    }, 3500);
}

// ============================================================
// MOBILE MENU & UTILITIES
// ============================================================

function closeMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    if (menu) menu.classList.add("hidden");
}

function initMobileMenu() {
    const btn = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");
    if (btn && menu) {
        btn.addEventListener("click", () => {
            menu.classList.toggle("hidden");
        });
    }
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

function initCounterAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute("data-target"));
                animateVal(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll(".count-up").forEach(el => observer.observe(el));
}

function animateVal(el, target) {
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current.toLocaleString();
    }, 30);
}

function initSearch() {
    const btn = document.getElementById("search-btn");
    const input = document.getElementById("hero-search");
    if (btn && input) {
        const doSearch = async () => {
            const val = input.value.trim();
            if (val) {
                showToast("🔍", "Searching...", `Finding listings for "${val}"`);
                try {
                    const res = await api.getJobs({ search: val });
                    const jobGrid = document.getElementById("job-grid");
                    if (jobGrid && res.data) {
                        jobGrid.innerHTML = renderJobs(res.data);
                        if (res.data.length === 0) {
                            jobGrid.innerHTML = `<div class="col-span-full text-center py-12 text-charcoal-700">
                                <i class="fas fa-search text-4xl mb-3 block opacity-40"></i>
                                <p class="font-medium">No jobs found for "${val}"</p>
                                <button class="text-crimson-500 hover:text-crimson-400 text-sm mt-2" onclick="loadJobs()">Show all jobs</button>
                            </div>`;
                        }
                        // Scroll to jobs section
                        document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
                    }
                } catch (err) {
                    showToast("❌", "Search Error", err.message);
                }
            } else {
                showToast("💡", "Search Tip", "Type a tech skill, role, or category name.");
            }
        };
        btn.addEventListener("click", doSearch);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") doSearch();
        });
    }
}
