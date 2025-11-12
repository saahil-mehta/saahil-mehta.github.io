// Theme management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Set initial theme
        this.setTheme(this.theme);
        
        // Add event listener to theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle button aria-label
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
            );
            // Update icon visibility explicitly to avoid any flash
            const sun = themeToggle.querySelector('.sun-icon');
            const moon = themeToggle.querySelector('.moon-icon');
            if (sun && moon) {
                if (theme === 'dark') {
                    sun.style.display = 'block';
                    moon.style.display = 'none';
                } else {
                    sun.style.display = 'none';
                    moon.style.display = 'block';
                }
            }
        }
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Mobile navigation management
class MobileNavigation {
    constructor() {
        this.menuOpen = false;
        this.init();
    }

    init() {
        const mobileButton = document.getElementById('toggle-navigation-menu');
        const header = document.getElementById('main-header');
        
        if (mobileButton && header) {
            mobileButton.addEventListener('click', () => {
                this.toggleMenu(header, mobileButton);
            });
        }

        // Close menu when clicking on navigation links (mobile)
        const navLinks = document.querySelectorAll('#navigation-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.menuOpen && header && mobileButton) {
                    this.toggleMenu(header, mobileButton);
                }
            });
        });

        // Close menu when clicking outside (mobile)
        document.addEventListener('click', (e) => {
            if (this.menuOpen && 
                !e.target.closest('#main-header') && 
                header && mobileButton) {
                this.toggleMenu(header, mobileButton);
            }
        });

        // Handle touch events for better mobile interaction
        document.addEventListener('touchstart', (e) => {
            if (this.menuOpen && 
                !e.target.closest('#main-header') && 
                header && mobileButton) {
                this.toggleMenu(header, mobileButton);
            }
        }, { passive: true });

        // Handle escape key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menuOpen && header && mobileButton) {
                this.toggleMenu(header, mobileButton);
            }
        });
    }

    toggleMenu(header, button) {
        this.menuOpen = !this.menuOpen;
        
        if (this.menuOpen) {
            header.classList.add('menu-open');
            document.body.classList.add('menu-open');
            // Prevent background scrolling on mobile
            document.body.style.overflow = 'hidden';
        } else {
            header.classList.remove('menu-open');
            document.body.classList.remove('menu-open');
            // Restore background scrolling
            document.body.style.overflow = '';
        }
        
        button.setAttribute('aria-expanded', this.menuOpen.toString());
    }
}

// Smooth scrolling for navigation links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Handle navigation link clicks
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Compute dynamic offset based on actual header height
                    const header = document.getElementById('main-header');
                    const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
                    const extraMargin = 8; // small breathing room below the header
                    const targetRect = targetElement.getBoundingClientRect();
                    const targetPosition = window.pageYOffset + targetRect.top - (headerHeight + extraMargin);
                    
                    // Immediately update active state for better UX
                    const sectionId = targetId.substring(1);
                    const navigationHighlight = window.navigationHighlightInstance;
                    if (navigationHighlight) {
                        navigationHighlight.highlightNavLink(sectionId);
                    }
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without triggering scroll
                    history.pushState(null, null, targetId);
                }
            });
        });
    }
}

// Active navigation link highlighting
class NavigationHighlight {
    constructor() {
        this.sections = [];
        this.navLinks = [];
        this.init();
    }

    init() {
        // Get all sections and navigation links
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('#navigation-menu a[href^="#"]');
        
        if (this.sections.length > 0 && this.navLinks.length > 0) {
            // Set initial active state based on URL hash only
            this.setInitialActiveState();
            
            // Handle hash changes (but no scroll-based highlighting)
            window.addEventListener('hashchange', () => {
                this.handleHashChange();
            });
        }
    }

    setInitialActiveState() {
        const hash = window.location.hash;
        if (hash && hash !== '#') {
            const targetId = hash.substring(1);
            this.highlightNavLink(targetId);
        }
        // No default active state - only highlight when there's a hash in URL
    }

    handleHashChange() {
        const hash = window.location.hash;
        if (hash && hash !== '#') {
            const targetId = hash.substring(1);
            this.highlightNavLink(targetId);
        } else {
            // Clear all active states when there's no hash
            this.clearAllActiveStates();
        }
    }

