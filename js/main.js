document.addEventListener("DOMContentLoaded", () => {
  // Course Enrollment Toggle (Persisted in localStorage)
  const enrollButtons = document.querySelectorAll(".enroll-btn");
  if (enrollButtons.length) {
    const enrolled = JSON.parse(
      localStorage.getItem("classiq_enrolled") || "[]",
    );

    function renderEnrollBtn(btn, isEnrolled) {
      btn.textContent = isEnrolled ? "Enrolled ✓" : "Enroll Now";
      btn.classList.toggle("bg-black", isEnrolled);
      btn.classList.toggle("text-white", isEnrolled);
      btn.classList.toggle("hover:bg-black/80", isEnrolled);
      btn.classList.toggle("bg-[#C2F578]", !isEnrolled);
      btn.classList.toggle("text-black", !isEnrolled);
      btn.classList.toggle("hover:bg-[#b5eb67]", !isEnrolled);
    }

    enrollButtons.forEach((btn) => {
      const courseId = btn.dataset.course;
      renderEnrollBtn(btn, enrolled.includes(courseId));

      btn.addEventListener("click", () => {
        const idx = enrolled.indexOf(courseId);
        if (idx === -1) {
          enrolled.push(courseId);
        } else {
          enrolled.splice(idx, 1);
        }
        localStorage.setItem("classiq_enrolled", JSON.stringify(enrolled));
        renderEnrollBtn(btn, idx === -1);
      });
    });
  }

  // Highlight active nav link
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.getAttribute("data-nav") === currentPath) {
      link.classList.remove("text-gray-500", "font-medium");
      link.classList.add("text-gray-900", "font-bold");
    }
  });

  // Mobile Hamburger Toggle
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isExpanded = !mobileMenu.classList.toggle("hidden");
      menuBtn.setAttribute("aria-expanded", String(isExpanded));
      iconOpen.classList.toggle("hidden", isExpanded);
      iconClose.classList.toggle("hidden", !isExpanded);
    });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  function setError(input, errorEl, msg) {
    errorEl.textContent = msg;
    errorEl.classList.toggle("hidden", !msg);
    input.classList.toggle("border-red-600", Boolean(msg));
    input.classList.toggle("border-black", !msg);
  }

  // Login Form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    const email = document.getElementById("login-email");
    const emailErr = document.getElementById("login-email-error");
    const password = document.getElementById("login-password");
    const passwordErr = document.getElementById("login-password-error");

    email.addEventListener("input", () => setError(email, emailErr, ""));
    password.addEventListener("input", () =>
      setError(password, passwordErr, ""),
    );

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;

      if (!emailRegex.test(email.value.trim())) {
        setError(email, emailErr, "Enter a valid email address.");
        ok = false;
      }

      if (!password.value) {
        setError(password, passwordErr, "Password is required.");
        ok = false;
      }

      if (ok) window.location.href = "index.html";
    });
  }

  // SignUp Form
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    const email = document.getElementById("signup-email");
    const emailErr = document.getElementById("signup-email-error");
    const fullname = document.getElementById("signup-fullname");
    const fullnameErr = document.getElementById("signup-fullname-error");
    const password = document.getElementById("signup-password");
    const passwordErr = document.getElementById("signup-password-error");

    email.addEventListener("input", () => setError(email, emailErr, ""));
    fullname.addEventListener("input", () =>
      setError(fullname, fullnameErr, ""),
    );
    password.addEventListener("input", () =>
      setError(password, passwordErr, ""),
    );

    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;

      if (!emailRegex.test(email.value.trim())) {
        setError(email, emailErr, "Enter a valid email address.");
        ok = false;
      }

      if (fullname.value.trim().length < 3) {
        setError(
          fullname,
          fullnameErr,
          "Full name must be at least 3 characters.",
        );
        ok = false;
      }

      if (password.value.length < 8 || !/\d/.test(password.value)) {
        setError(
          password,
          passwordErr,
          "Use 8+ characters with at least one number.",
        );
        ok = false;
      }

      if (ok) window.location.href = "login.html";
    });
  }
});
