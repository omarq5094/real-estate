const SCRIPT_URL = "https://script.google.com/macros/library/d/1np5yhC3EIHdDisjEnZz9_dO6Ju-rf0qHiyUJx36M5GbOrZur9pkBKEwY/1";

const registerForm = document.getElementById("registerForm");
const formMessage = document.getElementById("formMessage");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!phone || !password) {
    showMessage("يرجى تعبئة جميع الحقول", true);
    return;
  }

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ phone, password }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    if (result.success) {
      showMessage("تم التسجيل بنجاح");
      registerForm.reset();
    } else {
      showMessage(result.message || "حدث خطأ أثناء التسجيل", true);
    }
  } catch (error) {
    console.error(error);
    showMessage("تعذر الاتصال بالخدمة", true);
  }
});

function showMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.classList.remove("hidden");
  formMessage.classList.toggle("error", isError);
}
