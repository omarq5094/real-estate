const SCRIPT_URL = "ضع_هنا_رابطhttps://script.google.com/macros/s/AKfycbzCYY7QnQz0n4OmkUQi9_cyDUw7nTIqs2QDAIv5M01n0oPu6z7YwnpFgrg6qFK845Kexw/exec";

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
