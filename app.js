// Initialize Lucide Icons on load
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Hide Preloader after page loads
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('loaded');
    }, 1200);

    // Initial setup
    setupScrollEffects();
    setupMobileMenu();
    setupIntersectionObservers();
    startTestimonialSlider();
    setupCalculators();
    generateMotivationQuote();
});

/* ==========================================================================
   Navigation and Layout Scroll Effects
   ========================================================================== */
function setupScrollEffects() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        // Toggle sticky background on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Highlight active nav item
        let currentSectionId = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Toggle icon between hamburger and cross
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });
}

/* ==========================================================================
   Scroll Animations & Counters Trigger
   ========================================================================== */
function setupIntersectionObservers() {
    // Fade-in sections on scroll
    const animElements = document.querySelectorAll('.scroll-animate');
    const animObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    animElements.forEach(element => {
        animObserver.observe(element);
    });

    // Stats Counter trigger
    const statsContainer = document.querySelector('.stats-grid');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (statsContainer) {
        counterObserver.observe(statsContainer);
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const stepTime = 30;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.innerText = target + (counter.innerText.includes('%') ? '%' : '+');
                clearInterval(timer);
            } else {
                counter.innerText = Math.floor(current) + '+';
            }
        }, stepTime);
    });
}

/* ==========================================================================
   Interactive Calculators Modules
   ========================================================================== */
let bmiUnit = 'metric';
let calUnit = 'metric';

function setupCalculators() {
    // Standard inputs validation
    const bmiInputs = document.querySelectorAll('#bmi-form input');
    const calInputs = document.querySelectorAll('#cal-form input');
    
    [...bmiInputs, ...calInputs].forEach(input => {
        input.addEventListener('input', (e) => {
            if (e.target.value < 0) e.target.value = 0;
        });
    });
}

function switchBmiUnit(unit) {
    bmiUnit = unit;
    document.getElementById('bmi-metric-btn').classList.toggle('active', unit === 'metric');
    document.getElementById('bmi-imperial-btn').classList.toggle('active', unit === 'imperial');
    
    const weightLabel = document.getElementById('bmi-weight-label');
    const weightUnit = document.getElementById('bmi-weight-unit');
    const heightLabel = document.getElementById('bmi-height-label');
    const heightUnit = document.getElementById('bmi-height-unit');
    const weightInput = document.getElementById('bmi-weight');
    const heightInput = document.getElementById('bmi-height');
    
    if (unit === 'metric') {
        weightLabel.innerText = "Weight";
        weightUnit.innerText = "kg";
        heightLabel.innerText = "Height";
        heightUnit.innerText = "cm";
        weightInput.placeholder = "e.g. 70";
        heightInput.placeholder = "e.g. 175";
    } else {
        weightLabel.innerText = "Weight";
        weightUnit.innerText = "lbs";
        heightLabel.innerText = "Height";
        heightUnit.innerText = "in";
        weightInput.placeholder = "e.g. 154";
        heightInput.placeholder = "e.g. 68";
    }
    document.getElementById('bmi-result').style.display = 'none';
    document.getElementById('bmi-form').reset();
}

