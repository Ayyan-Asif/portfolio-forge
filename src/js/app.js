const PROFILE_KEY = 'portfolio_forge_profile';
const THEME_KEY = 'portfolio_forge_theme';

const DEMO = {
    name: 'Demo Creator',
    email: 'demo@portfolio.dev',
    password: 'Portfolio123!',
    bio: 'Student / creator turning ideas into practical projects.',
    school: 'Your School',
    college: 'Your College',
    currentStudy: 'Your Current Degree',
    nextGoal: 'Build and publish more real-world projects.',
    skills: ['HTML5', 'Tailwind CSS', 'JavaScript', 'Git'],
    projects: [
        {
            id: 'demo-project-1',
            title: 'Portfolio Website',
            status: 'completed',
            description:
                'A responsive portfolio built with HTML, Tailwind CSS and JavaScript.',
            tech: ['HTML5', 'Tailwind CSS', 'JavaScript']
        },
        {
            id: 'demo-project-2',
            title: 'AI Mini Project',
            status: 'progress',
            description:
                'An ongoing project where I am applying machine learning concepts.',
            tech: ['Python', 'AI', 'Git']
        },
        {
            id: 'demo-project-3',
            title: 'Next Idea',
            status: 'idea',
            description:
                'A future experiment I want to turn into a complete portfolio project.',
            tech: ['AI', 'Design']
        }
    ],
    photo: '../../assets/avatar-placeholder.svg'
};


/* =====================================================
   LOCAL STORAGE AND PROFILE MANAGEMENT
===================================================== */

function getProfile() {
    try {
        return JSON.parse(
            localStorage.getItem(PROFILE_KEY) || 'null'
        );
    } catch (error) {
        console.error('Unable to read saved profile:', error);
        return null;
    }
}


function normalizeProfile(profile) {
    if (!profile) return null;

    if (!Array.isArray(profile.skills)) {
        profile.skills = [];
    }

    if (!Array.isArray(profile.projects)) {
        const completed = Math.max(
            0,
            Number(profile.completed) || 0
        );

        const progress = Math.max(
            0,
            Number(profile.inProgress) || 0
        );

        profile.projects = [];

        for (let i = 0; i < completed; i++) {
            profile.projects.push({
                title: `Completed Project ${i + 1}`,
                status: 'completed',
                description: 'Add a description for this project.',
                tech: []
            });
        }

        for (let i = 0; i < progress; i++) {
            profile.projects.push({
                title: `Project in Progress ${i + 1}`,
                status: 'progress',
                description: 'Add what you are currently building.',
                tech: []
            });
        }
    }

    /*
     * Ensure every project has a unique identifier.
     * Existing projects without IDs receive one automatically.
     */
    profile.projects = profile.projects.map(project => ({
        ...project,
        id: project.id || crypto.randomUUID(),
        title: project.title || 'Untitled Project',
        status: [
            'completed',
            'progress',
            'idea'
        ].includes(project.status)
            ? project.status
            : 'completed',
        description: project.description || '',
        tech: Array.isArray(project.tech)
            ? project.tech
            : []
    }));

    profile.completed = profile.projects.filter(
        project => project.status === 'completed'
    ).length;

    profile.inProgress = profile.projects.filter(
        project => project.status === 'progress'
    ).length;

    if (!profile.nextGoal) {
        profile.nextGoal =
            'Add your next learning or career goal.';
    }

    return profile;
}


function setProfile(profile) {
    localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(normalizeProfile(profile))
    );
}


function deleteProfile() {
    localStorage.removeItem(PROFILE_KEY);
}


/* =====================================================
   GENERAL UTILITIES
===================================================== */

function esc(value) {
    const element = document.createElement('div');

    element.textContent = value ?? '';

    return element.innerHTML;
}


function page() {
    return document.body.dataset.page || '';
}


function path(name) {
    return page() === 'home'
        ? `src/pages/${name}.html`
        : `../pages/${name}.html`;
}


function home() {
    return page() === 'home'
        ? 'index.html'
        : '../../index.html';
}


function avatarPath() {
    return page() === 'home'
        ? 'assets/avatar-placeholder.svg'
        : '../../assets/avatar-placeholder.svg';
}


function toast(message) {
    const element = document.createElement('div');

    element.className = 'toast';
    element.textContent = message;

    document.body.appendChild(element);

    setTimeout(() => element.remove(), 2500);
}


function showStatus(id, message, type = '') {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = message;
        element.className = `form-status ${type}`;
    }
}


/* =====================================================
   THEME
===================================================== */

function themeApply(theme) {
    document.body.classList.toggle(
        'dark',
        theme === 'dark'
    );

    const button = document.getElementById('themeToggle');

    if (button) {
        button.textContent = theme === 'dark' ? '☀' : '☾';

        button.title = theme === 'dark'
            ? 'Switch to light mode'
            : 'Switch to dark mode';
    }
}


function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);

    const preferredTheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches
        ? 'dark'
        : 'light';

    themeApply(savedTheme || preferredTheme);

    document.getElementById('themeToggle')
        ?.addEventListener('click', () => {
            const newTheme =
                document.body.classList.contains('dark')
                    ? 'light'
                    : 'dark';

            localStorage.setItem(THEME_KEY, newTheme);

            themeApply(newTheme);
        });
}


/* =====================================================
   NAVIGATION
===================================================== */

