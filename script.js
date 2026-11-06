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
