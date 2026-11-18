document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.getAttribute("data-nav") === currentPath) {
      link.classList.remove("text-gray-500", "font-medium");
      link.classList.add("text-gray-900", "font-bold");
    }
  });

  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = !mobileMenu.classList.toggle("hidden");
      menuBtn.setAttribute("aria-expanded", isOpen);
      iconOpen.classList.toggle("hidden", isOpen);
      iconClose.classList.toggle("hidden", !isOpen);
    });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  const passwordHint =
    "Use 8+ chars with uppercase, lowercase, number & special character.";

  function setError(input, errorEl, msg) {
    errorEl.textContent = msg;
    errorEl.classList.toggle("hidden", !msg);
    input.classList.toggle("border-red-600", Boolean(msg));
    input.classList.toggle("border-black", !msg);
  }

  function showToast(msg, isError = false) {
    document.getElementById("app-toast")?.remove();

    const toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = `fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold ${
      isError ? "bg-red-600 text-white" : "bg-black text-[#C2F578]"
    }`;
    toast.textContent = isError ? `✕ ${msg}` : `✓ ${msg}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3500);
  }

  async function hashPassword(str) {
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(str),
    );
    return [...new Uint8Array(buf)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // Newsletter form
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    const email = document.getElementById("newsletterEmail");
    const btn = document.getElementById("newsletterBtn");
    const err = document.getElementById("newsletterError");
    const tick = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`;

    function setSubscribed(done) {
      btn.dataset.subscribed = done;
      btn.innerHTML = done ? `<span>Subscribed</span>${tick}` : "Subscribe";
      btn.classList.toggle("bg-black", done);
      btn.classList.toggle("text-white", done);
      btn.classList.toggle("hover:bg-black/80", done);
      btn.classList.toggle("bg-[#C2F578]", !done);
      btn.classList.toggle("text-black", !done);
      btn.classList.toggle("hover:bg-[#C2F578]/80", !done);
    }

    email.addEventListener("input", () => {
      if (err) err.classList.add("hidden");
      newsletterForm.classList.remove("border-red-600");
      if (btn.dataset.subscribed === "true") setSubscribed(false);
    });

    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!emailRegex.test(email.value.trim())) {
        if (err) {
          err.textContent = "Enter a valid email address.";
          err.classList.remove("hidden");
        }
        newsletterForm.classList.add("border-red-600");
        return;
      }
      email.value = "";
      setSubscribed(true);
    });
  }

  // Login form
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

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      let ok = true;

      if (!emailRegex.test(email.value.trim())) {
        setError(email, emailErr, "Enter a valid email address.");
        ok = false;
      }
      if (!passwordRegex.test(password.value)) {
        setError(password, passwordErr, passwordHint);
        ok = false;
      }
      if (!ok) {
        showToast("Login failed. Please fix the errors.", true);
        return;
      }

      const passwordHash = await hashPassword(password.value);
      localStorage.setItem(
        "classiq_last_login",
        JSON.stringify({ email: email.value.trim(), passwordHash }),
      );

      loginForm.reset();
      showToast("Logged in successfully!");
    });
  }

  // SignUp form
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

    signupForm.addEventListener("submit", async (e) => {
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
      if (!passwordRegex.test(password.value)) {
        setError(password, passwordErr, passwordHint);
        ok = false;
      }
      if (!ok) {
        showToast("Sign up failed. Please check your inputs.", true);
        return;
      }

      const passwordHash = await hashPassword(password.value);
      const users = JSON.parse(localStorage.getItem("classiq_users") || "[]");
      users.push({
        email: email.value.trim(),
        fullname: fullname.value.trim(),
        passwordHash,
      });
      localStorage.setItem("classiq_users", JSON.stringify(users));

      signupForm.reset();
      showToast("Account created successfully!");
    });
  }
});
