const products = [
  {
    id: "sea-salt-crisps",
    name: "Sea Salt Crisps",
    description: "The classic, done right",
    aliases: ["sea salt crisps", "crisps", "sea salt chips"],
    price: 149,
    category: "Chips",
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "chocolate-bites",
    name: "Chocolate Bites",
    description: "Tiny bites, major joy",
    aliases: ["chocolate bites", "chocolate", "chocolates"],
    price: 199,
    category: "Sweet",
    badge: "A LITTLE SWEET",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "berry-granola",
    name: "Berry Granola Clusters",
    description: "Crunchy, fruity, lovely",
    aliases: ["berry granola", "granola clusters", "granola"],
    price: 249,
    category: "Better-for-you",
    badge: "FEEL-GOOD PICK",
    image: "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "citrus-sparkler",
    name: "Citrus Sparkler",
    description: "A bright little pick-me-up",
    aliases: ["citrus sparkler", "sparkler"],
    price: 119,
    category: "Drinks",
    badge: "FAN FAVORITE",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "cheddar-puffs",
    name: "Cheddar Puffs",
    description: "Light, cheesy, dangerously snackable",
    aliases: ["cheddar puffs", "cheddar", "cheese puffs"],
    price: 169,
    category: "Chips",
    badge: "EXTRA CRUNCHY",
    image: "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "honey-popcorn",
    name: "Honey Popcorn",
    description: "A little sweet with a big crunch",
    aliases: ["honey popcorn", "popcorn"],
    price: 129,
    category: "Sweet",
    badge: "SWEET & SALTY",
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "trail-mix",
    name: "Sunny Trail Mix",
    description: "Nuts, fruit & happy trails",
    aliases: ["sunny trail mix", "trail mix"],
    price: 279,
    category: "Better-for-you",
    badge: "GOOD ENERGY",
    image: "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "peach-iced-tea",
    name: "Peachy Iced Tea",
    description: "Like sunshine in a bottle",
    aliases: ["peachy iced tea", "peach iced tea", "iced tea"],
    price: 129,
    category: "Drinks",
    badge: "SIP & SMILE",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=80",
  },
];