function renderNav() {
    const element = document.getElementById('app-nav');

    if (!element) return;

    const currentPage = page();
    const profile = getProfile();

    const links = [
        ['index.html', 'Home', 'home'],
        ['about.html', 'About', 'about'],
        ['contact.html', 'Contact', 'contact'],
        ['signin.html', 'Sign In', 'signin'],
        ['signup.html', 'Sign Up', 'signup']
    ];

    element.innerHTML = `
        <div class="site-nav">
            <div class="nav-inner" id="navInner">

                <a class="brand" href="${home()}">
                    <span class="brand-mark">PF</span>

                    <span class="brand-copy">
                        PortfolioForge
                        <small>WEB TECHNOLOGIES</small>
                    </span>
                </a>

                <button
                    class="mobile-btn"
                    id="mobileBtn"
                    aria-label="Toggle navigation"
                >☰</button>

                <div class="nav-links">
                    ${links.map(([href, label, key]) => {
                        const link = key === 'home'
                            ? (
                                currentPage === 'home'
                                    ? 'index.html'
                                    : '../../index.html'
                            )
                            : (
                                currentPage === 'home'
                                    ? `src/pages/${href}`
                                    : `../pages/${href}`
                            );

                        return `
                            <a
                                href="${link}"
                                class="${
                                    currentPage === key
                                        ? 'active'
                                        : ''
                                }"
                            >${label}</a>
                        `;
                    }).join('')}
                </div>

                <div class="nav-actions">

                    <button
                        id="themeToggle"
                        class="theme-toggle"
                        aria-label="Toggle dark mode"
                    >☾</button>

                    ${
                        profile
                            ? `
                                <button
                                    class="btn btn-primary nav-cta"
                                    id="editProfileBtn"
                                >Edit Portfolio</button>
                            `
                            : `
                                <a
                                    class="btn btn-primary nav-cta"
                                    href="${path('signup')}"
                                >Build yours</a>
                            `
                    }

                </div>
            </div>
        </div>
    `;

    document.getElementById('mobileBtn')
        ?.addEventListener('click', () => {
            document.getElementById('navInner')
                .classList.toggle('nav-open');
        });

    document.getElementById('editProfileBtn')
        ?.addEventListener('click', openModal);
}


/* =====================================================
   FOOTER
===================================================== */

function renderFooter() {
    const element = document.getElementById('app-footer');

    if (!element) return;

    element.innerHTML = `
        <div class="site-footer">

            <div class="footer-grid">

                <div>
                    <div class="brand">
                        <span class="brand-mark">PF</span>

                        <span class="brand-copy text-white">
                            PortfolioForge
                            <small>FIVE-PAGE PROJECT</small>
                        </span>
                    </div>

                    <p class="mt-4 max-w-sm">
                        A bold student portfolio maker built with
                        HTML5, Tailwind CSS and JavaScript for
                        Web Technologies.
                    </p>

                    <div class="footer-social">
                        <a
                            class="social-btn"
                            href="https://github.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >GH</a>

                        <a
                            class="social-btn"
                            href="https://www.linkedin.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >in</a>

                        <a
                            class="social-btn"
                            href="mailto:hello@portfolioforge.dev"
                        >@</a>
                    </div>
                </div>

                <div>
                    <h3>Navigate</h3>

                    <a class="footer-link" href="${home()}">Home</a>
                    <a class="footer-link" href="${path('about')}">About</a>
                    <a class="footer-link" href="${path('contact')}">Contact</a>
                    <a class="footer-link" href="${path('signin')}">Sign In</a>
                    <a class="footer-link" href="${path('signup')}">Sign Up</a>
                </div>

                <div>
                    <h3>Contact</h3>

                    <a
                        class="footer-link"
                        href="mailto:hello@portfolioforge.dev"
                    >hello@portfolioforge.dev</a>

                    <a
                        class="footer-link"
                        href="tel:+923000000000"
                    >+92 300 000 0000</a>

                    <p>Lahore, Pakistan</p>
                </div>

            </div>

            <div class="footer-bottom">
                © 2026 PortfolioForge • Web Technologies Assignment
            </div>

        </div>
    `;
}


/* =====================================================
   PROJECT AND SKILL EDITOR
===================================================== */

function projectRow(project) {
    return `
        <div
            class="crud-row project-edit-row"
            data-id="${esc(project.id || '')}"
        >

            <div class="crud-main">

                <input
                    class="crud-title project-title"
                    value="${esc(project.title)}"
                    placeholder="Project title"
                    required
                >

                <select class="project-status-input">
                    <option
                        value="completed"
                        ${project.status === 'completed' ? 'selected' : ''}
                    >Completed</option>

                    <option
                        value="progress"
                        ${project.status === 'progress' ? 'selected' : ''}
                    >In progress</option>

                    <option
                        value="idea"
                        ${project.status === 'idea' ? 'selected' : ''}
                    >Next idea</option>
                </select>

                <textarea
                    class="project-description"
                    rows="2"
                    placeholder="What did you build?"
                >${esc(project.description)}</textarea>

                <input
                    class="project-tech"
                    value="${esc((project.tech || []).join(', '))}"
                    placeholder="Technologies: Python, SQL, Git"
                >

            </div>

            <button
                type="button"
                class="crud-delete delete-project"
                title="Delete project"
            >Delete</button>

        </div>
    `;
}


function skillRow(skill) {
    return `
        <div class="crud-row skill-edit-row">

            <input
                class="skill-input"
                value="${esc(skill)}"
                placeholder="Skill name"
            >

            <button
                type="button"
                class="crud-delete delete-skill"
            >Delete</button>

        </div>
    `;
}


/* =====================================================
   OPEN PROFILE EDITOR
===================================================== */

