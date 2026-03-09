const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyVU8Al0Utaw9D8OECTx3fupkvi_pfbvXaZhS-G1wQ-4aQ9u4WFicRoSvfEoJoAHV1o6g/exec";

const form = document.getElementById("registerForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!phone || !password) {
    showMessage("يرجى إدخال جميع البيانات", true);
    return;
  }

  showMessage("جاري الإرسال...");

  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("password", password);

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: formData
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Response is not valid JSON:", text);
      showMessage("وصل رد غير متوقع من الخدمة", true);
      return;
    }

    if (data.success) {
      showMessage("تم التسجيل بنجاح ✅");
      form.reset();
    } else {
      showMessage(data.message || "فشل التسجيل", true);
    }

  } catch (error) {
    console.error("Fetch error:", error);
    showMessage("تعذر الاتصال بالخدمة", true);
  }
});

function showMessage(message, isError = false) {
  msg.textContent = message;
  msg.style.marginTop = "
