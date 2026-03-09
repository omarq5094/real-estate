const SCRIPT_URL = window.APP_CONFIG.SCRIPT_URL;

const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!phone || !password) {
      showMessage("يرجى إدخال رقم الجوال وكلمة المرور", true);
      return;
    }

    showMessage("جاري التحقق...");

    const formData = new URLSearchParams();
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("action", "login");

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        showMessage("وصل رد غير متوقع من الخدمة", true);
        return;
      }

      if (data.success) {
        localStorage.setItem("userPhone", phone);
        window.location.href = "dashboard.html";
      } else {
        showMessage(data.message || "رقم الجوال أو كلمة المرور غير صحيحة", true);
      }
    } catch (error) {
      console.error("Login fetch error:", error);
      showMessage("خطأ في الاتصال", true);
    }
  });
}

function showMessage(message, isError = false) {
  msg.textContent = message;
  msg.style.marginTop = "15px";
  msg.style.padding = "12px 14px";
  msg.style.borderRadius = "12px";
  msg.style.fontWeight = "700";
  msg.style.background = isError
    ? "rgba(255, 107, 107, 0.12)"
    : "rgba(37, 230, 165, 0.12)";
  msg.style.border = isError
    ? "1px solid rgba(255, 107, 107, 0.35)"
    : "1px solid rgba(37, 230, 165, 0.35)";
  msg.style.color = isError ? "#ffd6d6" : "#dffff5";
}