function openModal() {
    const profile = normalizeProfile(getProfile());

    if (!profile) return;

    let modal = document.getElementById('profileModal');

    if (!modal) {
        modal = document.createElement('div');

        modal.id = 'profileModal';
        modal.className = 'modal-backdrop';

        modal.innerHTML = `
            <section class="profile-modal profile-modal-large">

                <div class="profile-modal-head">

                    <div>
                        <span class="eyebrow">PORTFOLIO MAKER</span>

                        <h2>Edit your portfolio</h2>

                        <p class="modal-subtitle">
                            Add, edit or delete your projects,
                            skills and education.
                        </p>
                    </div>

                    <button class="close-btn" id="closeProfile">✕</button>

                </div>

                <div class="photo-row">

                    <img
                        id="photoPreview"
                        class="photo-preview"
                        alt="Profile photo preview"
                    >

                    <div>
                        <strong>Profile photo</strong>

                        <p class="text-xs text-slate-500 mt-1">
                            Upload a new image.
                        </p>

                        <input
                            id="profilePhoto"
                            type="file"
                            accept="image/*"
                            class="mt-2 text-xs"
                        >
                    </div>

                </div>

                <form id="profileForm" class="form-grid">

                    <div class="crud-section wide">

                        <div class="crud-section-head">
                            <div>
                                <span class="tiny-label">PROFILE</span>
                                <h3>Personal details</h3>
                            </div>
                        </div>

                        <div class="form-grid inner-grid">

                            <label>
                                Full name *
                                <input id="editName" required>
                            </label>

                            <label>
                                Email *
                                <input
                                    id="editEmail"
                                    type="email"
                                    required
                                >
                            </label>

                            <label class="wide">
                                Bio
                                <textarea
                                    id="editBio"
                                    rows="3"
                                    maxlength="160"
                                ></textarea>
                            </label>

                        </div>
                    </div>

                    <div class="crud-section wide">

                        <div class="crud-section-head">
                            <div>
                                <span class="tiny-label">EDUCATION</span>
                                <h3>Learning timeline</h3>
                            </div>
                        </div>

                        <div class="form-grid inner-grid">

                            <label>
                                School
                                <input id="editSchool">
                            </label>

                            <label>
                                College
                                <input id="editCollege">
                            </label>

                            <label>
                                Current study
                                <input id="editCurrent">
                            </label>

                            <label>
                                Next goal
                                <input id="editNext">
                            </label>

                        </div>
                    </div>

                    <div class="crud-section wide">

                        <div class="crud-section-head">
                            <div>
                                <span class="tiny-label">SKILLS</span>
                                <h3>Your skills</h3>
                            </div>

                            <button
                                type="button"
                                class="btn btn-small"
                                id="addSkillBtn"
                            >+ Add skill</button>
                        </div>

                        <div id="skillsEditor"></div>

                    </div>

                    <div class="crud-section wide">

                        <div class="crud-section-head">
                            <div>
                                <span class="tiny-label">PROJECTS</span>
                                <h3>Your projects</h3>
                            </div>

                            <button
                                type="button"
                                class="btn btn-small"
                                id="addProjectBtn"
                            >+ Add project</button>
                        </div>

                        <div id="projectsEditor"></div>

                    </div>

                    <div
                        class="wide form-status"
                        id="profileStatus"
                        role="status"
                    ></div>

                    <div class="wide modal-actions">

                        <button
                            type="button"
                            class="btn btn-ghost"
                            id="cancelProfile"
                        >Cancel</button>

                        <button
                            type="button"
                            class="btn delete-profile-danger"
                            id="deleteProfileBtn"
                        >Delete profile</button>

                        <button
                            type="submit"
                            class="btn btn-primary"
                        >Save all changes ✓</button>

                    </div>

                </form>
            </section>
        `;

        document.body.appendChild(modal);

        document.getElementById('closeProfile')
            .onclick = closeModal;

        document.getElementById('cancelProfile')
            .onclick = closeModal;

        modal.onclick = event => {
            if (event.target === modal) {
                closeModal();
            }
        };

        document.getElementById('deleteProfileBtn')
            .onclick = () => {
                if (
                    confirm(
                        'Delete your entire portfolio profile? This cannot be undone.'
                    )
                ) {
                    deleteProfile();
                    closeModal();
                    renderNav();
                    updateProfileUI();
                    toast('Portfolio deleted.');
                }
            };

        document.getElementById('profilePhoto')
            .onchange = event => {
                const file = event.target.files[0];

                if (!file) return;

                if (!file.type.startsWith('image/')) {
                    toast('Please select an image file.');
                    return;
                }

                const reader = new FileReader();

                reader.onload = () => {
                    document.getElementById('photoPreview').src =
                        reader.result;
                };

                reader.readAsDataURL(file);
            };

        document.getElementById('addSkillBtn')
            .onclick = () => {
                document.getElementById('skillsEditor')
                    .insertAdjacentHTML(
                        'beforeend',
                        skillRow('')
                    );

                bindCrudButtons();
            };

        document.getElementById('addProjectBtn')
            .onclick = () => {
                const newProject = {
                    id: crypto.randomUUID(),
                    title: '',
                    status: 'completed',
                    description: '',
                    tech: []
                };

                document.getElementById('projectsEditor')
                    .insertAdjacentHTML(
                        'beforeend',
                        projectRow(newProject)
                    );

                bindCrudButtons();
            };

        document.getElementById('profileForm')
            .onsubmit = saveProfileFromModal;
    }

    document.getElementById('editName').value =
        profile.name || '';

    document.getElementById('editEmail').value =
        profile.email || '';

    document.getElementById('editSchool').value =
        profile.school || '';

    document.getElementById('editCollege').value =
        profile.college || '';

    document.getElementById('editCurrent').value =
        profile.currentStudy || '';

    document.getElementById('editNext').value =
        profile.nextGoal || '';

    document.getElementById('editBio').value =
        profile.bio || '';

    document.getElementById('photoPreview').src =
        profile.photo || avatarPath();

    document.getElementById('skillsEditor').innerHTML =
        profile.skills.map(skillRow).join('');

    document.getElementById('projectsEditor').innerHTML =
        profile.projects.map(projectRow).join('');

    document.getElementById('profileStatus').textContent = '';

    bindCrudButtons();

    modal.classList.add('open');
}


/* =====================================================
   CRUD: DELETE BUTTONS
===================================================== */

function bindCrudButtons() {
    document.querySelectorAll('.delete-skill')
        .forEach(button => {
            button.onclick = () => {
                button.closest('.skill-edit-row')?.remove();
            };
        });

    document.querySelectorAll('.delete-project')
        .forEach(button => {
            button.onclick = () => {
                button.closest('.project-edit-row')?.remove();
            };
        });
}


