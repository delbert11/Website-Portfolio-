// Global variables
let typingTimeout;
let observerInitialized = false;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    initializeNavigation();
    initializeTypingEffect();
    initializeScrollAnimations();
    initializeSkillBars();
    initializePortfolioFilters();
    initializeContactForm();
    initializeModal();
    initializeCounterAnimation();
    
    // Add smooth scrolling to all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('nav-menu');
    const navHamburger = document.getElementById('nav-hamburger');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navHamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navHamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navHamburger.classList.remove('active');
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            navbar.style.background = 'hsla(var(--surface) / 0.95)';
            navbar.style.boxShadow = '0 2px 20px hsla(var(--shadow))';
        } else {
            navbar.style.background = 'hsla(var(--surface) / 0.9)';
            navbar.style.boxShadow = 'none';
        }

        // Update active navigation link based on scroll position
        updateActiveNavLink();
        
        lastScrollTop = scrollTop;
    });
}

// Update active navigation link based on current section
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 200; // Offset for better detection

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Typing effect for hero section
function initializeTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const texts = [
        "Hello, I'm Delbert Arnon",
        "I'm a Developer",
        "I'm a Designer",
        "I Create Digital Solutions"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 150;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next text
        }

        typingTimeout = setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
}

// Scroll animations using Intersection Observer
function initializeScrollAnimations() {
    if (observerInitialized) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger skill bar animations when skills section is visible
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
                
                // Trigger counter animations when about section is visible
                if (entry.target.classList.contains('about')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Add animation classes and observe elements
    const animatedElements = document.querySelectorAll('.section-header, .about-content, .skills-content, .portfolio-grid, .contact-content');
    
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Animate feature items with stagger effect
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.classList.add('fade-in');
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    // Animate portfolio items with stagger effect
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        item.classList.add('fade-in');
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    observerInitialized = true;
}

// Initialize skill bars
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });
}

// Animate skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        const targetWidth = bar.getAttribute('data-width') + '%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, index * 200);
    });
}

// Portfolio filter functionality
function initializePortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact form handling
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Show success message
                showNotification('Message sent successfully!', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });

        // Add input validation feedback
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
    }
}

// Input validation
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    
    // Remove existing error states
    input.classList.remove('error');
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validate based on input type
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        showInputError(input, 'This field is required');
    } else if (input.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        showInputError(input, 'Please enter a valid email address');
    }
    
    return isValid;
}

