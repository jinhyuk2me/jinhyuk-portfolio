/**
 * Portfolio Data Loader
 * Dynamically loads and renders portfolio content from JSON files
 */

class PortfolioLoader {
    constructor() {
        this.data = {};
    }

    /**
     * Fetch JSON data from a file
     */
    async fetchData(filename) {
        try {
            const response = await fetch(`data/${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return null;
        }
    }

    /**
     * Load all data files
     */
    async loadAllData() {
        const files = [
            'profile.json',
            'about.json',
            'education.json',
            'tech-stack.json',
            'experience.json',
            'projects.json',
            'contact.json'
        ];

        const results = await Promise.all(files.map(file => this.fetchData(file)));

        this.data = {
            profile: results[0],
            about: results[1],
            education: results[2],
            techStack: results[3],
            experience: results[4],
            projects: results[5],
            contact: results[6]
        };

        return this.data;
    }

    /**
     * Render Hero Section
     */
    renderHero() {
        const { profile } = this.data;
        if (!profile) return;

        // Update greeting with typewriter effect
        const greetingEl = document.querySelector('.hero-greeting .typewriter');
        if (greetingEl) greetingEl.textContent = profile.greeting;

        // Update name
        const titleEl = document.querySelector('.hero-title');
        if (titleEl) titleEl.textContent = profile.name;

        // Update subtitle with highlights
        const subtitleEl = document.querySelector('.hero-subtitle');
        if (subtitleEl) {
            const text = profile.subtitle.text
                .replace('{actions}', `<span class="text-amber">${profile.subtitle.highlights.actions}</span>`)
                .replace('{perception}', `<span class="text-cyan">${profile.subtitle.highlights.perception}</span>`);
            subtitleEl.innerHTML = text;
        }

        // Update description
        const descEl = document.querySelector('.hero-desc');
        if (descEl) descEl.textContent = profile.description;

        // Update CTA button
        const ctaEl = document.querySelector('.hero-actions .btn-primary');
        if (ctaEl) {
            ctaEl.textContent = profile.cta.text;
            ctaEl.href = profile.cta.link;
        }

        // Update profile image
        const imgEl = document.querySelector('.hero-profile-img');
        if (imgEl) {
            imgEl.src = profile.profileImage;
            imgEl.alt = profile.name;
        }

        // Update social links
        const socialContainer = document.querySelector('.hero-social');
        if (socialContainer && profile.social) {
            socialContainer.innerHTML = profile.social.map(link => `
                <a href="${link.url}" target="_blank" title="${link.platform}">
                    <i class="${link.icon}"></i>
                </a>
            `).join('');
        }
    }

    /**
     * Render About Section
     */
    renderAbout() {
        const { about } = this.data;
        if (!about) return;

        const aboutText = document.querySelector('.about-text p');
        if (aboutText) aboutText.textContent = about.description;
    }

    /**
     * Render Education Section
     */
    renderEducation() {
        const { education } = this.data;
        if (!education) return;

        const educationGrid = document.querySelector('.education-grid');
        if (!educationGrid) return;

        educationGrid.innerHTML = education.map(edu => `
            <div class="edu-item">
                <img src="${edu.logo}" alt="${edu.school}" class="edu-logo">
                <div class="edu-details">
                    <div class="edu-school">${edu.school}</div>
                    <div class="edu-degree">${edu.degree}</div>
                    <div class="edu-date">${edu.date}</div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render Tech Stack Section
     */
    renderTechStack() {
        const { techStack } = this.data;
        if (!techStack) return;

        const techTags = document.querySelector('.tech-tags');
        if (!techTags) return;

        techTags.innerHTML = techStack.map(tech =>
            `<span class="tech-tag">${tech}</span>`
        ).join('');
    }

    /**
     * Render Experience Section
     */
    renderExperience() {
        const { experience } = this.data;
        if (!experience) return;

        const experienceList = document.querySelector('.experience-list');
        if (!experienceList) return;

        experienceList.innerHTML = experience.map(exp => `
            <div class="experience-item">
                <div class="experience-header">
                    <h3 class="company-name">${exp.company}</h3>
                </div>
                <div class="job-role">
                    <div class="job-meta">
                        <span class="job-title">${exp.position}</span>
                        <span class="job-date">${exp.date}</span>
                    </div>
                    <div class="job-desc">
                        <ul>
                            ${exp.achievements.map(achievement =>
            `<li>${achievement}</li>`
        ).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render Projects Section
     */
    renderProjects() {
        const { projects } = this.data;
        if (!projects) return;

        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = projects.map(project => `
            <a href="${project.github}" class="project-card-link">
                <div class="project-card">
                    <img src="${project.image}" alt="${project.title}" class="project-image">
                    <div class="project-content">
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-desc">${project.description}</p>
                        <div class="project-tags">
                            ${project.tags.map(tag =>
            `<span class="project-tag">${tag}</span>`
        ).join('')}
                        </div>
                    </div>
                </div>
            </a>
        `).join('');
    }

    /**
     * Render Contact Section
     */
    renderContact() {
        const { contact } = this.data;
        if (!contact) return;

        const titleEl = document.querySelector('.contact-section .section-title');
        if (titleEl) titleEl.textContent = contact.title;

        const descEl = document.querySelector('.contact-text');
        if (descEl) descEl.textContent = contact.description;

        const btnEl = document.querySelector('.contact-section .btn-primary');
        if (btnEl) {
            btnEl.textContent = contact.buttonText;
            btnEl.href = `mailto:${contact.email}`;
        }
    }

    /**
     * Initialize all sections
     */
    async init() {
        try {
            // Load all data
            await this.loadAllData();

            // Render all sections
            this.renderHero();
            this.renderAbout();
            this.renderEducation();
            this.renderTechStack();
            this.renderExperience();
            this.renderProjects();
            this.renderContact();

            console.log('Portfolio loaded successfully!');
        } catch (error) {
            console.error('Error initializing portfolio:', error);
        }
    }
}

// Initialize portfolio when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new PortfolioLoader();
    portfolio.init();
});