/* =====================================================
   CRUD: CREATE, READ, UPDATE, DELETE AND SAVE
===================================================== */

function saveProfileFromModal(event) {
    event.preventDefault();

    const oldProfile = normalizeProfile(getProfile()) || {};

    const name = document.getElementById('editName')
        .value.trim();

    const email = document.getElementById('editEmail')
        .value.trim()
        .toLowerCase();

    if (name.length < 2) {
        return showStatus(
            'profileStatus',
            'Please enter your name.',
            'error'
        );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return showStatus(
            'profileStatus',
            'Please use a valid email.',
            'error'
        );
    }

    const skills = [
        ...document.querySelectorAll('.skill-input')
    ]
        .map(input => input.value.trim())
        .filter(Boolean);

    const projectRows = [
        ...document.querySelectorAll('.project-edit-row')
    ];

    const projects = projectRows.map(row => {
        const existingId = row.dataset.id;

        /*
         * find(): locate the existing project by its ID.
         * Existing IDs are preserved when editing a project.
         */
        const existingProject = oldProfile.projects.find(
            project => project.id === existingId
        );

        return {
            id: existingProject?.id || crypto.randomUUID(),

            title: row.querySelector('.project-title')
                .value.trim(),

            status: row.querySelector('.project-status-input')
                .value,

            description: row.querySelector('.project-description')
                .value.trim(),

            tech: row.querySelector('.project-tech')
                .value.split(',')
                .map(technology => technology.trim())
                .filter(Boolean)
        };
    });

    // Ignore empty project rows.
    const validProjects = projects.filter(
        project => project.title.length > 0
    );

    /*
     * some(): prevent projects from having duplicate titles.
     */
    const titles = validProjects.map(
        project => project.title.toLowerCase()
    );

    const hasDuplicateTitles = titles.some(
        (title, index) => titles.indexOf(title) !== index
    );

    if (hasDuplicateTitles) {
        return showStatus(
            'profileStatus',
            'Each project must have a unique title. Please remove duplicate project titles.',
            'error'
        );
    }

    const profile = {
        ...oldProfile,

        name,

        email,

        school: document.getElementById('editSchool')
            .value.trim(),

        college: document.getElementById('editCollege')
            .value.trim(),

        currentStudy: document.getElementById('editCurrent')
            .value.trim(),

        nextGoal: document.getElementById('editNext')
            .value.trim(),

        bio: document.getElementById('editBio')
            .value.trim(),

        skills,

        projects: validProjects,

        photo: document.getElementById('photoPreview').src
    };

    try {
        setProfile(profile);

        closeModal();
        renderNav();
        updateProfileUI();

        toast('Portfolio updated — changes saved!');
    } catch (error) {
        console.error('Unable to save profile:', error);

        showStatus(
            'profileStatus',
            'Unable to save your profile. Your browser storage may be full.',
            'error'
        );
    }
}


function closeModal() {
    document.getElementById('profileModal')
        ?.classList.remove('open');
}


/* =====================================================
   PROJECT SEARCH, FILTERING AND RENDERING
===================================================== */

function renderProjects() {
    const profile = normalizeProfile(getProfile());

    const box = document.getElementById('dynamicProjects');

    if (!box) return;

    if (!profile) {
        box.innerHTML = `
            <p class="empty-state">
                Create a portfolio to display projects.
            </p>
        `;

        return;
    }

    const searchInput =
        document.getElementById('projectSearch');

    const statusFilter =
        document.getElementById('projectStatusFilter');

    const resultsCount =
        document.getElementById('projectResultsCount');

    const searchTerm = (
        searchInput?.value || ''
    )
        .trim()
        .toLowerCase();

    const selectedStatus =
        statusFilter?.value || 'all';

    const projects = profile.projects || [];

    /*
     * filter(): select projects matching the search
     * term and the selected status.
     */
    const filteredProjects = projects.filter(project => {
        const searchableText = [
            project.title,
            project.description,
            ...(project.tech || [])
        ]
            .join(' ')
            .toLowerCase();

        const matchesSearch =
            searchableText.includes(searchTerm);

        const matchesStatus =
            selectedStatus === 'all' ||
            project.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    /*
     * Update the number of matching records.
     */
    if (resultsCount) {
        resultsCount.textContent =
            `Showing ${filteredProjects.length} of ${projects.length} projects`;
    }

    /*
     * map(): transform project objects into HTML cards.
     */
    box.innerHTML = filteredProjects.map(project => {
        let statusClass = 'idea';
        let statusLabel = 'NEXT IDEA';

        if (project.status === 'completed') {
            statusClass = 'done';
            statusLabel = 'COMPLETED';
        } else if (project.status === 'progress') {
            statusClass = 'progress';
            statusLabel = 'IN PROGRESS';
        }

        return `
            <article class="project-card reveal">

                <span class="project-status ${statusClass}">
                    ${statusLabel}
                </span>

                <h3>${esc(project.title)}</h3>

                <p>${esc(project.description)}</p>

                <div class="project-meta">
                    ${(project.tech || []).map(technology => `
                        <span>${esc(technology)}</span>
                    `).join('')}
                </div>

            </article>
        `;
    }).join('');

    if (filteredProjects.length === 0) {
        box.innerHTML = `
            <p class="empty-state">
                No projects match your search.
                Try another keyword or clear your filters.
            </p>
        `;
    }
}


function initProjectFilters() {
    const searchInput =
        document.getElementById('projectSearch');

    const statusFilter =
        document.getElementById('projectStatusFilter');

    const clearButton =
        document.getElementById('clearProjectFilters');

    if (!searchInput || !statusFilter) return;

    searchInput.addEventListener(
        'input',
        renderProjects
    );

    statusFilter.addEventListener(
        'change',
        renderProjects
    );

    clearButton?.addEventListener('click', () => {
        searchInput.value = '';
        statusFilter.value = 'all';

        renderProjects();
    });
}


/* =====================================================
   SKILLS RENDERING
===================================================== */

function renderSkills() {
    const profile = normalizeProfile(getProfile());

    const box = document.getElementById('dynamicSkills');

    if (!box || !profile) return;

    box.innerHTML = profile.skills.map((skill, index) => `
        <span class="skill-pill ${
            index % 5 === 0 ? 'skill-lg' : ''
        } ${
            index % 4 === 0 ? 'skill-accent' : ''
        }">
            ${esc(skill)}
        </span>
    `).join('');

    if (profile.skills.length === 0) {
        box.innerHTML = `
            <span class="empty-state">
                No skills added yet.
            </span>
        `;
    }
}


/* =====================================================
   UPDATE PORTFOLIO UI
===================================================== */

function updateProfileUI() {
    const profile = normalizeProfile(getProfile());

    renderProjects();
    renderSkills();

    if (!profile) return;

    setProfile(profile);

    document.getElementById('heroName')
        ?.replaceChildren(
            document.createTextNode(
                profile.name || 'Your Name'
            )
        );

    const heroBio = document.getElementById('heroBio');

    if (heroBio) {
        heroBio.textContent =
            profile.bio ||
            'Write a one-line story about what you build.';
    }

    const heroAvatar = document.getElementById('heroAvatar');

    if (heroAvatar) {
        heroAvatar.src =
            profile.photo || avatarPath();
    }

    [
        ['heroProjects', profile.completed],
        ['heroSkills', profile.skills.length],
        ['statCompleted', profile.completed],
        ['statProgress', profile.inProgress],
        ['statSkills', profile.skills.length]
    ].forEach(([id, value]) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent =
                String(value ?? 0).padStart(2, '0');
        }
    });

    const school = document.getElementById('aboutSchool');

    if (school) {
        school.textContent =
            profile.school || 'Secondary School';
    }

    const college = document.getElementById('aboutCollege');

    if (college) {
        college.textContent =
            profile.college || 'College / Intermediate';
    }

    const currentStudy =
        document.getElementById('aboutCurrent');

    if (currentStudy) {
        currentStudy.textContent =
            profile.currentStudy || 'Current Study';
    }

    const nextGoal =
        document.getElementById('aboutNext');

    if (nextGoal) {
        nextGoal.textContent =
            profile.nextGoal || 'Next Goal';
    }

    const editButton =
        document.getElementById('homeEditBtn');

    const buildButton =
        document.getElementById('homeBuildBtn');

    if (editButton && buildButton) {
        editButton.classList.remove('hidden');
        buildButton.classList.add('hidden');

        editButton.onclick = openModal;
    }
}