function calculateBMI(event) {
    event.preventDefault();
    const weight = parseFloat(document.getElementById('bmi-weight').value);
    const height = parseFloat(document.getElementById('bmi-height').value);
    
    if (!weight || !height) return;
    
    let bmi = 0;
    if (bmiUnit === 'metric') {
        // height in cm to meters
        const heightMeters = height / 100;
        bmi = weight / (heightMeters * heightMeters);
    } else {
        bmi = (weight / (height * height)) * 703;
    }
    
    bmi = bmi.toFixed(1);
    
    // Display result
    const resultBox = document.getElementById('bmi-result');
    const bmiVal = document.getElementById('bmi-val');
    const bmiDesc = document.getElementById('bmi-desc');
    const indicator = document.getElementById('bmi-indicator');
    
    bmiVal.innerText = bmi;
    resultBox.style.display = 'block';
    
    let classification = '';
    let percentage = 0;
    
    if (bmi < 18.5) {
        classification = 'Underweight (Eat healthy surplus)';
        percentage = (bmi / 18.5) * 30; // Scale to first 30%
        indicator.style.background = '#C27063';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        classification = 'Normal Weight (Ideal health baseline)';
        percentage = 30 + ((bmi - 18.5) / 6.4) * 35; // Scale to next 35%
        indicator.style.background = '#768F6C';
    } else if (bmi >= 25 && bmi <= 29.9) {
        classification = 'Overweight (Recommend active training)';
        percentage = 65 + ((bmi - 25) / 4.9) * 20; // Scale to next 20%
        indicator.style.background = '#DE9C84';
    } else {
        classification = 'Obese Range (High priority health target)';
        percentage = 85 + Math.min(((bmi - 30) / 15) * 15, 15); // Cap indicator at 100%
        indicator.style.background = '#C27063';
    }
    
    bmiDesc.innerText = classification;
    setTimeout(() => {
        indicator.style.width = percentage + '%';
    }, 50);
}

function switchCalUnit(unit) {
    calUnit = unit;
    document.getElementById('cal-metric-btn').classList.toggle('active', unit === 'metric');
    document.getElementById('cal-imperial-btn').classList.toggle('active', unit === 'imperial');
    
    const weightLabel = document.getElementById('cal-weight-label');
    const weightUnit = document.getElementById('cal-weight-unit');
    const heightLabel = document.getElementById('cal-height-label');
    const heightUnit = document.getElementById('cal-height-unit');
    const weightInput = document.getElementById('cal-weight');
    const heightInput = document.getElementById('cal-height');
    
    if (unit === 'metric') {
        weightLabel.innerText = "Weight";
        weightUnit.innerText = "kg";
        heightLabel.innerText = "Height";
        heightUnit.innerText = "cm";
        weightInput.placeholder = "e.g. 70";
        heightInput.placeholder = "e.g. 175";
    } else {
        weightLabel.innerText = "Weight";
        weightUnit.innerText = "lbs";
        heightLabel.innerText = "Height";
        heightUnit.innerText = "in";
        weightInput.placeholder = "e.g. 154";
        heightInput.placeholder = "e.g. 68";
    }
    document.getElementById('cal-result').style.display = 'none';
    document.getElementById('cal-form').reset();
}

function calculateCalories(event) {
    event.preventDefault();
    const age = parseFloat(document.getElementById('cal-age').value);
    const weightInput = parseFloat(document.getElementById('cal-weight').value);
    const heightInput = parseFloat(document.getElementById('cal-height').value);
    const gender = document.querySelector('input[name="cal-gender"]:checked').value;
    const activity = parseFloat(document.getElementById('cal-activity').value);
    
    if (!age || !weightInput || !heightInput) return;
    
    let weightKg = weightInput;
    let heightCm = heightInput;
    
    if (calUnit === 'imperial') {
        weightKg = weightInput * 0.45359237;
        heightCm = heightInput * 2.54;
    }
    
    // Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === 'male') {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
    
    const tdee = Math.round(bmr * activity);
    const gain = tdee + 500;
    const loss = tdee - 500;
    
    document.getElementById('cal-val').innerText = tdee.toLocaleString('en-IN') + ' kcal';
    document.getElementById('cal-gain').innerText = gain.toLocaleString('en-IN') + ' kcal';
    document.getElementById('cal-loss').innerText = loss.toLocaleString('en-IN') + ' kcal';
    
    document.getElementById('cal-result').style.display = 'block';
}

/* ==========================================================================
   Checkout & Payment Simulator Modules
   ========================================================================== */
let selectedPlanDetails = {
    name: "Standard Package",
    basePrice: 2999.00
};
let activePaymentMethod = 'card';

