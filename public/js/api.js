// ============================================================
// API Client — Centralized fetch() wrapper with auth headers
// ============================================================

const API_BASE = '/api';

const api = {
    // Get token from localStorage
    getToken() {
        return localStorage.getItem('fh_token');
    },

    // Get current user from localStorage
    getUser() {
        const user = localStorage.getItem('fh_user');
        return user ? JSON.parse(user) : null;
    },

    // Save auth data
    saveAuth(token, user) {
        localStorage.setItem('fh_token', token);
        localStorage.setItem('fh_user', JSON.stringify(user));
    },

    // Clear auth data
    clearAuth() {
        localStorage.removeItem('fh_token');
        localStorage.removeItem('fh_user');
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!this.getToken();
    },

    // Build headers
    _headers(withAuth = false) {
        const headers = { 'Content-Type': 'application/json' };
        if (withAuth) {
            const token = this.getToken();
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    // Generic request method
    async _request(method, endpoint, body = null, withAuth = false) {
        const config = {
            method,
            headers: this._headers(withAuth)
        };

        if (body && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(body);
        }

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, config);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.errors?.[0]?.msg || 'Request failed');
            }

            return data;
        } catch (err) {
            console.error(`API ${method} ${endpoint} error:`, err);
            throw err;
        }
    },

    // Convenience methods
    get(endpoint, withAuth = false) {
        return this._request('GET', endpoint, null, withAuth);
    },

    post(endpoint, body, withAuth = false) {
        return this._request('POST', endpoint, body, withAuth);
    },

    put(endpoint, body, withAuth = true) {
        return this._request('PUT', endpoint, body, withAuth);
    },

    delete(endpoint, withAuth = true) {
        return this._request('DELETE', endpoint, null, withAuth);
    },

    // ── Auth API ──────────────────────────────────────────────
    async register(userData) {
        const data = await this.post('/auth/register', userData);
        if (data.success) {
            this.saveAuth(data.token, data.data);
        }
        return data;
    },

    async login(email, password) {
        const data = await this.post('/auth/login', { email, password });
        if (data.success) {
            this.saveAuth(data.token, data.data);
        }
        return data;
    },

    async googleLogin(credential, role = 'freelancer') {
        const data = await this.post('/auth/google', { credential, role });
        if (data.success) {
            this.saveAuth(data.token, data.data);
        }
        return data;
    },

    async getMe() {
        return this.get('/auth/me', true);
    },

    logout() {
        this.clearAuth();
        window.location.href = '/';
    },

    // ── Jobs API ──────────────────────────────────────────────
    async getJobs(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.get(`/jobs${query ? '?' + query : ''}`);
    },

    async getJob(id) {
        return this.get(`/jobs/${id}`);
    },

    async createJob(jobData) {
        return this.post('/jobs', jobData, true);
    },

    async updateJob(id, jobData) {
        return this.put(`/jobs/${id}`, jobData);
    },

    async deleteJob(id) {
        return this.delete(`/jobs/${id}`);
    },

    // ── Freelancers API ───────────────────────────────────────
    async getFreelancers(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.get(`/freelancers${query ? '?' + query : ''}`);
    },

    async getFreelancer(id) {
        return this.get(`/freelancers/${id}`);
    },

    // ── Proposals API ─────────────────────────────────────────
    async submitProposal(proposalData) {
        return this.post('/proposals', proposalData, true);
    },

    async getJobProposals(jobId) {
        return this.get(`/proposals/job/${jobId}`, true);
    },

    async getMyProposals() {
        return this.get('/proposals/my', true);
    },

    async updateProposalStatus(id, status) {
        return this.put(`/proposals/${id}/status`, { status });
    },

    // ── Reviews API ───────────────────────────────────────────
    async getReviews() {
        return this.get('/reviews');
    },

    async submitReview(reviewData) {
        return this.post('/reviews', reviewData, true);
    }
};