/* =====================================================
   AUTHENTICATION HELPERS
===================================================== */

function score(value) {
    let points = 0;

    if (value.length >= 8) points++;
    if (/[A-Z]/.test(value)) points++;
    if (/[0-9]/.test(value)) points++;
    if (/[^A-Za-z0-9]/.test(value)) points++;

    return points;
}


function initAuth() {
    const signInForm =
        document.getElementById('signinForm');

    if (signInForm) {
        const password =
            document.getElementById('signinPassword');

        password.oninput = () => {
            const strength = score(password.value);

            const hint =
                document.getElementById('passwordHint');

            hint.textContent =
                'Password strength: ' +
                (
                    strength < 2
                        ? 'Weak'
                        : strength < 3
                            ? 'Okay'
                            : strength < 4
                                ? 'Good'
                                : 'Strong'
                );
        };

        document.querySelectorAll('.password-toggle')
            .forEach(button => {
                button.onclick = () => {
                    const field = document.getElementById(
                        button.dataset.target
                    );

                    const shouldShow =
                        field.type === 'password';

                    field.type = shouldShow
                        ? 'text'
                        : 'password';

                    button.textContent =
                        shouldShow ? 'Hide' : 'Show';
                };
            });

        signInForm.onsubmit = event => {
            event.preventDefault();

            const email = document.getElementById(
                'signinEmail'
            ).value.trim().toLowerCase();

            const enteredPassword = password.value;

            const profile = getProfile();

            const validCredentials =
                (
                    email === 'demo@portfolio.dev' &&
                    enteredPassword === 'Portfolio123!'
                ) ||
                (
                    profile &&
                    profile.email === email &&
                    profile.password === enteredPassword
                );

            if (!validCredentials) {
                return showStatus(
                    'signinStatus',
                    'Email or password is incorrect.',
                    'error'
                );
            }

            if (
                email === 'demo@portfolio.dev' &&
                !profile
            ) {
                setProfile({
                    ...DEMO,
                    skills: [...DEMO.skills],
                    projects: DEMO.projects.map(project => ({
                        ...project,
                        tech: [...project.tech]
                    }))
                });
            }

            showStatus(
                'signinStatus',
                'Signed in. Opening your portfolio…',
                'success'
            );

            setTimeout(() => {
                location.href = '../../index.html';
            }, 450);
        };
    }

    const signUpForm =
        document.getElementById('signupForm');

    if (signUpForm) {
        const password =
            document.getElementById('signupPassword');

        password.oninput = () => {
            const bar =
                document.getElementById('signupMeterBar');

            const strength = score(password.value);

            bar.style.width = `${strength * 25}%`;

            bar.style.background =
                strength < 2
                    ? '#d05656'
                    : strength < 3
                        ? '#e3bb50'
                        : '#36d174';
        };

        signUpForm.onsubmit = event => {
            event.preventDefault();

            const name = document.getElementById(
                'signupName'
            ).value.trim();

            const email = document.getElementById(
                'signupEmail'
            ).value.trim().toLowerCase();

            const password1 = password.value;

            const password2 = document.getElementById(
                'signupConfirm'
            ).value;

            if (name.length < 2) {
                return showStatus(
                    'signupStatus',
                    'Enter your name.',
                    'error'
                );
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return showStatus(
                    'signupStatus',
                    'Enter a valid email address.',
                    'error'
                );
            }

            if (password1.length < 8) {
                return showStatus(
                    'signupStatus',
                    'Password needs at least 8 characters.',
                    'error'
                );
            }

            if (password1 !== password2) {
                return showStatus(
                    'signupStatus',
                    'Passwords do not match.',
                    'error'
                );
            }

            if (email === 'demo@portfolio.dev') {
                return showStatus(
                    'signupStatus',
                    'That demo email is reserved.',
                    'error'
                );
            }

            setProfile({
                name,
                email,
                password: password1,

                bio: document.getElementById(
                    'signupBio'
                ).value.trim(),

                school: '',
                college: '',
                currentStudy: '',
                nextGoal: '',

                projects: [],

                skills: [
                    'HTML5',
                    'Tailwind CSS',
                    'JavaScript'
                ],

                photo: '../../assets/avatar-placeholder.svg'
            });

            showStatus(
                'signupStatus',
                'Profile created. Opening your portfolio…',
                'success'
            );

            setTimeout(() => {
                location.href = '../../index.html';
            }, 600);
        };
    }
}


