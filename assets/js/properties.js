const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2yrRpyHGbd4fOoEaW995KltoXHLpozI9UKNKt2dITY131GAbNqg2CWAcjJ9Nt52u2j4847eOYie_J/pub?output=csv";

const WHATSAPP_NUMBER = "966556104669";

const propertiesContainer = document.getElementById("propertiesContainer");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

let allProperties = [];

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
  });
}

async function loadProperties() {
  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error("فشل تحميل ملف CSV");
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    allProperties = rows
      .map(mapRowToProperty)
      .filter((property) => isVisible(property));

    renderProperties(allProperties);
    loadingMessage.classList.add("hidden");
  } catch (error) {
    console.error("Load Error:", error);
    loadingMessage.classList.add("hidden");
    errorMessage.classList.remove("hidden");
  }
}

function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = splitCSVLine(lines[0]).map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = splitCSVLine(line);
    const rowObject = {};

    headers.forEach((header, index) => {
      rowObject[header] = (values[index] || "").trim();
    });

    return rowObject;
  });
}

function splitCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function mapRowToProperty(row) {
  return {
    id: row.id || "",
    title: row.title || "بدون عنوان",
    category: row.category || "غير محدد",
    city: row.city || "غير محدد",
    district: row.district || "غير محدد",
    area: row.area || "-",
    length: row.length || "-",
    width: row.width || "-",
    price: row.price || "0",
    price_type: row.price_type || "price",
    description: row.description || "",
    image_url: row.image_url || "",
    is_visible: row.is_visible || "FALSE",
  };
}

function isVisible(property) {
  return String(property.is_visible).toUpperCase() === "TRUE";
}

function formatPrice(property) {
  if (String(property.price_type).toLowerCase() === "sum") {
    return "السوم";
  }

  const numericPrice = Number(property.price);
  if (!numericPrice) {
    return "غير محدد";
  }

  return `${numericPrice.toLocaleString("en-US")} ريال`;
}

function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return "https://picsum.photos/900/700?random=40";
  }
  return imageUrl;
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
      <div class="property-image-wrap">
        <span class="property-badge">${property.category}</span>
        <img
          class="property-image"
          src="${getImageUrl(property.image_url)}"
          alt="${property.title}"
          onerror="this.src='https://picsum.photos/900/700?random=99'"
        />
      </div>

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

        <p class="property-description">${property.description || "لا يوجد وصف إضافي."}</p>

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
  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value.trim();

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



