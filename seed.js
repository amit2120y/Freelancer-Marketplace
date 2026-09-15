const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./server/models/User');
const Job = require('./server/models/Job');
const Review = require('./server/models/Review');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding');

        // Clear existing data
        await User.deleteMany({});
        await Job.deleteMany({});
        await Review.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // ── Create Demo Users ──────────────────────────────────────
        const demoClient = await User.create({
            name: 'Aarav Sharma',
            email: 'aarav@demo.com',
            password: 'password123',
            role: 'client',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            title: 'Founder & CEO at TechNova India',
            location: 'Bengaluru, Karnataka'
        });

        const freelancers = await User.create([
            {
                name: 'Priya Patel',
                email: 'priya@demo.com',
                password: 'password123',
                role: 'freelancer',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
                title: 'Senior Full-Stack Engineer & Ex-Flipkart Developer',
                skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
                hourlyRate: 1800,
                location: 'Bengaluru, Karnataka',
                bio: 'Ex-Flipkart developer with 8+ years building high-performance web applications. Specialized in React, TypeScript, and cloud architecture.',
                verified: true,
                badge: 'Top Rated Plus',
                rating: 4.99,
                jobsDone: 84,
                totalEarned: '₹28 Lakhs+'
            },
            {
                name: 'Rohan Mehta',
                email: 'rohan@demo.com',
                password: 'password123',
                role: 'freelancer',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                title: 'Principal UI/UX Designer & Product Strategist',
                skills: ['Design Systems', 'Figma', 'User Research', 'Webflow'],
                hourlyRate: 1500,
                location: 'Mumbai, Maharashtra',
                bio: 'Award-winning designer crafting intuitive interfaces for SaaS, fintech, and healthtech products across leading Indian startups.',
                verified: true,
                badge: 'Expert Vetted',
                rating: 4.97,
                jobsDone: 62,
                totalEarned: '₹22 Lakhs+'
            },
            {
                name: 'Ananya Verma',
                email: 'ananya@demo.com',
                password: 'password123',
                role: 'freelancer',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                title: 'AI Specialist & Machine Learning Researcher',
                skills: ['Python', 'PyTorch', 'LLMs', 'NLP', 'OpenAI API'],
                hourlyRate: 2500,
                location: 'Gurugram, Haryana',
                bio: 'MTech from IIT Delhi. AI researcher specializing in LLMs, RAG pipelines, and production AI systems for enterprise fintech.',
                verified: true,
                badge: 'Top Rated Plus',
                rating: 5.00,
                jobsDone: 41,
                totalEarned: '₹35 Lakhs+'
            },
            {
                name: 'Vikram Malhotra',
                email: 'vikram@demo.com',
                password: 'password123',
                role: 'freelancer',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
                title: 'Mobile App Lead (iOS & Cross-Platform)',
                skills: ['Flutter', 'Swift', 'React Native', 'Firebase'],
                hourlyRate: 1600,
                location: 'Hyderabad, Telangana',
                bio: 'Mobile architect with 95+ apps shipped across iOS and Android. Specialized in Flutter, Swift, and scalable mobile backends.',
                verified: true,
                badge: 'Top Rated',
                rating: 4.95,
                jobsDone: 95,
                totalEarned: '₹26 Lakhs+'
            }
        ]);

        console.log(`👤 Created ${freelancers.length + 1} demo users`);

        // ── Create Demo Jobs ───────────────────────────────────────
        const jobsData = [
            {
                title: 'Senior Full-Stack Architect (Next.js & GraphQL)',
                company: 'TechNova India',
                logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
                budget: '₹2,50,000 - ₹4,00,000',
                type: 'Contract',
                location: 'Bengaluru (Remote)',
                category: 'Development',
                skills: ['Next.js 14', 'TypeScript', 'GraphQL', 'Tailwind CSS'],
                description: 'We are looking for a senior full-stack architect to lead the development of our next-generation analytics platform. You will design and implement scalable APIs, real-time data pipelines, and modern React-based dashboards.',
                featured: true,
                postedBy: demoClient._id,
                proposals: 14
            },
            {
                title: 'Lead Product Designer — SaaS Dashboard',
                company: 'Swiggy Labs',
                logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80',
                budget: '₹1,80,000 - ₹3,00,000',
                type: 'Fixed Price',
                location: 'Mumbai (Remote)',
                category: 'UI/UX Design',
                skills: ['Figma', 'Design Systems', 'Prototyping', 'UX Research'],
                description: 'Design a complete SaaS dashboard experience including data visualization, user onboarding flows, and a scalable design system in Figma.',
                featured: false,
                postedBy: demoClient._id,
                proposals: 8
            },
            {
                title: 'AI Fine-Tuning & RAG Pipeline Engineer',
                company: 'Razorpay AI Lab',
                logo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=120&q=80',
                budget: '₹4,00,000 - ₹6,50,000',
                type: 'Milestone',
                location: 'Gurugram (Remote)',
                category: 'AI & Data Science',
                skills: ['Python', 'LangChain', 'Pinecone', 'PyTorch'],
                description: 'Build and optimize a RAG pipeline for enterprise financial document processing. Includes fine-tuning open-source LLMs, vector database integration, and evaluation benchmarks.',
                featured: true,
                postedBy: demoClient._id,
                proposals: 19
            },
            {
                title: 'Cross-Platform Mobile App (Flutter / Supabase)',
                company: 'Zomato HealthTech',
                logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=120&q=80',
                budget: '₹2,00,000 - ₹3,50,000',
                type: 'Fixed Price',
                location: 'Hyderabad (Remote)',
                category: 'Mobile Development',
                skills: ['Flutter', 'Dart', 'Supabase', 'REST API'],
                description: 'Develop a cross-platform health tracking app with real-time sync, push notifications, and Supabase backend integration.',
                featured: false,
                postedBy: demoClient._id,
                proposals: 11
            },
            {
                title: 'Kubernetes Infrastructure & Terraform Automation',
                company: 'Infosys DevOps Systems',
                logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=120&q=80',
                budget: '₹3,50,000 - ₹5,00,000',
                type: 'Contract',
                location: 'Pune (Remote)',
                category: 'DevOps & Cloud',
                skills: ['AWS', 'Terraform', 'Kubernetes', 'Docker'],
                description: 'Set up production-grade Kubernetes clusters on AWS with Terraform IaC, CI/CD pipelines, monitoring, and auto-scaling.',
                featured: false,
                postedBy: demoClient._id,
                proposals: 7
            },
            {
                title: 'B2B SaaS Growth Lead & Conversion Strategist',
                company: 'Freshworks Digital',
                logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80',
                budget: '₹1,20,000 - ₹2,00,000 / mo',
                type: 'Monthly Retainer',
                location: 'Chennai (Remote)',
                category: 'Marketing & Growth',
                skills: ['Funnel Optimization', 'SEO', 'Google Ads', 'HubSpot'],
                description: 'Drive growth for a B2B SaaS platform through conversion funnel optimization, paid acquisition, SEO strategy, and CRM automation.',
                featured: false,
                postedBy: demoClient._id,
                proposals: 22
            }
        ];

        const createdJobs = await Job.create(jobsData);
        console.log(`💼 Created ${createdJobs.length} demo jobs`);

        // ── Create Demo Reviews ────────────────────────────────────
        const reviewsData = [
            {
                name: 'Dr. Kavya Nair',
                role: 'VP of Engineering at Ola Tech',
                avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
                quote: 'FreelanceHub connected us with an incredible Next.js architect in Bengaluru within 48 hours. The vetting process is top-notch and saved us weeks of hiring hassle.',
                rating: 5
            },
            {
                name: 'Rajesh Iyer',
                role: 'Co-Founder & CEO, Zepto Tech',
                avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
                quote: 'As a fast-growing Indian startup, we needed specialized AI engineers fast. Transparent Rupee milestone escrow and verified talent quality gave us total peace of mind.',
                rating: 5
            },
            {
                name: 'Sunita Menon',
                role: 'Head of Product at Paytm Labs',
                avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=150&q=80',
                quote: "I've hired top Indian freelancers across 5 tech hubs on FreelanceHub. The platform interface is seamless, clean, and completely reliable.",
                rating: 5
            }
        ];

        const createdReviews = await Review.create(reviewsData);
        console.log(`⭐ Created ${createdReviews.length} demo reviews`);

        console.log('\n🎉 Database seeded successfully with Indian data!');
        console.log('\n📧 Demo Accounts:');
        console.log('   Client:     aarav@demo.com     / password123');
        console.log('   Freelancer: priya@demo.com     / password123');
        console.log('   Freelancer: rohan@demo.com     / password123');
        console.log('   Freelancer: ananya@demo.com    / password123');
        console.log('   Freelancer: vikram@demo.com    / password123\n');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        process.exit(1);
    }
};

seedDB();