/* =====================================================
   CONTACT FORM
===================================================== */

function initContact() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', event => {
        if (
            (form.action || '').includes('YOUR_FORMSPREE_ID')
        ) {
            event.preventDefault();

            showStatus(
                'contactStatus',
                'Replace YOUR_FORMSPREE_ID with your real Formspree endpoint.',
                'error'
            );
        }
    });
}


/* =====================================================
   MAGNETIC BUTTONS
===================================================== */

function magneticButtons() {
    document.querySelectorAll('.magnetic')
        .forEach(button => {
            button.addEventListener('mousemove', event => {
                const rect = button.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left - rect.width / 2) * 0.06;

                const y =
                    (event.clientY - rect.top - rect.height / 2) * 0.06;

                button.style.transform =
                    `translate(${x}px, ${y}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
}


/* =====================================================
   FORMSPREE AJAX INTEGRATION
===================================================== */

function initFormspreeAjax() {
    const contactForm =
        document.getElementById('contact-form');

    if (!contactForm) return;

    const submitButton = contactForm.querySelector(
        'button[type="submit"], input[type="submit"]'
    );

    let status = document.getElementById('form-status');

    if (!status) {
        status = document.createElement('div');

        status.id = 'form-status';

        status.setAttribute('role', 'status');

        status.setAttribute('aria-live', 'polite');

        contactForm.appendChild(status);
    }

    contactForm.addEventListener('submit', async event => {
        event.preventDefault();

        if (submitButton) {
            submitButton.disabled = true;

            submitButton.dataset.originalText =
                submitButton.textContent;

            submitButton.textContent = 'Sending...';
        }

        status.textContent = '';
        status.className = 'form-status';

        try {
            const response = await fetch(
                'https://formspree.io/f/mbglnqje',
                {
                    method: 'POST',

                    body: new FormData(contactForm),

                    headers: {
                        Accept: 'application/json'
                    }
                }
            );

            if (response.ok) {
                status.textContent =
                    'Message sent successfully! Thank you for contacting me.';

                status.classList.add('success');

                contactForm.reset();
            } else {
                let message =
                    'Unable to send your message. Please try again.';

                try {
                    const data = await response.json();

                    if (data.errors?.length) {
                        message = data.errors
                            .map(error => error.message)
                            .join(' ');
                    }
                } catch (error) {
                    console.error(
                        'Unable to read Formspree response:',
                        error
                    );
                }

                status.textContent = message;

                status.classList.add('error');
            }
        } catch (error) {
            console.error('Contact form error:', error);

            status.textContent =
                'Network error. Please check your connection and try again.';

            status.classList.add('error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;

                submitButton.textContent =
                    submitButton.dataset.originalText ||
                    'Send Message';
            }
        }
    });
}


/* =====================================================
   ASSIGNMENT 03 - TASK 1
   CRUD APPLICATION (JavaScript + LOCAL STORAGE)
   Records are plain objects kept in an array, e.g.
   { id, title, category, description, createdAt, updatedAt }
===================================================== */

const RECORDS_KEY = 'portfolioforge_project_records';

function escAttr(value) {
    return esc(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function recordEl(id) {
    return document.getElementById(id);
}


/* ---------- Local Storage helpers ---------- */

/** READ from Local Storage -> array of record objects. */
function loadRecords() {
    try {
        const saved = localStorage.getItem(RECORDS_KEY);
        const parsed = saved ? JSON.parse(saved) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Could not read saved records:', error);
        return [];
    }
}

/** WRITE the whole array to Local Storage. */
function saveRecords(records) {
    try {
        localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
        return true;
    } catch (error) {
        console.error('Could not save records:', error);
        showStatus(
            'recordFormStatus',
            'Unable to save. Browser storage may be full or disabled.',
            'error'
        );
        return false;
    }
}

function resetRecordForm() {
    recordEl('recordForm')?.reset();

    recordEl('recordId').value = '';
    recordEl('recordFormHeading').textContent = 'Add a Project';
    recordEl('recordSubmitButton').textContent = 'Add Project';
    recordEl('cancelRecordEdit').hidden = true;
}


/* ---------- CREATE and UPDATE ---------- */

function handleRecordSubmit(event) {
    event.preventDefault();

    const fields = {
        title: recordEl('recordTitle').value.trim(),
        category: recordEl('recordCategory').value,
        description: recordEl('recordDescription').value.trim()
    };

    // every(): all required fields must contain a value.
    const isValid = Object.values(fields).every(
        (value) => value.length > 0
    );

    if (!isValid) {
        showStatus(
            'recordFormStatus',
            'Please complete every field before saving.',
            'error'
        );
        return;
    }

    const editingId = recordEl('recordId').value;
    const records = loadRecords();

    // some(): block duplicate titles (ignoring the record being edited).
    const duplicate = records.some((record) =>
        record.title.toLowerCase() === fields.title.toLowerCase() &&
        record.id !== editingId
    );

    if (duplicate) {
        showStatus(
            'recordFormStatus',
            'A project with this title already exists.',
            'error'
        );
        return;
    }

    let updatedRecords;
    let message;

    if (editingId) {
        // UPDATE: map() returns a new array with one record replaced.
        updatedRecords = records.map((record) =>
            record.id === editingId
                ? {
                    ...record,
                    ...fields,
                    updatedAt: new Date().toISOString()
                }
                : record
        );

        message = 'Project updated successfully.';
    } else {
        // CREATE: add a new object to the array.
        updatedRecords = [
            ...records,
            {
                id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                ...fields,
                createdAt: new Date().toISOString(),
                updatedAt: null
            }
        ];

        message = 'Project added successfully.';
    }

    if (!saveRecords(updatedRecords)) return;

    resetRecordForm();
    renderRecords();
    showStatus('recordFormStatus', message, 'success');
    toast(message);
}


/* ---------- READ (display + search + filter) ---------- */

function renderRecords() {
    const list = recordEl('recordList');

    if (!list) return;

    const term = (recordEl('recordSearch')?.value || '')
        .trim()
        .toLowerCase();

    const category = recordEl('recordFilter')?.value || 'all';
    const records = loadRecords();

    // filter(): keep only records matching the search text AND category.
    const visible = records
        .filter((record) => {
            const text = [
                record.title,
                record.category,
                record.description
            ].join(' ').toLowerCase();

            return (
                text.includes(term) &&
                (category === 'all' || record.category === category)
            );
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const count = recordEl('recordCount');

    if (count) {
        count.textContent =
            `${visible.length} of ${records.length} project${records.length === 1 ? '' : 's'}`;
    }

    if (!visible.length) {
        list.innerHTML = `
            <p class="empty-state">
                ${records.length
                    ? 'No projects match your search or filter.'
                    : 'No projects saved yet. Use the form above to add your first one.'}
            </p>
        `;
        return;
    }

    // map(): turn each record object into a card of HTML.
    list.innerHTML = visible.map((record) => `
        <article class="assignment-record-card">
            <span class="tag">${esc(record.category)}</span>

            <h3>${esc(record.title)}</h3>

            <p>${esc(record.description)}</p>

            <small class="record-date">
                ${record.updatedAt
                    ? 'Updated ' + new Date(record.updatedAt).toLocaleDateString()
                    : 'Added ' + new Date(record.createdAt).toLocaleDateString()}
            </small>

            <div class="assignment-record-actions">
                <button
                    type="button"
                    class="btn btn-ghost"
                    data-record-action="edit"
                    data-record-id="${escAttr(record.id)}"
                >Edit</button>

                <button
                    type="button"
                    class="btn assignment-delete-btn"
                    data-record-action="delete"
                    data-record-id="${escAttr(record.id)}"
                >Delete</button>
            </div>
        </article>
    `).join('');
}


/* ---------- EDIT (load into form) and DELETE ---------- */

function handleRecordListClick(event) {
    const button = event.target.closest('[data-record-action]');

    if (!button) return;

    const { recordId, recordAction } = button.dataset;

    // find(): locate one specific record by its id.
    const record = loadRecords().find((item) => item.id === recordId);

    if (!record) {
        showStatus('recordFormStatus', 'That project no longer exists.', 'error');
        renderRecords();
        return;
    }

    if (recordAction === 'edit') {
        recordEl('recordId').value = record.id;
        recordEl('recordTitle').value = record.title;
        recordEl('recordCategory').value = record.category;
        recordEl('recordDescription').value = record.description;

        recordEl('recordFormHeading').textContent = 'Edit Project';
        recordEl('recordSubmitButton').textContent = 'Save Changes';
        recordEl('cancelRecordEdit').hidden = false;

        showStatus('recordFormStatus', `Editing "${record.title}".`);

        recordEl('recordForm').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        recordEl('recordTitle').focus({ preventScroll: true });
    }

    if (recordAction === 'delete') {
        if (!window.confirm(`Delete "${record.title}"?`)) return;

        // filter(): build a new array without the deleted record.
        const remaining = loadRecords().filter(
            (item) => item.id !== recordId
        );

        if (!saveRecords(remaining)) return;

        if (recordEl('recordId').value === recordId) resetRecordForm();

        renderRecords();
        showStatus('recordFormStatus', 'Project deleted.', 'success');
        toast('Project deleted');
    }
}

function clearAllRecords() {
    if (!loadRecords().length) {
        toast('There are no saved projects to clear');
        return;
    }

    if (!window.confirm('Delete ALL saved projects? This cannot be undone.')) {
        return;
    }

    localStorage.removeItem(RECORDS_KEY);

    resetRecordForm();
    renderRecords();
    showStatus('recordFormStatus', 'All projects cleared.', 'success');
}

function initRecordsCrud() {
    const form = recordEl('recordForm');

    if (!form) return;

    form.addEventListener('submit', handleRecordSubmit);

    recordEl('recordSearch')?.addEventListener('input', renderRecords);
    recordEl('recordFilter')?.addEventListener('change', renderRecords);
    recordEl('recordList')?.addEventListener('click', handleRecordListClick);

    recordEl('cancelRecordEdit')?.addEventListener('click', () => {
        resetRecordForm();
        showStatus('recordFormStatus', 'Editing cancelled.');
    });

    recordEl('clearRecordFilters')?.addEventListener('click', () => {
        recordEl('recordSearch').value = '';
        recordEl('recordFilter').value = 'all';
        renderRecords();
    });

    recordEl('clearAllRecords')?.addEventListener('click', clearAllRecords);

    renderRecords();
}


/* =====================================================
   ASSIGNMENT 03 - TASK 2
   PUBLIC API + AXIOS
   API: GitHub REST API (free, JSON, no API key needed)
   Endpoint: GET https://api.github.com/users/{username}/repos
   Docs: https://docs.github.com/en/rest/repos/repos
===================================================== */

const GITHUB_USERNAME = 'Ayyan-Asif';
const GITHUB_REPOS_URL =
    `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

let githubRepos = [];

function setApiStatus(message, type = '') {
    const status = recordEl('githubApiStatus');

    if (!status) return;

    status.textContent = message;
    status.className = `form-status ${type}`.trim();
}

function renderRepoSkeletons() {
    const list = recordEl('githubRepoList');

    list.innerHTML = Array.from({ length: 3 }, () => `
        <article class="assignment-record-card skeleton-card" aria-hidden="true">
            <span class="skeleton-line short"></span>
            <span class="skeleton-line"></span>
            <span class="skeleton-line"></span>
        </article>
    `).join('');
}

function renderRepoLanguageFilter() {
    const select = recordEl('githubLangFilter');

    if (!select) return;

    const current = select.value || 'all';

    // map() + Set + filter(): unique, non-empty language names.
    const languages = [
        ...new Set(githubRepos.map((repo) => repo.language))
    ].filter(Boolean).sort();

    select.innerHTML =
        '<option value="all">All languages</option>' +
        languages.map((language) =>
            `<option value="${escAttr(language)}">${esc(language)}</option>`
        ).join('');

    select.value = languages.includes(current) ? current : 'all';
}

function renderGitHubRepos() {
    const list = recordEl('githubRepoList');

    if (!list) return;

    const selected = recordEl('githubLangFilter')?.value || 'all';

    const visible = githubRepos.filter((repo) =>
        selected === 'all' || repo.language === selected
    );

    // reduce(): total stars across the repositories being shown.
    const stars = visible.reduce(
        (total, repo) => total + (repo.stargazers_count || 0),
        0
    );

    const summary = recordEl('githubSummary');

    if (summary) {
        summary.textContent =
            `${visible.length} repositories • ${stars} stars`;
    }

    if (!visible.length) {
        list.innerHTML =
            '<p class="empty-state">No repositories match this language.</p>';
        return;
    }

    list.innerHTML = visible.map((repo) => {
        const url = String(repo.html_url || '');
        const safeUrl = url.startsWith('https://github.com/') ? url : '#';

        return `
            <article class="assignment-record-card">
                <span class="tag">${esc(repo.language || 'Not specified')}</span>

                <h3>${esc(repo.name)}</h3>

                <p>${esc(repo.description || 'No description provided.')}</p>

                <p class="assignment-repo-stats">
                    ★ ${Number(repo.stargazers_count) || 0}
                    &nbsp;•&nbsp;
                    ⑂ ${Number(repo.forks_count) || 0}
                    &nbsp;•&nbsp;
                    Updated ${new Date(repo.updated_at).toLocaleDateString()}
                </p>

                <a
                    class="btn btn-primary"
                    href="${escAttr(safeUrl)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >View Repository ↗</a>
            </article>
        `;
    }).join('');
}

async function loadGitHubRepos() {
    const list = recordEl('githubRepoList');
    const button = recordEl('loadGithubRepos');

    if (!list || !button) return;

    if (typeof axios === 'undefined') {
        setApiStatus(
            'Axios did not load. Check your internet connection and the Axios <script> tag.',
            'error'
        );
        return;
    }

    // LOADING state
    button.disabled = true;
    button.textContent = 'Loading...';
    setApiStatus('Loading repositories from GitHub...');
    renderRepoSkeletons();

    try {
        // The Axios GET request.
        const response = await axios.get(GITHUB_REPOS_URL, {
            params: { sort: 'updated', per_page: 30 },
            headers: { Accept: 'application/vnd.github+json' },
            timeout: 10000
        });

        githubRepos = Array.isArray(response.data) ? response.data : [];

        if (!githubRepos.length) {
            list.innerHTML =
                '<p class="empty-state">This GitHub account has no public repositories yet.</p>';
            setApiStatus('Request succeeded, but no repositories were returned.');
            return;
        }

        renderRepoLanguageFilter();
        renderGitHubRepos();

        setApiStatus(
            `Loaded ${githubRepos.length} public repositories from GitHub.`,
            'success'
        );
    } catch (error) {
        console.error('GitHub API request failed:', error);

        githubRepos = [];
        list.innerHTML = '';

        // ERROR states
        if (error.response?.status === 404) {
            setApiStatus(
                `GitHub user "${GITHUB_USERNAME}" was not found. Check GITHUB_USERNAME in app.js.`,
                'error'
            );
        } else if (
            error.response?.status === 403 ||
            error.response?.status === 429
        ) {
            setApiStatus(
                'GitHub rate limit reached. Wait a few minutes, then press Refresh.',
                'error'
            );
        } else if (error.code === 'ECONNABORTED') {
            setApiStatus('The request timed out. Press Refresh to try again.', 'error');
        } else if (error.response) {
            setApiStatus(
                `GitHub returned status ${error.response.status}. Press Refresh to try again.`,
                'error'
            );
        } else {
            setApiStatus(
                'Could not reach GitHub. Check your connection, then press Refresh.',
                'error'
            );
        }
    } finally {
        button.disabled = false;
        button.textContent = 'Refresh Repositories';
    }
}

function initGitHubApi() {
    const button = recordEl('loadGithubRepos');

    if (!button) return;

    button.addEventListener('click', loadGitHubRepos);
    recordEl('githubLangFilter')?.addEventListener('change', renderGitHubRepos);

    // Fetch automatically when the page opens.
    loadGitHubRepos();
}


/* =====================================================
   APPLICATION INITIALIZATION
===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    renderNav();

    renderFooter();

    initTheme();

    initAuth();

    initContact();

    initProjectFilters();

    initFormspreeAjax();

    updateProfileUI();

    magneticButtons();

    initRecordsCrud();

    initGitHubApi();
});