const productGrid = document.querySelector("#product-grid");
const categoryList = document.querySelector("#category-list");
const searchInput = document.querySelector("#search-input");
const resultCount = document.querySelector("#result-count");
const cartButton = document.querySelector("#cart-button");
const cartDrawer = document.querySelector("#cart-drawer");
const closeCartButton = document.querySelector("#close-cart");
const overlay = document.querySelector("#overlay");
const cartItemsElement = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartSummary = document.querySelector("#cart-summary");
const cartCount = document.querySelector("#cart-count");
const cartSubtotal = document.querySelector("#cart-subtotal");
const toast = document.querySelector("#toast");
const themeToggle = document.querySelector("#theme-toggle");
const themeColor = document.querySelector("#theme-color");
const chatLauncher = document.querySelector("#chat-launcher");
const chatPanel = document.querySelector("#chat-panel");
const chatClose = document.querySelector("#chat-close");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const chatMessages = document.querySelector("#chat-messages");
const cart = new Map();
let selectedCategory = "All";
let toastTimeout;

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  themeToggle.title = `Switch to ${isDark ? "light" : "dark"} mode`;
  themeToggle.querySelector("span").textContent = isDark ? "☀" : "☾";
  themeColor.content = isDark ? "#211f1d" : "#fffaf3";
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  resultCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "snack" : "snacks"}`;
  productGrid.innerHTML = visibleProducts.length
    ? visibleProducts.map((product) => `
      <article class="product-card">
        <div class="product-image-wrap">
          <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
          <span class="product-badge">${product.badge}</span>
          <button class="add-button" type="button" data-add="${product.id}" aria-label="Add ${product.name} to bag">+</button>
        </div>
        <div class="product-meta">
          <div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
          </div>
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>
      </article>
    `).join("")
    : '<p class="no-results">No snacks found just yet. Try another search or category.</p>';
}

function renderCart() {
  const entries = [...cart.entries()];
  const totalItems = entries.reduce((total, [, quantity]) => total + quantity, 0);
  const subtotal = entries.reduce((total, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return total + product.price * quantity;
  }, 0);

  cartCount.textContent = totalItems;
  cartEmpty.hidden = totalItems > 0;
  cartItemsElement.hidden = totalItems === 0;
  cartSummary.hidden = totalItems === 0;
  cartItemsElement.innerHTML = entries.map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return `
      <article class="cart-line">
        <img src="${product.image}" alt="" />
        <div>
          <h3 class="cart-line-name">${product.name}</h3>
          <span class="cart-line-price">${formatPrice(product.price)} each</span>
          <div class="quantity-controls" aria-label="Quantity for ${product.name}">
            <button type="button" data-quantity="${id}" data-change="-1" aria-label="Remove one ${product.name}">−</button>
            <span>${quantity}</span>
            <button type="button" data-quantity="${id}" data-change="1" aria-label="Add one ${product.name}">+</button>
          </div>
        </div>
        <span class="cart-line-total">${formatPrice(product.price * quantity)}</span>
      </article>
    `;
  }).join("");
  cartSubtotal.textContent = formatPrice(subtotal);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function setCartOpen(isOpen) {
  cartDrawer.classList.toggle("open", isOpen);
  cartDrawer.setAttribute("aria-hidden", String(!isOpen));
  overlay.hidden = !isOpen;
  document.body.classList.toggle("drawer-open", isOpen);
  if (isOpen) closeCartButton.focus();
}

categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  categoryList.querySelector(".active").classList.remove("active");
  button.classList.add("active");
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);

document.querySelectorAll("[data-nav-category]").forEach((link) => {
  link.addEventListener("click", () => {
    selectedCategory = link.dataset.navCategory;
    categoryList.querySelector(".active").classList.remove("active");
    categoryList.querySelector(`[data-category="${selectedCategory}"]`).classList.add("active");
    renderProducts();
  });
});

document.querySelector("#clear-filters").addEventListener("click", (event) => {
  event.preventDefault();
  selectedCategory = "All";
  searchInput.value = "";
  categoryList.querySelector(".active").classList.remove("active");
  categoryList.querySelector('[data-category="All"]').classList.add("active");
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = button.dataset.add;
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  const product = products.find((item) => item.id === id);
  showToast(`${product.name} added to your bag`);
});

cartItemsElement.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity]");
  if (!button) return;
  const id = button.dataset.quantity;
  const nextQuantity = (cart.get(id) || 0) + Number(button.dataset.change);
  if (nextQuantity > 0) cart.set(id, nextQuantity);
  else cart.delete(id);
  renderCart();
});

cartButton.addEventListener("click", () => setCartOpen(true));
closeCartButton.addEventListener("click", () => setCartOpen(false));
overlay.addEventListener("click", () => setCartOpen(false));
document.querySelector("#browse-snacks").addEventListener("click", () => {
  setCartOpen(false);
  document.querySelector("#snacks").scrollIntoView({ behavior: "smooth" });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) setCartOpen(false);
});

document.querySelector("#checkout-button").addEventListener("click", () => {
  cart.clear();
  renderCart();
  setCartOpen(false);
  showToast("Thanks for your order! This demo checkout is frontend-only.");
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const emailInput = document.querySelector("#newsletter-email");
  document.querySelector("#newsletter-message").textContent = "You're on the list. Keep an eye on your inbox!";
  emailInput.value = "";
});

applyTheme(localStorage.getItem("nibble-theme") || "light");
themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("nibble-theme", nextTheme);
  applyTheme(nextTheme);
});

function addChatMessage(message, sender) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}-message`;
  bubble.textContent = message;
  chatMessages.append(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

const snackKnowledge = {
  greetings: {
    pattern: /\b(hello|hi|hey|howdy|good morning|good evening|how are you|how is it going)\b/,
    reply: "Hey! I can help you find a snack, check its price, or answer questions about delivery and your bag. What would you like to know?",
  },
  thanks: {
    pattern: /\b(thanks|thank you|thx|cheers)\b/,
    reply: "You're welcome! If you need anything else, I can check snack prices, availability, delivery, or your bag.",
  },
  delivery: {
    pattern: /\b(delivery|shipping|ship|deliver)\b/,
    reply: "Delivery is free on orders over ₹499. This is a frontend demo, so it doesn't calculate a real delivery date or place a real order.",
  },
  dietary: {
    pattern: /\b(ingredient|allerg(?:y|ies|en)|gluten|vegan|nut.free|dairy|ingredients)\b/,
    reply: "I don't have verified ingredient or allergen information for these demo snacks. Please check the product packaging before eating if you have dietary requirements.",
  },
  cart: {
    pattern: /\b(bag|cart|order|checkout)\b/,
  },
  recommendation: {
    pattern: /\b(recommend|suggest|what should|craving|hungry|snack ideas|something sweet|something crunchy)\b/,
  },
  price: {
    pattern: /\b(price|cost|how much|priced)\b/,
  },
  availability: {
    pattern: /\b(do you have|have you got|is there|is .* available|are .* available|available|availability|looking for|i want|i need|can i get|sell|stock)\b/,
  },
};

const productRequestPatterns = [
  /\b(?:do you have|have you got|is there|available|availability of|looking for|i want|i need|can i get|sell|stock(?: of)?)\s+(.+?)(?:\s+available)?[?.!,]*$/i,
  /\b(?:is|are)\s+(.+?)\s+available[?.!,]*$/i,
  /\b(?:price|cost|how much)\s+(?:is|are|for|of)\s+(.+?)[?.!,]*$/i,
  /\b(?:tell me about|information on|details (?:on|about))\s+(.+?)[?.!,]*$/i,
];

const categoryRequests = [
  { pattern: /\b(chips?|crisps?|crunchy)\b/, category: "Chips" },
  { pattern: /\b(sweet|sweets|chocolate|dessert|popcorn)\b/, category: "Sweet" },
  { pattern: /\b(healthy|healthier|feel.good|granola|trail mix|nuts)\b/, category: "Better-for-you" },
  { pattern: /\b(drinks?|sips?|beverages?|juice|tea)\b/, category: "Drinks" },
];

const categoryNames = new Map([
  ["chips", "Chips"],
  ["chip", "Chips"],
  ["crisps", "Chips"],
  ["crunchy snacks", "Chips"],
  ["sweet snacks", "Sweet"],
  ["sweet treats", "Sweet"],
  ["sweets", "Sweet"],
  ["feel good snacks", "Better-for-you"],
  ["healthy snacks", "Better-for-you"],
  ["drinks", "Drinks"],
  ["beverages", "Drinks"],
  ["snacks", "All"],
  ["any snacks", "All"],
  ["anything", "All"],
]);

function normalizeChatText(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function findMentionedProduct(query) {
  const normalizedQuery = normalizeChatText(query);
  return products.find((product) => product.aliases.some((alias) => {
    const normalizedAlias = normalizeChatText(alias);
    return ` ${normalizedQuery} `.includes(` ${normalizedAlias} `);
  }));
}

function extractRequestedItem(query) {
  for (const pattern of productRequestPatterns) {
    const match = query.match(pattern);
    if (match) {
      return match[1]
        .replace(/\b(please|for me|today|on your website|on the website|in stock)\b/gi, "")
        .replace(/[?.!,]+$/g, "")
        .trim();
    }
  }
  return "";
}

function getProductReply(product, query) {
  if (/\b(price|cost|how much|priced)\b/.test(query)) {
    return `${product.name} costs ${formatPrice(product.price)}. You can add it to your bag from its card in the snack shop.`;
  }
  if (/\b(available|availability|have|stock|sell|looking for|want|need|can i get)\b/.test(query)) {
    return `Yes! ${product.name} is available for ${formatPrice(product.price)}. Find it in the snack shop and tap + to add it to your bag.`;
  }
  return `${product.name}: ${product.description}. It costs ${formatPrice(product.price)} and is in our ${product.category.toLowerCase()} collection.`;
}

function getSnackReply(message) {
  const query = normalizeChatText(message);
  const product = findMentionedProduct(query);

  if (snackKnowledge.greetings.pattern.test(query)) return snackKnowledge.greetings.reply;
  if (snackKnowledge.thanks.pattern.test(query)) return snackKnowledge.thanks.reply;

  if (snackKnowledge.cart.pattern.test(query)) {
    const itemCount = [...cart.values()].reduce((total, quantity) => total + quantity, 0);
    const total = [...cart.entries()].reduce((sum, [id, quantity]) => {
      return sum + products.find((item) => item.id === id).price * quantity;
    }, 0);
    if (itemCount === 0) return "Your bag is empty. Add a snack from the shop and I'll help you check your bag again.";
    return `Your bag has ${itemCount} ${itemCount === 1 ? "item" : "items"} with a subtotal of ${formatPrice(total)}. Open Bag to change quantities. Checkout is a demo and won't place a real order.`;
  }

  if (snackKnowledge.delivery.pattern.test(query)) return snackKnowledge.delivery.reply;
  if (snackKnowledge.dietary.pattern.test(query)) return snackKnowledge.dietary.reply;

  const requestedItem = extractRequestedItem(message);
  if (requestedItem) {
    if (product) return getProductReply(product, query);
    const requestedCategory = categoryNames.get(normalizeChatText(requestedItem));
    if (requestedCategory) {
      const availableItems = requestedCategory === "All"
        ? products
        : products.filter((item) => item.category === requestedCategory);
      if (requestedCategory === "All") {
        return `Yes! We have ${availableItems.map((item) => `${item.name} (${formatPrice(item.price)})`).join(", ")}.`;
      }
      return `Yes! Our ${requestedCategory === "Chips" ? "crunchy" : requestedCategory.toLowerCase()} options are ${availableItems.map((item) => `${item.name} (${formatPrice(item.price)})`).join(" and ")}.`;
    }
    return `Sorry, ${requestedItem} isn't available in our shop right now. We currently offer ${products.map((item) => item.name).join(", ")}.`;
  }

  if (product) return getProductReply(product, query);

  if (snackKnowledge.recommendation.pattern.test(query)) {
    const requestedCategory = categoryRequests.find((item) => item.pattern.test(query))?.category;
    const suggestions = requestedCategory
      ? products.filter((item) => item.category === requestedCategory)
      : products.filter((item) => item.category === "Sweet" || item.category === "Chips");
    if (!suggestions.length) return "I couldn't find snacks in that category right now. Ask me about sweet treats, crunchy snacks, feel-good bites, or drinks.";
    return `Here ${suggestions.length === 1 ? "is" : "are"} ${requestedCategory ? `our ${requestedCategory === "Chips" ? "crunchy" : requestedCategory.toLowerCase()} pick${suggestions.length === 1 ? "" : "s"}` : "a couple of popular picks"}: ${suggestions.map((item) => `${item.name} (${formatPrice(item.price)})`).join(", ")}.`;
  }

  if (snackKnowledge.price.pattern.test(query)) {
    return `Our snacks range from ${formatPrice(Math.min(...products.map((item) => item.price)))} to ${formatPrice(Math.max(...products.map((item) => item.price)))}. Ask about a product by name for its exact price.`;
  }

  const categoryRequest = categoryRequests.find((item) => item.pattern.test(query));
  if (categoryRequest) {
    const categoryProducts = products.filter((item) => item.category === categoryRequest.category);
    return `We have ${categoryProducts.map((item) => `${item.name} (${formatPrice(item.price)})`).join(" and ")} in that category.`;
  }

  return "I'm best at questions about the Nibble shop. Ask me whether a snack is available, its price, what's in a category, delivery, ingredients, or your bag. I can't answer general trivia, but I can help find your next snack.";
}

function setChatOpen(isOpen) {
  chatPanel.hidden = !isOpen;
  chatLauncher.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) chatInput.focus();
}

chatLauncher.addEventListener("click", () => setChatOpen(chatPanel.hidden));
chatClose.addEventListener("click", () => setChatOpen(false));
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  addChatMessage(message, "user");
  addChatMessage(getSnackReply(message), "bot");
  chatInput.value = "";
  chatInput.focus();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !chatPanel.hidden) setChatOpen(false);
});

renderProducts();
renderCart();