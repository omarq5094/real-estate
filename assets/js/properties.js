const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2yrRpyHGbd4fOoEaW995KltoXHLpozI9UKNKt2dITY131GAbNqg2CWAcjJ9Nt52u2j4847eOYie_J/pub?output=csv";

const WHATSAPP_NUMBER = "966556104669";

let allProperties = [];

document.addEventListener("DOMContentLoaded", () => {
  const propertiesContainer = document.getElementById("propertiesContainer");
  const loadingMessage = document.getElementById("loadingMessage");
  const errorMessage = document.getElementById("errorMessage");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  async function loadProperties() {
    try {
      const response = await fetch(SHEET_CSV_URL);

      if (!response.ok) {
        throw new Error("فشل تحميل البيانات");
      }

      const csvText = await response.text();
      const rows = parseCSV(csvText);

      allProperties = rows
        .map(mapRowToProperty)
        .filter((property) => isVisible(property));

      renderProperties(allProperties);

      if (loadingMessage) {
        loadingMessage.classList.add("hidden");
      }
    } catch (error) {
      console.error(error);

      if (loadingMessage) {
        loadingMessage.classList.add("hidden");
      }

      if (errorMessage) {
        errorMessage.classList.remove("hidden");
      }
    }
  }

  function parseCSV(csvText) {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    return lines.slice(1).map((line) => {
      const values = line.split(",");
      const row = {};

      headers.forEach((header, index) => {
        row[header] = (values[index] || "").trim();
      });

      return row;
    });
  }

  function mapRowToProperty(row) {
    return {
      id: row.id || "",
      title: row.title || "بدون عنوان",
      category: row.category || "",
      city: row.city || "",
      district: row.district || "",
      area: row.area || "",
      length: row.length || "",
      width: row.width || "",
      price: row.price || "",
      price_type: row.price_type || "price",
      description: row.description || "",
      is_visible: row.is_visible || "FALSE",
    };
  }

  function isVisible(property) {
    return String(property.is_visible).trim().toUpperCase() === "TRUE";
  }

  function formatPrice(property) {
    if (property.price_type === "sum") {
      return "السوم";
    }

    const price = Number(property.price);

    if (!price) {
      return "غير محدد";
    }

    return price.toLocaleString("en-US") + " ريال";
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
            <h3 class="property-title">${property.title}</h3>
            <div class="property-price">${formatPrice(property)}</div>
          </div>

          <div class="property-location">
            📍 ${property.city} - ${property.district}
          </div>

          <div class="property-meta">

            <div class="meta-box">
              <span class="meta-label">المساحة</span>
              <span class="meta-value">${property.area} م²</span>
            </div>

            <div class="meta-box">
              <span class="meta-label">الأبعاد</span>
              <span class="meta-value">${property.length} × ${property.width}</span>
            </div>

          </div>

          <p class="property-description">
            ${property.description || "لا يوجد وصف إضافي."}
          </p>

          <div class="property-actions">

            <a
              class="btn btn-primary property-btn"
              href="https://wa.me/${WHATSAPP_NUMBER}?text=${getWhatsAppMessage(property)}"
              target="_blank"
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
    const searchValue = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = allProperties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchValue) ||
        property.city.toLowerCase().includes(searchValue) ||
        property.district.toLowerCase().includes(searchValue);

      const matchesCategory =
        !selectedCategory || property.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    renderProperties(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyFilters);
  }

  loadProperties();
});