// Show input error
function showInputError(input, message) {
    input.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'hsl(var(--accent-color))';
    errorDiv.style.fontSize = 'var(--font-size-sm)';
    errorDiv.style.marginTop = 'var(--spacing-xs)';
    
    input.parentNode.appendChild(errorDiv);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'hsl(120 50% 50%)' : 'hsl(var(--primary-color))',
        color: 'hsl(var(--surface))',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 4px 20px hsla(var(--shadow))',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        animation: 'slideInRight 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'inherit';
    closeBtn.style.fontSize = '18px';
    closeBtn.style.cursor = 'pointer';
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = modal.querySelector('.modal-close');
    
    // Close modal functionality
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Open project modal
function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    
    // Project data
    const projects = {
        project1: {
            title: 'E-Commerce Platform',
            description: 'A comprehensive e-commerce solution built with modern technologies. Features include user authentication, product catalog, shopping cart, payment processing, and admin dashboard.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'AWS'],
            features: [
                'Responsive design for all devices',
                'Secure payment processing',
                'Real-time inventory management',
                'Advanced search and filtering',
                'User reviews and ratings'
            ],
            challenges: 'The main challenge was implementing a scalable architecture that could handle high traffic during peak shopping seasons while maintaining fast load times.',
            outcome: 'Successfully launched and achieved 99.9% uptime with 40% increase in user engagement.'
        },
        project2: {
            title: 'Task Management App',
            description: 'A cross-platform mobile application designed to boost productivity through intelligent task organization and team collaboration features.',
            technologies: ['React Native', 'Firebase', 'Redux', 'Push Notifications'],
            features: [
                'Cross-platform compatibility',
                'Real-time synchronization',
                'Team collaboration tools',
                'Smart notifications',
                'Offline functionality'
            ],
            challenges: 'Implementing offline-first architecture while ensuring seamless data synchronization across devices was technically challenging.',
            outcome: 'App reached 10,000+ downloads within first month with 4.8-star rating on app stores.'
        },
        project3: {
            title: 'Brand Identity Design',
            description: 'Complete brand identity and design system for a tech startup, including logo design, color palette, typography, and UI component library.',
            technologies: ['Figma', 'Adobe Creative Suite', 'Design Tokens', 'Style Guide'],
            features: [
                'Comprehensive brand guidelines',
                'Scalable design system',
                'Component library',
                'Accessibility compliance',
                'Multi-platform consistency'
            ],
            challenges: 'Creating a brand identity that would appeal to both technical and non-technical audiences while maintaining professionalism.',
            outcome: 'Brand identity helped increase company recognition by 60% and improved user engagement metrics.'
        },
        project4: {
            title: 'Analytics Dashboard',
            description: 'Real-time data visualization platform that transforms complex datasets into actionable insights through interactive charts and reports.',
            technologies: ['Vue.js', 'D3.js', 'Express.js', 'WebSocket', 'Chart.js'],
            features: [
                'Real-time data updates',
                'Interactive visualizations',
                'Custom report generation',
                'Data export capabilities',
                'Role-based access control'
            ],
            challenges: 'Processing and visualizing large datasets in real-time while maintaining smooth user interactions required optimization.',
            outcome: 'Reduced data analysis time by 70% and improved decision-making speed for stakeholders.'
        }
    };
    
    const project = projects[projectId];
    if (!project) return;
    
    modalBody.innerHTML = `
        <h2>${project.title}</h2>
        <p class="project-description">${project.description}</p>
        
        <h3>Technologies Used</h3>
        <div class="tech-tags">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        
        <h3>Key Features</h3>
        <ul class="feature-list">
            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        
        <h3>Challenges & Solutions</h3>
        <p>${project.challenges}</p>
        
        <h3>Results</h3>
        <p class="project-outcome">${project.outcome}</p>
    `;
    
    // Add styles to modal content
    const style = document.createElement('style');
    style.textContent = `
        .project-description {
            font-size: var(--font-size-lg);
            margin-bottom: var(--spacing-xl);
            color: hsl(var(--text-secondary));
        }
        
        .tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: var(--spacing-xs);
            margin-bottom: var(--spacing-xl);
        }
        
        .tech-tag {
            padding: var(--spacing-xs) var(--spacing-sm);
            background: hsl(var(--primary-color));
            color: hsl(var(--surface));
            border-radius: var(--radius-sm);
            font-size: var(--font-size-sm);
            font-weight: 500;
        }
        
        .feature-list {
            margin-bottom: var(--spacing-xl);
            padding-left: var(--spacing-lg);
        }
        
        .feature-list li {
            margin-bottom: var(--spacing-xs);
            color: hsl(var(--text-secondary));
        }
        
        .project-outcome {
            background: hsl(var(--background));
            padding: var(--spacing-lg);
            border-radius: var(--radius-md);
            border-left: 4px solid hsl(var(--primary-color));
            font-weight: 500;
            margin-bottom: 0;
        }
        
        #modal-body h3 {
            color: hsl(var(--text-primary));
            margin: var(--spacing-xl) 0 var(--spacing-md) 0;
            font-size: var(--font-size-xl);
        }
        
        #modal-body h3:first-of-type {
            margin-top: var(--spacing-lg);
        }
    `;
    
    if (!document.querySelector('#modal-styles')) {
        style.id = 'modal-styles';
        document.head.appendChild(style);
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Counter animation for statistics
function initializeCounterAnimation() {
    let countersAnimated = false;
    
    window.animateCounters = function() {
        if (countersAnimated) return;
        
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
        
        countersAnimated = true;
    };
}

// Utility function to throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .error {
        border-color: hsl(var(--accent-color)) !important;
        box-shadow: 0 0 0 3px hsla(var(--accent-color) / 0.1) !important;
    }
`;

document.head.appendChild(animationStyles);

// Performance optimization: Lazy load images if any are added
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLazyLoading);
} else {
    initializeLazyLoading();
}

// Add smooth scrolling polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@1.4.10/src/smoothscroll.js';
    document.head.appendChild(script);
}

// Export functions for potential external use
window.portfolioApp = {
    openProjectModal,
    closeModal,
    showNotification,
    validateInput
};
