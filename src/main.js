import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle (if we add a hamburger menu later, though onepager might just scroll)

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  // Trigger once on load
  revealOnScroll();

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
          form.reset();
          status.innerHTML = "Bedankt! Ik heb je aanvraag ontvangen en neem binnen 24 uur contact met je op.";
          status.classList.remove('hidden', 'text-red-500');
          status.classList.add('text-green-500');

          // Optionally hide form fields
          Array.from(form.elements).forEach(el => {
            if (el.tagName !== 'DIV') el.style.display = 'none'; // Basic hiding, or use a class
          });
          status.style.display = 'block';

        } else {
          const errorData = await response.json();
          if (Object.hasOwn(errorData, 'errors')) {
            status.innerHTML = errorData["errors"].map(error => error["message"]).join(", ");
          } else {
            status.innerHTML = "Er ging iets mis. Probeer het later nog eens of stuur direct een WhatsApp-bericht.";
          }
          status.classList.remove('hidden', 'text-green-500');
          status.classList.add('text-red-500');
          status.style.display = 'block';
        }
      } catch (error) {
        status.innerHTML = "Er ging iets mis. Probeer het later nog eens of stuur direct een WhatsApp-bericht.";
        status.classList.remove('hidden', 'text-green-500');
        status.classList.add('text-red-500');
        status.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
      }
    });
  }
});