// Mapping of Maharashtra branch addresses for receipt localization
const branchAddresses = {
    "Baner, Pune": "Shop No. 10-14, Elite High Street, Baner Road, Pune, MH 411045",
    "Kothrud, Pune": "Floor 3, Landmark Plaza, Karve Road, Kothrud, Pune, MH 411038",
    "Andheri, Mumbai": "400 Elite Towers, Link Road, Andheri West, Mumbai, MH 400053",
    "Thane, Mumbai": "Units 5-8, Viviana Commercial Complex, Thane West, Mumbai, MH 400606",
    "Nashik City": "Silver Heights, College Road, Nashik, MH 422005",
    "Nagpur Central": "G-4, Central Block, Wardha Road, Nagpur, MH 440015"
};

function updateBranchDetail() {
    // Triggered on dropdown select change
    const branch = document.getElementById('cust-branch').value;
    const addressElement = document.getElementById('receipt-branch-address');
    if (addressElement && branchAddresses[branch]) {
        addressElement.innerText = branchAddresses[branch];
    }
}

function selectPlan(name, price) {
    selectedPlanDetails.name = name;
    selectedPlanDetails.basePrice = price;
    
    // Update labels inside the Checkout section
    document.getElementById('summary-plan-name').innerText = name;
    
    let desc = '';
    if (name.includes('Basic')) {
        desc = "Basic gym access during business hours, full locker usage, and standard equipment tier.";
    } else if (name.includes('Standard')) {
        desc = "Unlimited 24/7 Access + CrossFit group floor + nutritional diet plan mapping.";
    } else if (name.includes('Premium')) {
        desc = "Full 24/7 Floor + Nutritionist Consultations + 4 Dedicated PT sessions monthly.";
    } else {
        desc = "VIP Sanctuary Access + Dedicated 1-on-1 Coaching + Bio-metrics + Spa Lounge.";
    }
    document.getElementById('summary-plan-desc').innerText = desc;
    
    updateCheckoutPrices();
}

