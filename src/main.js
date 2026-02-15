import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Scroll Reveal Animation (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // FAQ Accordion
  const faqs = document.querySelectorAll('.faq-item');
  faqs.forEach(faq => {
    faq.querySelector('button').addEventListener('click', () => {
      faq.classList.toggle('active');
      const answer = faq.querySelector('.faq-answer');
      if (faq.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = 0;
      }
    });
  });

  // Package Selection Interaction (Mobile/Desktop)
  const packages = document.querySelectorAll('.package-card');
  packages.forEach(card => {
    card.addEventListener('click', () => {
      // Remove active state from all
      packages.forEach(p => {
        p.classList.remove('ring-4', 'ring-primary', 'bg-yellow-50', 'scale-105');
        // Reset scale transform if it was managed by hover class but we want to sticky it? 
        // Actually, let's just add a ring and slight background tint.
        // We also want to keep the hover effects independent if possible, 
        // but adding 'scale-105' manually might conflict with hover. 
        // Let's just use ring and bg.
      });

      // Add active state to clicked
      card.classList.add('ring-4', 'ring-primary', 'bg-yellow-50');
    });
  });

  // Contact Form Handling (Formspree AJAX)
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = new FormData(e.target);
      const originalBtnText = submitBtn.innerText;

      submitBtn.disabled = true;
      submitBtn.innerText = 'Verzenden...';

      try {
        const response = await fetch(e.target.action, {
          method: form.method,
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Hide the form title and description too if possible, but at least the form
          form.innerHTML = `
            <div class="py-12 text-center">
              <div class="text-6xl mb-6">✅</div>
              <h3 class="text-3xl font-bold mb-4 text-dark">Aanvraag verzonden!</h3>
              <p class="text-xl text-gray-600 mb-8">Bedankt! Ik heb je gegevens ontvangen. Je ontvangt binnen 24 uur een live demo in je mailbox.</p>
              <button onclick="window.location.reload()" class="text-primary font-bold hover:underline">Nog een aanvraag doen?</button>
            </div>
          `;
        } else {
          const errorData = await response.json();
          status.innerHTML = errorData["errors"] ? errorData["errors"].map(e => e.message).join(", ") : "Er ging iets mis.";
          status.classList.remove('hidden');
          status.classList.add('text-red-500');
        }
      } catch (error) {
        status.innerHTML = "Er ging iets mis. Probeer het later nog eens.";
        status.classList.remove('hidden');
        status.classList.add('text-red-500');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
      }
    });
  }
});