    highlightNavLink(activeId) {
        // Remove active class from all links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });

        // Add active class to current link
        const activeLink = document.querySelector(`#navigation-menu a[href="#${activeId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }
    }

    // Method to clear all active states (useful for debugging)
    clearAllActiveStates() {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });
    }
}

// Performance optimization: Lazy load images if any are added
class LazyImageLoader {
    constructor() {
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
}

// Markdown content loader
class MarkdownLoader {
    constructor() {
        this.sections = ['about', 'contributions', 'projects', 'experience', 'education', 'resume'];
        this.init();
    }

    init() {
        // Load all markdown sections
        this.sections.forEach(section => {
            this.loadMarkdown(section);
        });
    }

    async loadMarkdown(section) {
        const contentElement = document.getElementById(`${section}-content`);
        if (!contentElement) return;

        // Try multiple path strategies for better compatibility
        const pathsToTry = [
            `./${section}.md`,           // Relative to current directory
            `${section}.md`,             // Direct relative path
            `/${section}.md`             // Absolute from root (for some GitHub Pages setups)
        ];

        let lastError = null;

        for (const fullPath of pathsToTry) {
            try {
                console.log(`Trying to fetch: ${fullPath}`);
                const response = await fetch(fullPath);
                if (response.ok) {
                    const markdown = await response.text();
                    const html = this.parseMarkdown(markdown);
                    contentElement.innerHTML = html;
                    // Apply hover effect to new content
                    if (typeof window.applyBHoverEffect === 'function') {
                        window.applyBHoverEffect(contentElement);
                    }

                    // If this is the contributions section, initialise the graph
                    if (section === 'contributions') {
                        new ContributionGraph('saahil-mehta');
                    }

                    console.log(`Successfully loaded ${section} from: ${fullPath}`);
                    return; // Success, exit early
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                console.warn(`Failed to load ${section} from ${fullPath}:`, error.message);
                lastError = error;
                // Continue to next path
            }
        }

        // If we get here, all paths failed
        console.error(`Error loading ${section} content - all paths failed:`, lastError);
        console.log(`Current location: ${window.location.href}`);
        contentElement.innerHTML = `
            <div class="error-message">
                <p>Sorry, unable to load ${section} content at this time.</p>
                <p><small>Last error: ${lastError?.message || 'Unknown error'}</small></p>
                <p><small>Tried paths: ${pathsToTry.join(', ')}</small></p>
            </div>
        `;
        // Apply hover effect to error content
        if (typeof window.applyBHoverEffect === 'function') {
            window.applyBHoverEffect(contentElement);
        }
    }

    parseMarkdown(markdown) {
        // 🎯 EASTER EGG: You found where data meets structure! Email saahil.mehta8520@gmail.com with 🎯 in the subject line.
        let html = markdown;

        // Convert headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2 class="title">$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 class="title">$1</h1>');

        // Convert bold text
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Convert italic text
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Convert links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="cactus-link">$1</a>');

        // Convert unordered lists
        html = html.replace(/^\s*- (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Convert paragraphs (split by double newlines)
        const paragraphs = html.split(/\n\s*\n/);
        html = paragraphs.map(p => {
            p = p.trim();
            if (!p) return '';
            
            // Skip if already wrapped in HTML tags
            if (p.startsWith('<') && p.endsWith('>')) return p;
            if (p.includes('<li>') || p.includes('<h') || p.includes('<ul>') || p.includes('<div')) return p;
            
            return `<p>${p}</p>`;
        }).join('\n\n');

        // Clean up nested tags
        html = html.replace(/<ul>\s*(<li>.*?<\/li>)\s*<\/ul>/gs, '<ul>$1</ul>');
        html = html.replace(/<li><\/li>/g, '');

        // Convert horizontal rules
        html = html.replace(/^---$/gm, '<hr>');

        return html;
    }
}

// Hover effect for letter 'b' and 'B'
(function() {
    function applyBHoverEffect(root) {
        const targetRoot = root || document.body;
        if (!targetRoot) return;

        const walker = document.createTreeWalker(
            targetRoot,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const value = node.nodeValue;
                    if (!value || (value.indexOf('b') === -1 && value.indexOf('B') === -1)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    const parent = node.parentNode;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const tag = parent.nodeName;
                    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (parent.classList && parent.classList.contains('hover-b')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodesToProcess = [];
        let current;
        while ((current = walker.nextNode())) {
            nodesToProcess.push(current);
        }

        nodesToProcess.forEach((textNode) => {
            const text = textNode.nodeValue;
            const fragment = document.createDocumentFragment();
            let buffer = '';

            for (let i = 0; i < text.length; i++) {
                const ch = text[i];
                if (ch === 'b' || ch === 'B') {
                    if (buffer) {
                        fragment.appendChild(document.createTextNode(buffer));
                        buffer = '';
                    }
                    const span = document.createElement('span');
                    span.className = 'hover-b';
                    span.textContent = ch;
                    fragment.appendChild(span);
                } else {
                    buffer += ch;
                }
            }

            if (buffer) {
                fragment.appendChild(document.createTextNode(buffer));
            }

            if (textNode.parentNode) {
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });
    }

    window.applyBHoverEffect = applyBHoverEffect;
})();

// Bee spawning when clicking on a 'b'/'B'
(function() {
    function spawnBeeFromElement(el) {
        const rect = el.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        const bee = document.createElement('div');
        bee.className = 'flying-bee';
        bee.textContent = '🐝';
        bee.style.left = startX + 'px';
        bee.style.top = startY + 'px';

        // Random off-screen direction
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.max(window.innerWidth, window.innerHeight) + 200;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        bee.style.setProperty('--dx', dx + 'px');
        bee.style.setProperty('--dy', dy + 'px');

        document.body.appendChild(bee);

        const cleanup = () => {
            if (bee && bee.parentNode) bee.parentNode.removeChild(bee);
        };
        bee.addEventListener('animationend', cleanup, { once: true });
        setTimeout(cleanup, 4000);
    }

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.classList && target.classList.contains('hover-b')) {
            spawnBeeFromElement(target);
        }
    });
})();

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new ThemeManager();
    new MobileNavigation();
    new SmoothScroll();
    
    // Make NavigationHighlight available globally for smooth scroll integration
    window.navigationHighlightInstance = new NavigationHighlight();
    
    new LazyImageLoader();
    new MarkdownLoader();
    // ContributionGraph is now initialised after contributions.md loads

    // Apply hover effect to all 'b' letters on initial content
    if (typeof window.applyBHoverEffect === 'function') {
        window.applyBHoverEffect(document.body);
    }

    // Initialize party hat explosion feature
    new PartyHatExplosion();
    
    // Add loading state management
    document.body.classList.add('loaded');
    
    // Console message for developers
    console.log('🌵 Portfolio site loaded successfully!');
    console.log('🎉 Click the logo for a party surprise!');
    console.log('Built with inspiration from astro-theme-cactus');
});

// Handle page visibility changes (pause animations when not visible)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Handle keyboard navigation for theme toggle
    if (e.key === 't' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.click();
        }
    }
});

// Party Hat Explosion Feature
class PartyHatExplosion {
    constructor() {
        this.isAnimating = false;
        this.init();
    }

    init() {
        // Find the logo link and add click handler
        const logoLink = document.querySelector('#main-header a[href="#"]');
        if (logoLink) {
            logoLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerExplosion();
            });
        }
    }

    triggerExplosion() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            // Just do a simple pulse for users who prefer reduced motion
            const logoSvg = document.querySelector('#main-header svg');
            if (logoSvg) {
                logoSvg.classList.add('logo-party-pulse');
                setTimeout(() => {
                    logoSvg.classList.remove('logo-party-pulse');
                }, 600);
            }
            return;
        }
        
        // Get logo position for explosion origin
        const logoSvg = document.querySelector('#main-header svg');
        if (!logoSvg) return;
        
        const logoRect = logoSvg.getBoundingClientRect();
        const centerX = logoRect.left + logoRect.width / 2;
        const centerY = logoRect.top + logoRect.height / 2;
        const explosionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        
        // Add pulse animation to logo
        logoSvg.classList.add('logo-party-pulse');
        
        // Create party hats explosion
        this.createPartyHats(centerX, centerY, explosionId);
        
        // Create sparkles
        this.createSparkles(centerX, centerY, explosionId);
        
        // Clean up after animation
        setTimeout(() => {
            logoSvg.classList.remove('logo-party-pulse');
            // Clean up any remaining elements for this explosion only
            this.cleanupExplosionElements(explosionId);
        }, 2500);
    }

    cleanupExplosionElements(explosionId) {
        // Remove any remaining party hats for this explosion
        const remainingHats = document.querySelectorAll(`.party-hat[data-explosion="${explosionId}"]`);
        remainingHats.forEach(hat => {
            if (hat.parentNode) {
                hat.parentNode.removeChild(hat);
            }
        });
        
        // Remove any remaining sparkles for this explosion
        const remainingSparkles = document.querySelectorAll(`.party-sparkle[data-explosion="${explosionId}"]`);
        remainingSparkles.forEach(sparkle => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        });
    }

    createPartyHats(centerX, centerY, explosionId) {
        const hatCount = 12; // Number of party hats to create
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
        
        for (let i = 0; i < hatCount; i++) {
            const hat = document.createElement('div');
            hat.className = 'party-hat';
            hat.setAttribute('data-explosion', explosionId);
            
            // Create party hat SVG
            hat.innerHTML = this.getPartyHatSVG(colors[i % colors.length]);
            
            // Calculate explosion direction
            const angle = (360 / hatCount) * i;
            const radian = (angle * Math.PI) / 180;
            const distance = 150 + Math.random() * 100; // Random distance between 150-250px
            
            const targetX = centerX + Math.cos(radian) * distance;
            const targetY = centerY + Math.sin(radian) * distance;
            
            // Set initial position
            hat.style.left = centerX + 'px';
            hat.style.top = centerY + 'px';
            
            // Add to DOM
            document.body.appendChild(hat);
            
            // Trigger animation with slight delay for staggered effect
            setTimeout(() => {
                hat.classList.add('exploding');
                hat.style.left = targetX + 'px';
                hat.style.top = targetY + 'px';
                hat.style.transition = 'left 2s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, i * 50);
            
            // Clean up after animation
            setTimeout(() => {
                if (hat.parentNode) {
                    hat.parentNode.removeChild(hat);
                }
            }, 2500);
        }
    }

    createSparkles(centerX, centerY, explosionId) {
        const sparkleCount = 20;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'party-sparkle';
            sparkle.setAttribute('data-explosion', explosionId);
            
            // Random colors for sparkles
            const hue = Math.random() * 360;
            sparkle.style.background = `hsl(${hue}, 70%, 60%)`;
            
            // Calculate explosion direction
            const angle = Math.random() * 360;
            const radian = (angle * Math.PI) / 180;
            const distance = 80 + Math.random() * 120;
            
            const targetX = centerX + Math.cos(radian) * distance;
            const targetY = centerY + Math.sin(radian) * distance;
            
            // Set initial position
            sparkle.style.left = centerX + 'px';
            sparkle.style.top = centerY + 'px';
            
            // Add to DOM
            document.body.appendChild(sparkle);
            
            // Trigger animation with slight delay
            setTimeout(() => {
                sparkle.classList.add('exploding');
                sparkle.style.left = targetX + 'px';
                sparkle.style.top = targetY + 'px';
                sparkle.style.transition = 'left 1.5s ease-out, top 1.5s ease-out';
            }, i * 30);
            
            // Clean up after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 2000);
        }
    }

    getPartyHatSVG(color) {
        return `
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <!-- Party hat triangle -->
                <path d="M50 10 L20 80 L80 80 Z" fill="${color}" stroke="#333" stroke-width="2"/>
                <!-- Hat brim -->
                <ellipse cx="50" cy="80" rx="30" ry="8" fill="#333"/>
                <!-- Decorative stripes -->
                <path d="M25 35 L75 35" stroke="white" stroke-width="2" opacity="0.8"/>
                <path d="M30 50 L70 50" stroke="white" stroke-width="2" opacity="0.8"/>
                <path d="M35 65 L65 65" stroke="white" stroke-width="2" opacity="0.8"/>
                <!-- Pom-pom on top -->
                <circle cx="50" cy="10" r="6" fill="white" stroke="#333" stroke-width="1"/>
                <circle cx="50" cy="10" r="3" fill="${color}"/>
            </svg>
        `;
    }
}

// Add reduced motion support
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('scroll-behavior', 'auto');
}

// Listen for changes in motion preference
prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('scroll-behavior', 'auto');
    } else {
        document.documentElement.style.setProperty('scroll-behavior', 'smooth');
    }
});

class ContributionGraph {
    constructor(username) {
        this.username = username;
        this.container = document.getElementById('github-contributions');
        this.cacheKey = `github-contrib-${username}`;
        this.cacheExpiry = 60 * 60 * 1000; // 1 hour
        this.allData = null;

        if (this.container) {
            this.fetchData();
        }
    }

    async fetchData() {
        // Check cache first
        const cached = this.getFromCache();
        if (cached) {
            console.log('Using cached contribution data');
            this.allData = cached;
            this.renderWithYearSelector(cached);
            return;
        }

        const endpoint = `https://github-contributions-api.jogruber.de/v4/${this.username}`;
        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
            const data = await response.json();

            // The API returns a flat array of contributions, we need to transform it into weeks
            let contributions = [];
            if (Array.isArray(data.contributions)) {
                contributions = data.contributions;
            } else if (data.total && typeof data.total === 'object') {
                // Handle format with years
                const years = Object.keys(data.total).sort().reverse();
                if (years.length > 0 && data.contributions) {
                    contributions = data.contributions;
                }
            } else {
                throw new Error('Unexpected data format');
            }

            // Store full data
            this.allData = { contributions, total: data.total, fetchTime: Date.now() };
            this.saveToCache(this.allData);

            this.renderWithYearSelector(this.allData);
        } catch (error) {
            this.renderError(error);
        }
    }