function updateCheckoutPrices() {
    const base = selectedPlanDetails.basePrice;
    const tax = base * 0.18; // 18% GST
    const total = base + tax;
    
    document.getElementById('summary-plan-price').innerText = `₹${base.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('summary-tax-price').innerText = `₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('summary-total-price').innerText = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    // Update QR Code Dynamic Data for simulated scan (INR values)
    const upiQrImage = document.getElementById('upi-qr-image');
    if (upiQrImage) {
        const qrData = encodeURIComponent(`upi://pay?pa=aurafitness@okaxis&pn=AURA_Fitness&am=${total.toFixed(2)}&cu=INR`);
        upiQrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}`;
    }
}

function switchPaymentMethod(method) {
    activePaymentMethod = method;
    document.getElementById('pay-card-btn').classList.toggle('active', method === 'card');
    document.getElementById('pay-upi-btn').classList.toggle('active', method === 'upi');
    
    document.getElementById('card-pane').classList.toggle('active', method === 'card');
    document.getElementById('upi-pane').classList.toggle('active', method === 'upi');
    
    const cardInputs = document.querySelectorAll('#card-pane input');
    cardInputs.forEach(input => {
        input.required = (method === 'card');
    });
}

// Format card input numbers nicely
const cardInput = document.getElementById('card-num');
if (cardInput) {
    cardInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let matches = v.match(/\d{4,16}/g);
        let match = matches && matches[0] || '';
        let parts = [];
        
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        if (parts.length > 0) {
            e.target.value = parts.join(' ');
        } else {
            e.target.value = v;
        }
    });
}

function processPayment(event) {
    event.preventDefault();
    
    // Display Modal
    const modal = document.getElementById('payment-modal');
    const loader = document.getElementById('payment-loader');
    const successIcon = document.getElementById('payment-success-icon');
    const title = document.getElementById('payment-modal-title');
    const text = document.getElementById('payment-modal-text');
    
    modal.classList.add('active');
    loader.style.display = 'block';
    successIcon.style.display = 'none';
    title.innerText = "Authorizing Transaction...";
    text.innerText = "Checking billing parameters with securing systems.";
    
    // Phase 2: QR status check or card verification delay
    setTimeout(() => {
        title.innerText = "Securing Mock Funds...";
        text.innerText = "Simulating transaction settlement ledger steps.";
    }, 1500);
    
    // Phase 3: Success Visual
    setTimeout(() => {
        loader.style.display = 'none';
        successIcon.style.display = 'flex';
        title.innerText = "Payment Successful!";
        text.innerText = "Creating your digital receipt voucher.";
    }, 3200);
    
    // Phase 4: Generate Receipt
    setTimeout(() => {
        modal.classList.remove('active');
        generateReceipt();
    }, 4500);
}

function generateReceipt() {
    const name = document.getElementById('cust-name').value;
    const email = document.getElementById('cust-email').value;
    const phone = document.getElementById('cust-phone').value;
    const branch = document.getElementById('cust-branch').value;
    
    // Populate Receipt Details
    const randomTx = "TXN-" + Math.floor(100000000 + Math.random() * 900000000) + "-AUR";
    const currentDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('receipt-tx-id').innerText = randomTx;
    document.getElementById('receipt-date').innerText = currentDate;
    document.getElementById('receipt-cust-name').innerText = name;
    document.getElementById('receipt-cust-email').innerText = email;
    document.getElementById('receipt-cust-phone').innerText = phone;
    document.getElementById('receipt-branch').innerText = branch;
    
    // Update branch address on the receipt card
    if (branchAddresses[branch]) {
        document.getElementById('receipt-branch-address').innerText = branchAddresses[branch];
    }
    
    let methodString = "Credit Card (Ending in ****)";
    if (activePaymentMethod === 'upi') {
        methodString = "UPI Secure Scan Transfer (aurafitness@okaxis)";
    } else {
        const lastDigits = document.getElementById('card-num').value.slice(-4);
        if (lastDigits) {
            methodString = `Credit Card (Ending in ${lastDigits})`;
        }
    }
    document.getElementById('receipt-method').innerText = methodString;
    
    const base = selectedPlanDetails.basePrice;
    const tax = base * 0.18; // 18% GST
    const total = base + tax;
    
    document.getElementById('receipt-plan-title').innerText = selectedPlanDetails.name;
    document.getElementById('receipt-plan-price').innerText = `₹${base.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('receipt-tax-price').innerText = `₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('receipt-total-price').innerText = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    // Transition UI
    document.getElementById('checkout-container').style.display = 'none';
    const receiptWrapper = document.getElementById('receipt-container');
    receiptWrapper.style.display = 'block';
    
    // Smooth scroll down to receipt
    receiptWrapper.scrollIntoView({ behavior: 'smooth' });
}

function resetCheckout() {
    document.getElementById('payment-form').reset();
    document.getElementById('checkout-container').style.display = 'grid';
    document.getElementById('receipt-container').style.display = 'none';
    document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
}

function printReceipt() {
    window.print();
}

function downloadReceipt() {
    // Generate simple simulated download file
    const txId = document.getElementById('receipt-tx-id').innerText;
    const date = document.getElementById('receipt-date').innerText;
    const name = document.getElementById('receipt-cust-name').innerText;
    const branch = document.getElementById('receipt-branch').innerText;
    const address = document.getElementById('receipt-branch-address').innerText;
    const plan = document.getElementById('receipt-plan-title').innerText;
    const paid = document.getElementById('receipt-total-price').innerText;
    
    const receiptText = `
--------------------------------------------------
                 AURA FITNESS CLUB
                 MEMBERSHIP RECEIPT
--------------------------------------------------
Transaction ID   : ${txId}
Date             : ${date}
Customer Name    : ${name}
Preferred Branch : ${branch}
Branch Address   : ${address}
Plan Subscribed  : ${plan}
Total Paid       : ${paid}
--------------------------------------------------
Status           : PAID & COMPLETED (Simulated)
Support Helpline : support@aurafitness.com
--------------------------------------------------
Thank you for choosing AURA Fitness.
Show this mobile ticket at reception desk to activate keycard.
`;
    
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Receipt_${txId}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
}

/* ==========================================================================
   Gallery Filtering & Lightbox Modal
   ========================================================================== */
function filterGallery(category) {
    // Toggle active tab class
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(category)) {
            btn.classList.add('active');
        }
    });
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
                item.style.opacity = '1';
            }, 10);
        } else {
            item.style.transform = 'scale(0.8)';
            item.style.opacity = '0';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

function openLightbox(imgUrl, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCap = document.getElementById('lightbox-caption');
    
    lightboxImg.src = imgUrl;
    lightboxCap.innerText = caption;
    lightbox.classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

/* ==========================================================================
   Reviews slider (Carousel)
   ========================================================================== */
let currentSlideIndex = 0;
let slideInterval;

function startTestimonialSlider() {
    showSlide(currentSlideIndex);
    // Auto cycle reviews
    slideInterval = setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % 4; // 4 reviews now
        showSlide(currentSlideIndex);
    }, 6000);
}

function currentSlide(index) {
    clearInterval(slideInterval);
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
    // Restart interval
    slideInterval = setInterval(() => {
        currentSlideIndex = (currentSlideIndex + 1) % 4; // 4 reviews now
        showSlide(currentSlideIndex);
    }, 6000);
}

function showSlide(index) {
    const track = document.getElementById('testimonials-track');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!track) return;
    
    track.style.transform = `translateX(-${index * 100}%)`;
    
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
    });
}

/* ==========================================================================
   Daily Motivation Quotes
   ========================================================================== */
const motivationQuotes = [
    "\"Strength does not come from physical capacity. It comes from an indomitable will.\" — Mahatma Gandhi",
    "\"The only bad workout is the one that didn't happen.\" — Unknown",
    "\"Your body can stand almost anything. It's your mind that you have to convince.\" — Unknown",
    "\"What hurts today makes you stronger tomorrow.\" — Jay Cutler",
    "\"Success starts with self-discipline.\" — Dwayne Johnson",
    "\"No pain, no gain. Shut up and train.\" — Arnold Schwarzenegger",
    "\"Action is the foundational key to all success.\" — Pablo Picasso",
    "\"If you want something you've never had, you must be willing to do something you've never done.\" — Thomas Jefferson",
    "\"We are what we repeatedly do. Excellence, then, is not an act, but a habit.\" — Aristotle"
];

function generateMotivationQuote() {
    const textElement = document.getElementById('motivation-quote');
    if (!textElement) return;
    
    // Choose index ensuring it doesn't match the current quote if possible
    const currentQuote = textElement.innerText;
    let randomIndex = Math.floor(Math.random() * motivationQuotes.length);
    
    while (motivationQuotes[randomIndex] === currentQuote && motivationQuotes.length > 1) {
        randomIndex = Math.floor(Math.random() * motivationQuotes.length);
    }
    
    textElement.style.opacity = 0;
    setTimeout(() => {
        textElement.innerText = motivationQuotes[randomIndex];
        textElement.style.opacity = 1;
        textElement.style.transition = 'opacity 0.4s ease';
    }, 300);
}

/* ==========================================================================
   Contact Inquiry Form
   ========================================================================== */
function submitInquiryForm(event) {
    event.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    
    if (!name || !email || !subject || !message) return;
    
    // Simulate API delivery
    const status = document.getElementById('contact-form-status');
    status.style.display = 'block';
    status.classList.add('success');
    status.innerText = `Thank you, ${name}! Your inquiry regarding "${subject}" has been successfully sent. Our coaches will contact you at ${email} within 24 hours.`;
    
    // Reset form fields
    document.getElementById('contact-form').reset();
    
    // Remove status message after 8 seconds
    setTimeout(() => {
        status.style.display = 'none';
        status.classList.remove('success');
    }, 8000);
}

/* ==========================================================================
   Image Load Fail-safe Handler
   ========================================================================== */
function handleImageError(img) {
    img.style.display = 'none';
    const parent = img.parentNode;
    if (parent) {
        if (parent.classList.contains('gallery-item')) {
            parent.classList.add('image-fallback');
        } else if (parent.classList.contains('tip-img-wrapper')) {
            parent.parentNode.classList.add('image-fallback');
        }
    }
}
