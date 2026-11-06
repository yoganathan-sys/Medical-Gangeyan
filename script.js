/* =====================================================
   MOBILE MENU
===================================================== */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {

    menuBtn.addEventListener("click", () => {

        nav.classList.toggle("show");

    });

}


/* =====================================================
   CLOSE MOBILE MENU
===================================================== */

document.querySelectorAll(".nav a").forEach(link => {

    link.addEventListener("click", () => {

        if (nav) {
            nav.classList.remove("show");
        }

    });

});


/* =====================================================
   PRESCRIPTION WHATSAPP ENQUIRY
===================================================== */

function prescriptionEnquiry() {

    const whatsappNumber = "919994260284";

    const message =
        "Hello, I would like to enquire about a prescription. Please let me know how I can proceed.";

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");

}


/* =====================================================
   CLOSE MENU WHEN CLICKING OUTSIDE
===================================================== */

document.addEventListener("click", (event) => {

    if (!nav || !menuBtn) {
        return;
    }

    if (
        !nav.contains(event.target) &&
        !menuBtn.contains(event.target)
    ) {

        nav.classList.remove("show");

    }

});

// ========================================
// CONTACT FORM - WHATSAPP SUBMISSION
// ========================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !mobile || !subject || !message) {
            alert("Please fill in all required fields.");
            return;
        }

        const phonePattern = /^[0-9+\-\s()]{10,16}$/;

        if (!phonePattern.test(mobile)) {
            alert("Please enter a valid mobile number.");
            return;
        }

        const whatsappMessage =
`Hello Sri Siva Medicals,

I would like to make an enquiry.

Full Name: ${name}
Mobile Number: ${mobile}
Email Address: ${email || "Not provided"}

Subject: ${subject}

Message:
${message}

Thank you.`;

        const whatsappURL =
            "https://wa.me/919994260284?text=" +
            encodeURIComponent(whatsappMessage);

        window.open(whatsappURL, "_blank");
    });
}

/* =====================================================
   PROGRESSIVE WEB APP (PWA) INTEGRATION
   - Service Worker Registration
   - Native Install Prompt handling (beforeinstallprompt)
   - iOS Safari Step-by-Step Installation Modal
   - Standalone Mode Detection
   - User Dismissal Snooze (24hr)
   - Zero Interference with Existing Page Functions
===================================================== */

(function () {
    // 1. Register Service Worker with error handling
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('./service-worker.js', { scope: './' })
                .then((registration) => {
                    console.log('[PWA] Service Worker registered with scope:', registration.scope);
                })
                .catch((error) => {
                    console.warn('[PWA] Service Worker registration failed:', error);
                });
        });
    }

    // 2. Detection utilities
    function isStandaloneMode() {
        return (
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true ||
            document.referrer.includes('android-app://')
        );
    }

    function isDismissedRecently() {
        try {
            const dismissedAt = localStorage.getItem('sri_siva_pwa_dismissed');
            if (!dismissedAt) return false;
            const cooldownMs = 24 * 60 * 60 * 1000; // 24 hours
            return Date.now() - parseInt(dismissedAt, 10) < cooldownMs;
        } catch (e) {
            return false;
        }
    }

    function markDismissed() {
        try {
            localStorage.setItem('sri_siva_pwa_dismissed', Date.now().toString());
        } catch (e) {}
    }

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // DOM Elements
    const banner = document.getElementById('pwaInstallBanner');
    const installBtn = document.getElementById('pwaInstallBtn');
    const installBtnText = document.getElementById('pwaInstallBtnText');
    const closeBtn = document.getElementById('pwaCloseBtn');
    const iosModal = document.getElementById('pwaIosModal');
    const iosCloseBtn = document.getElementById('pwaIosCloseBtn');
    const iosGotItBtn = document.getElementById('pwaIosGotItBtn');
    const iosBackdrop = document.getElementById('pwaIosBackdrop');

    let deferredInstallPrompt = null;

    function showBanner() {
        if (!banner || isStandaloneMode() || isDismissedRecently()) {
            return;
        }
        banner.classList.add('pwa-visible');
        banner.setAttribute('aria-hidden', 'false');
        document.body.classList.add('pwa-banner-active');
    }

    function hideBanner(userDismissed = false) {
        if (!banner) return;
        banner.classList.remove('pwa-visible');
        banner.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('pwa-banner-active');
        if (userDismissed) {
            markDismissed();
        }
    }

    // iOS Modal handlers
    function openIosModal() {
        if (!iosModal) return;
        iosModal.classList.add('pwa-modal-open');
        iosModal.setAttribute('aria-hidden', 'false');
    }

    function closeIosModal() {
        if (!iosModal) return;
        iosModal.classList.remove('pwa-modal-open');
        iosModal.setAttribute('aria-hidden', 'true');
    }

    // 3. Android / Chromium: capture beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (event) => {
        // Prevent default browser mini-infobar
        event.preventDefault();
        deferredInstallPrompt = event;

        // Show our professional native-style banner
        showBanner();
    });

    // 4. Handle successful installation
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] Sri Siva Medicals was installed successfully!');
        deferredInstallPrompt = null;
        hideBanner(false);
        try {
            localStorage.setItem('sri_siva_pwa_installed', 'true');
        } catch (e) {}
    });

    // 5. Install Button Click Handler
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (isIOSDevice) {
                // On iOS Safari, show step-by-step instructions
                openIosModal();
                return;
            }

            if (!deferredInstallPrompt) {
                return;
            }

            // Trigger the native browser prompt
            deferredInstallPrompt.prompt();

            try {
                const choiceResult = await deferredInstallPrompt.userChoice;
                if (choiceResult && choiceResult.outcome === 'accepted') {
                    console.log('[PWA] User accepted installation prompt');
                    hideBanner(false);
                } else {
                    console.log('[PWA] User dismissed installation prompt');
                    hideBanner(true);
                }
            } catch (err) {
                console.warn('[PWA] Error during install choice:', err);
            }
            deferredInstallPrompt = null;
        });
    }

    // 6. Close Button Click Handler
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hideBanner(true);
        });
    }

    // 7. iOS Modal Event Listeners
    if (iosCloseBtn) iosCloseBtn.addEventListener('click', closeIosModal);
    if (iosGotItBtn) iosGotItBtn.addEventListener('click', closeIosModal);
    if (iosBackdrop) iosBackdrop.addEventListener('click', closeIosModal);

    // 8. iOS Safari Detection & Banner display
    if (isIOSDevice && !isStandaloneMode() && !isDismissedRecently()) {
        if (installBtnText) {
            installBtnText.textContent = 'How to Install';
        }
        // Small delay to let page render smoothly
        setTimeout(() => {
            showBanner();
        }, 1800);
    }
})();