    getFromCache() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;

            const data = JSON.parse(cached);
            const age = Date.now() - data.fetchTime;

            if (age < this.cacheExpiry) {
                return data;
            }

            // Cache expired
            localStorage.removeItem(this.cacheKey);
            return null;
        } catch (error) {
            console.error('Cache error:', error);
            return null;
        }
    }

    saveToCache(data) {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to cache data:', error);
        }
    }

    renderWithYearSelector(data) {
        // Filter for 2025 only
        const year2025Contributions = data.contributions.filter(c => c.date.startsWith('2025'));

        // Transform into weeks structure
        const weeks = this.transformToWeeks(year2025Contributions);
        this.renderGrid(weeks);
    }

    transformToWeeks(contributions) {
        // Create a map of date -> count for quick lookup
        const contributionMap = {};
        contributions.forEach(c => {
            contributionMap[c.date] = c.count || 0;
        });

        // Use 2025 calendar year
        const startDate = new Date('2025-01-01');
        const endDate = new Date(); // Today

        // Start from the first Sunday before or on Jan 1, 2025
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek); // Go back to Sunday

        // Build weeks array
        const weeks = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const week = { days: [] };

            // Add 7 days for this week
            for (let i = 0; i < 7; i++) {
                const dateString = currentDate.toISOString().split('T')[0];
                const count = contributionMap[dateString] || 0;

                week.days.push({
                    date: dateString,
                    count: count
                });

                currentDate.setDate(currentDate.getDate() + 1);
            }

            weeks.push(week);
        }

        return weeks;
    }

    renderGrid(weeks) {
        this.container.innerHTML = '';

        // Calculate total contributions for 2025
        let totalContributions = 0;
        weeks.forEach(week => {
            week.days.forEach(day => {
                totalContributions += day.count;
            });
        });

        // Show total for 2025
        const totalText = document.createElement('div');
        totalText.className = 'contrib-total';
        totalText.textContent = `${totalContributions} contributions in 2025`;
        totalText.style.marginBottom = '1rem';
        this.container.appendChild(totalText);

        // Add month labels
        const monthLabels = this.buildMonthLabels(weeks);
        this.container.appendChild(monthLabels);

        // Create container for weekday labels and grid
        const graphContainer = document.createElement('div');
        graphContainer.className = 'contrib-graph-container';

        // Add weekday labels
        const weekdayLabels = this.buildWeekdayLabels();
        graphContainer.appendChild(weekdayLabels);

        // Add grid
        const grid = document.createElement('div');
        grid.className = 'contrib-grid';

        let cellIndex = 0;
        weeks.forEach((week) => {
            const column = document.createElement('div');
            column.className = 'contrib-week';
            week.days.forEach((day) => {
                const cell = document.createElement('span');
                cell.className = `contrib-day ${this.getLevelClass(day.count)}`;
                cell.title = `${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`;

                // Stagger the animation
                cell.style.animationDelay = `${cellIndex * 0.001}s`;
                cellIndex++;

                column.appendChild(cell);
            });
            grid.appendChild(column);
        });

        graphContainer.appendChild(grid);
        this.container.appendChild(graphContainer);
        this.container.appendChild(this.buildLegend());
    }

    buildWeekdayLabels() {
        const weekdaysContainer = document.createElement('div');
        weekdaysContainer.className = 'contrib-weekdays';

        const days = ['Mon', '', 'Wed', '', 'Fri', '', '']; // Show Mon, Wed, Fri only
        days.forEach(day => {
            const label = document.createElement('span');
            label.className = 'contrib-weekday-label';
            label.textContent = day;
            weekdaysContainer.appendChild(label);
        });

        return weekdaysContainer;
    }

    buildMonthLabels(weeks) {
        const monthsContainer = document.createElement('div');
        monthsContainer.className = 'contrib-months';

        let currentMonth = '';
        let monthStartIndex = 0;
        const cellWidth = 11;
        const cellGap = 3;

        weeks.forEach((week, weekIndex) => {
            const firstDay = week.days[0];
            if (!firstDay) return;

            const date = new Date(firstDay.date);
            const monthName = date.toLocaleDateString('en-GB', { month: 'short' });

            if (monthName !== currentMonth && weekIndex > 0) {
                // Calculate pixel position for previous month label
                const leftPosition = monthStartIndex * (cellWidth + cellGap);

                // Only add if there's enough space (at least 2 weeks)
                if (weekIndex - monthStartIndex >= 2) {
                    const monthLabel = document.createElement('span');
                    monthLabel.className = 'contrib-month-label';
                    monthLabel.textContent = currentMonth;
                    monthLabel.style.left = `${leftPosition}px`;
                    monthsContainer.appendChild(monthLabel);
                }

                monthStartIndex = weekIndex;
                currentMonth = monthName;
            } else if (weekIndex === 0) {
                currentMonth = monthName;
            }
        });

        // Add the last month
        const leftPosition = monthStartIndex * (cellWidth + cellGap);
        if (weeks.length - monthStartIndex >= 2) {
            const monthLabel = document.createElement('span');
            monthLabel.className = 'contrib-month-label';
            monthLabel.textContent = currentMonth;
            monthLabel.style.left = `${leftPosition}px`;
            monthsContainer.appendChild(monthLabel);
        }

        return monthsContainer;
    }

    buildLegend() {
        const legend = document.createElement('div');
        legend.className = 'contrib-legend';

        const lessLabel = document.createElement('span');
        lessLabel.className = 'contrib-legend-label';
        lessLabel.textContent = 'Less';
        legend.appendChild(lessLabel);

        const swatches = document.createElement('div');
        swatches.className = 'contrib-legend-swatches';
        for (let level = 0; level <= 4; level++) {
            const swatch = document.createElement('span');
            swatch.className = `contrib-day level-${level}`;
            swatches.appendChild(swatch);
        }
        legend.appendChild(swatches);

        const moreLabel = document.createElement('span');
        moreLabel.className = 'contrib-legend-label';
        moreLabel.textContent = 'More';
        legend.appendChild(moreLabel);

        return legend;
    }

    getLevelClass(count) {
        if (count === 0) return 'level-0';
        if (count < 3) return 'level-1';
        if (count < 6) return 'level-2';
        if (count < 10) return 'level-3';
        return 'level-4';
    }

    renderError(error) {
        console.error('Contribution graph error:', error);
        this.container.innerHTML = '<p style="font-size:0.85rem;opacity:0.8;">Unable to load contributions right now.</p>';
    }
}
