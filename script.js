document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  navToggle.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const sections = document.querySelectorAll('main section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const spyObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach((link) => {
        link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
      });
    }
  },
  { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
);

sections.forEach((s) => spyObserver.observe(s));

const skillRows = document.querySelectorAll('.skill-row');

const skillObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const row = entry.target;
    const level = row.getAttribute('data-level');
    const fill = row.querySelector('.skill-fill');

    requestAnimationFrame(() => {
      fill.style.width = level + '%';
    });

    obs.unobserve(row);
  });
}, { threshold: 0.4 });

skillRows.forEach((row) => skillObserver.observe(row));

const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 8px 30px -20px rgba(0,0,0,0.6)';
  } else {
    header.style.boxShadow = 'none';
  }
});


const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function showError(fieldId, errorId, msg) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  const row = field.closest('.form-row');

  if (msg) {
    row.classList.add('has-error');
    errorEl.textContent = msg;
  } else {
    row.classList.remove('has-error');
    errorEl.textContent = '';
  }
}

function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  let ok = true;

  if (name.length < 2) {
    showError('name', 'nameError', 'Please enter your full name.');
    ok = false;
  } else {
    showError('name', 'nameError', '');
  }

  if (!looksLikeEmail(email)) {
    showError('email', 'emailError', 'Please enter a valid email address.');
    ok = false;
  } else {
    showError('email', 'emailError', '');
  }

  if (message.length < 10) {
    showError('message', 'messageError', 'Message should be at least 10 characters.');
    ok = false;
  } else {
    showError('message', 'messageError', '');
  }

  if (!ok) {
    formStatus.style.color = 'var(--danger)';
    formStatus.textContent = 'Please fix the errors above.';
    return;
  }

  formStatus.style.color = 'var(--accent-secondary)';
  formStatus.textContent = `Thanks, ${name.split(' ')[0]}! Your message has been noted — I'll get back to you soon.`;
  form.reset();

  emailjs.send(
    "pokdp63@gmail.com",
    "dp@9876",
    {
        name: name,
        email: email,
        message: message
    }
)
.then(function () {

    formStatus.style.color = "limegreen";
    formStatus.textContent =
        `Thank you ${name.split(" ")[0]}! Your message has been sent successfully.`;

    form.reset();

})
.catch(function (error) {

    console.log(error);

    formStatus.style.color = "red";
    formStatus.textContent =
        "Sorry! Something went wrong. Please try again.";

});

setTimeout(() => {
    formStatus.textContent = "";
}, 6000);
});
