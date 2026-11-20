
const products = {
  "Iced Latte": 120,
  "Iced Mocha": 135,
  "Caramel Macchiato": 140,
  "Hot Cappuccino": 110,
  "Matcha Latte": 130,
  "Butter Croissant": 85
};

const cart = {};

const peso = amount =>
  "₱" + amount.toLocaleString("en-PH");

function addToCart(name) {
  if (!products[name]) return;

  cart[name] = (cart[name] || 0) + 1;

  updateCart();

  document.getElementById("cart-panel").hidden = false;
}

function updateCart() {
  const items = document.getElementById("cart-items");
  items.replaceChildren();

  let totalItems = 0;
  let totalPrice = 0;

  Object.entries(cart).forEach(([name, quantity]) => {
    const price = products[name];
    totalItems += quantity;
    totalPrice += price * quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const info = document.createElement("div");

    const title = document.createElement("p");
    title.textContent = name;

    const subtotal = document.createElement("small");
    subtotal.textContent = peso(price * quantity);

    info.append(title, subtotal);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Remove one " + name);
    minus.onclick = () => changeQuantity(name, -1);

    const count = document.createElement("span");
    count.textContent = quantity;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Add one " + name);
    plus.onclick = () => changeQuantity(name, 1);

    controls.append(minus, count, plus);
    row.append(info, controls);
    items.appendChild(row);
  });

  if (totalItems === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Your cart is empty. Add a drink to get started!";
    items.appendChild(empty);
  }

  document.getElementById("cart-count").textContent = totalItems;
  document.getElementById("cart-total").textContent = peso(totalPrice);
}

function changeQuantity(name, change) {
  if (!cart[name]) return;

  cart[name] += change;

  if (cart[name] <= 0) {
    delete cart[name];
  }

  updateCart();
}

function toggleCart() {
  const panel = document.getElementById("cart-panel");
  panel.hidden = !panel.hidden;
}

function checkout() {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty! Please add a product first.");
    return;
  }

  document.getElementById("order-modal").hidden = false;
}

function closeOrder() {
  document.getElementById("order-modal").hidden = true;
}

document.getElementById("order-form").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const customer =
      document.getElementById("order-name").value.trim();

    const phone =
      document.getElementById("order-phone").value.trim();

    const address =
      document.getElementById("order-address").value.trim();

    const payment =
      document.getElementById("payment").value;

    if (!customer || !phone || !address) {
      alert("Please complete all required fields.");
      return;
    }

    let total = 0;
    const orderLines = Object.entries(cart).map(
      ([name, quantity]) => {
        const subtotal = products[name] * quantity;
        total += subtotal;
        return `${name} x ${quantity} = ${peso(subtotal)}`;
      }
    );

    const orderNumber = "CC-" +
      Date.now().toString().slice(-7);

    const receipt = [
      "☕ COZY CUP CAFÉ",
      "ORDER CONFIRMATION",
      "Order No.: " + orderNumber,
      "",
      "Customer: " + customer,
      "Phone: " + phone,
      "Address: " + address,
      "",
      ...orderLines,
      "",
      "TOTAL: " + peso(total),
      "Payment: " + payment,
      "",
      "Thank you for ordering!"
    ].join("\n");

    // Display order confirmation
    closeOrder();
    document.getElementById("cart-panel").hidden = true;

    const modal = document.getElementById("order-modal");
    const content = modal.querySelector(".modal-content");
    content.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = "☕ Order Received!";

    const message = document.createElement("p");
    message.textContent =
      "Thank you, " + customer +
      "! Here is your order summary.";

    const details = document.createElement("pre");
    details.style.whiteSpace = "pre-wrap";
    details.style.overflowWrap = "anywhere";
    details.style.margin = "20px 0";
    details.textContent = receipt;

    const print = document.createElement("button");
    print.className = "btn";
    print.textContent = "Print Receipt";
    print.onclick = () => window.print();

    const close = document.createElement("button");
    close.className = "btn";
    close.style.marginLeft = "8px";
    close.textContent = "Close";
    close.onclick = () => {
      modal.hidden = true;
    };

    content.append(heading, message, details, print, close);
    modal.hidden = false;

    // Empty the cart after successful form submission
    Object.keys(cart).forEach(name => delete cart[name]);
    updateCart();

    document.getElementById("order-form").reset();
  }
);

// Demo contact form
document.getElementById("contact-form").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    document.getElementById("contact-status").textContent =
      "Thank you for reaching out! This demo form does not send messages yet.";

    this.reset();
  }
);

// Close the modal when clicking outside the form
document.getElementById("order-modal").addEventListener(
  "click",
  function(event) {
    if (event.target === this) {
      closeOrder();
    }
  }
);

updateCart();
