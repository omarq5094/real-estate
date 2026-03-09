const SCRIPT_URL = window.APP_CONFIG.SCRIPT_URL;
const WHATSAPP_NUMBER = "966556104669";

let allProperties = [];

document.addEventListener("DOMContentLoaded", () => {
  const propertiesContainer = document.getElementById("propertiesContainer");
  const loadingMessage = document.getElementById("loadingMessage");
  const errorMessage = document.getElementById("errorMessage");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("show");
    });
  }

  async function loadProperties() {
    try {
      if (loadingMessage) {
        loadingMessage.classList.remove("hidden");
      }

      if (errorMessage) {
        errorMessage.classList.add("hidden");
      }

      if (!SCRIPT_URL) {
        throw new Error("SCRIPT_URL غير موجود في APP_CONFIG");
      }

      const response = await fetch(SCRIPT_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`فشل تحميل البيانات: ${response.status}`);
      }

      const data = await response.json();
      console.log("Properties API Response:", data);

      let properties = [];

      if (Array.isArray(data)) {
        properties = data;
      } else if (data && Array.isArray(data.data)) {
        properties = data.data;
      } else {
        console.warn("API did not return an array:", data);
        properties = [];
      }

      allProperties = properties
        .map(mapProperty)
        .filter((property) => isVisible(property));

      renderProperties(allProperties);

      if (loadingMessage) {
        loadingMessage.classList.add("hidden");
      }
    } catch (error) {
      console.error("Load Properties Error:", error);

      if (loadingMessage) {
        loadingMessage.classList.add("hidden");
      }

      if (errorMessage) {
        errorMessage.classList.remove("hidden");
      }
    }
  }

  function mapProperty(row) {
    return {
      id: String(row.id || "").trim(),
      title: String(row.title || "بدون عنوان").trim(),
      category: String(row.category || "غير محدد").trim(),
      city: String(row.city || "غير محدد").trim(),
      district: String(row.district || "غير محدد").trim(),
      area: String(row.area || "-").trim(),
      length: String(row.length || "-").trim(),
      width: String(row.width || "-").trim(),
      price: String(row.price || "").trim(),
      price_type: String(row.price_type || "price").trim(),
      description: String(row.description || "").trim(),
      is_visible: String(row.is_visible || "FALSE").trim(),
    };
  }

  function isVisible(property) {
    return String(property.is_visible || "").trim().toUpperCase() === "TRUE";
  }

  function formatPrice(property) {
    if (String(property.price_type || "").toLowerCase() === "sum") {
      return "السوم";
    }

    const numericPrice = Number(
      String(property.price || "").replace(/,/g, "")
    );

    if (!numericPrice) {
      return "غير محدد";
    }

    return `${numericPrice.toLocaleString("en-US")} ريال`;
  }

  function getWhatsAppMessage(property) {
    return encodeURIComponent(
      `مرحبًا، لدي اهتمام بهذا العقار:
${property.title}
المدينة: ${property.city}
الحي: ${property.district}
السعر: ${formatPrice(property)}`
    );
  }

  function createPropertyCard(property) {
    return `
      <article class="property-card">
        <div class="property-content">
          <div class="property-head">
            <h3 class="property-title">${escapeHtml(property.title)}</h3>
            <div class="property-price">${formatPrice(property)}</div>
          </div>

          <div class="property-location">
            📍 ${escapeHtml(property.city)} - ${escapeHtml(property.district)}
          </div>

          <div class="property-meta">
            <div class="meta-box">
              <span class="meta-label">المساحة</span>
              <span class="meta-value">${escapeHtml(property.area)} م²</span>
            </div>

            <div class="meta-box">
              <span class="meta-label">الأبعاد</span>
              <span class="meta-value">${escapeHtml(property.length)} × ${escapeHtml(property.width)}</span>
            </div>
          </div>

          <p class="property-description">
            ${escapeHtml(property.description || "لا يوجد وصف إضافي.")}
          </p>

          <div class="property-actions">
            <a
              class="btn btn-primary property-btn"
              href="https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppMessage(property)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              واتساب
            </a>

            <a
              class="btn btn-secondary property-btn"
              href="tel:0556104669"
            >
              اتصال
            </a>
          </div>
        </div>
      </article>
    `;
  }

  function renderProperties(properties) {
    if (!propertiesContainer) {
      console.error("propertiesContainer غير موجود في الصفحة");
      return;
    }

    if (!properties.length) {
      propertiesContainer.innerHTML = `
        <div class="empty-box">
          لا توجد عقارات مطابقة حاليًا.
        </div>
      `;
      return;
    }

    propertiesContainer.innerHTML = properties
      .map((property) => createPropertyCard(property))
      .join("");
  }

  function applyFilters() {
    const searchValue = String(searchInput?.value || "").trim().toLowerCase();
    const selectedCategory = String(categoryFilter?.value || "").trim();

    const filtered = allProperties.filter((property) => {
      const matchesSearch =
        String(property.title || "").toLowerCase().includes(searchValue) ||
        String(property.city || "").toLowerCase().includes(searchValue) ||
        String(property.district || "").toLowerCase().includes(searchValue);

      const matchesCategory =
        !selectedCategory || property.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    renderProperties(filtered);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyFilters);
  }

  loadProperties();
});
