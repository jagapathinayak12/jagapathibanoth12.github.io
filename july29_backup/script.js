// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS for direct email delivery
    if (typeof emailjs !== 'undefined') {
        emailjs.init('VjN2J53Z73GRranwI'); // Public key for Jagapathi's EmailJS account
        console.log('EmailJS initialized for direct email delivery');
    }
    
    // Initialize scroll animations immediately (no loading screen)
    setTimeout(() => {
        triggerScrollAnimations();
    }, 100);

    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Initialize scroll animations
    function triggerScrollAnimations() {
        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections and animatable elements
        document.querySelectorAll('section, .skill-category, .project-card').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';
            observer.observe(element);
        });
        
        // Trigger initial animations for visible elements
        setTimeout(() => {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.style.opacity = '1';
                heroSection.style.transform = 'translateY(0)';
            }
        }, 200);
    }
});

// Contact form submission handler
async function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Get form data
    const formValues = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Validate form
    if (!validateContactForm(formValues)) {
        return;
    }
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        // Try EmailJS first for direct delivery
        if (typeof emailjs !== 'undefined') {
            await sendEmailJS(formValues);
            showFormFeedback('success', '✅ Message sent successfully! I\'ll get back to you within 24 hours.');
        } else {
            // Fallback to mailto if EmailJS not available
            await handleMailtoFallback(formValues);
        }
        
        form.reset();
        
    } catch (error) {
        console.error('EmailJS error:', error);
        
        // If EmailJS fails, fall back to mailto
        try {
            await handleMailtoFallback(formValues);
        } catch (fallbackError) {
            console.error('Fallback error:', fallbackError);
            showFormFeedback('error', 
                'Unable to send message automatically. Please email me directly at: jagapathibanoth6@gmail.com'
            );
        }
    } finally {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
}

// Validate contact form
function validateContactForm(data) {
    const errors = [];
    
    if (!data.name.trim()) errors.push('Name is required');
    if (!data.email.trim()) errors.push('Email is required');
    if (!isValidEmail(data.email)) errors.push('Please enter a valid email address');
    if (!data.subject.trim()) errors.push('Subject is required');
    if (!data.message.trim()) errors.push('Message is required');
    
    if (errors.length > 0) {
        showFormFeedback('error', errors.join(', '));
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle mailto fallback
async function handleMailtoFallback(data) {
    const subject = encodeURIComponent(`Portfolio Contact: ${data.subject}`);
    const body = encodeURIComponent(
        `Hi Jagapathi,\n\n` +
        `Someone contacted you through your portfolio website:\n\n` +
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Subject: ${data.subject}\n\n` +
        `Message:\n${data.message}\n\n` +
        `---\n` +
        `Sent from: https://jagapathinayakbanoth.info\n` +
        `Reply to: ${data.email}`
    );
    
    const mailtoLink = `mailto:jagapathibanoth6@gmail.com?subject=${subject}&body=${body}`;
    
    // Try to open mailto link
    window.open(mailtoLink, '_blank');
    
    // Show user-friendly instructions
    showFormFeedback('success', 
        `✅ Your email client should open with a pre-filled message to send to Jagapathi. ` +
        `If it doesn't open automatically, please copy your message and send it directly to: ` +
        `jagapathibanoth6@gmail.com`
    );
    
    return Promise.resolve();
}

// Send email using EmailJS (configured for direct delivery)
async function sendEmailJS(data) {
    // EmailJS configuration for Jagapathi's portfolio
    const SERVICE_ID = 'service_eevr6y9';
    const TEMPLATE_ID = 'template_vscp8xd';
    const PUBLIC_KEY = 'VjN2J53Z73GRranwI';
    
    // Initialize EmailJS if not already done
    if (window.emailjs && !window.emailjs._initialized) {
        emailjs.init(PUBLIC_KEY);
        window.emailjs._initialized = true;
    }
    
    // Check if EmailJS is available
    if (!window.emailjs) {
        throw new Error('EmailJS not loaded');
    }
    
    // Send email via EmailJS
    return emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        to_name: 'Jagapathi Nayak Banoth',
        to_email: 'jagapathibanoth6@gmail.com',
        reply_to: data.email,
        website_url: 'https://jagapathinayakbanoth.info',
        // Additional common variable names
        name: data.name,
        email: data.email,
        user_name: data.name,
        user_email: data.email,
        user_subject: data.subject,
        user_message: data.message
    });
}

// Show form feedback
function showFormFeedback(type, message) {
    // Remove any existing feedback
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `form-feedback form-feedback-${type}`;
    feedback.innerHTML = `
        <div class="feedback-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Insert feedback after the form
    const form = document.querySelector('.contact-form');
    form.parentNode.insertBefore(feedback, form.nextSibling);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 10000);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Typing animation for hero section
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
});
