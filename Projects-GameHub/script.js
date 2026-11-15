/* GameHub - JavaScript (simple version) */

// ---------- 1. Product list ----------
var products = [
  { id: 1, name: "PlayStation 5 Console (Disc)", category: "console", price: 2299, icon: "🎮" },
  { id: 2, name: "PlayStation 5 Digital Edition", category: "console", price: 1999, icon: "🎮" },
  { id: 3, name: "PlayStation 4 Slim 1TB", category: "console", price: 1299, icon: "🕹️" },
  { id: 4, name: "DualSense Wireless Controller", category: "accessory", price: 299, icon: "🎧" },
  { id: 5, name: "DualShock 4 Controller", category: "accessory", price: 219, icon: "🕹️" },
  { id: 6, name: "Wireless Gaming Headset", category: "accessory", price: 429, icon: "🎧" },
  { id: 7, name: "God of War Ragnarok (PS5)", category: "game", price: 249, icon: "⚔️" },
  { id: 8, name: "Spider-Man 2 (PS5)", category: "game", price: 259, icon: "🕸️" },
  { id: 9, name: "The Last of Us Part I (PS5)", category: "game", price: 239, icon: "🍄" },
  { id: 10, name: "Gran Turismo 7 (PS5)", category: "game", price: 229, icon: "🏎️" },
  { id: 11, name: "Horizon Zero Dawn (PS4)", category: "game", price: 99, icon: "🏹" },
  { id: 12, name: "Ghost of Tsushima (PS4)", category: "game", price: 149, icon: "🗡️" }
];

// ---------- 2. Cart functions ----------
// The cart is an array saved in the browser (localStorage), so it stays after changing pages.

function getCart() {
  var saved = localStorage.getItem("cart");
  if (saved == null) {
    return [];            // no cart yet
  }
  return JSON.parse(saved);
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  showCartCount();
}

// Find a product by its id
function findProduct(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      return products[i];
    }
  }
}

// ADD: add a product to the cart
function addToCart(id) {
  var cart = getCart();
  var found = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart[i].qty = cart[i].qty + 1;   // already in cart, add 1
      found = true;
    }
  }
  if (found == false) {
    cart.push({ id: id, qty: 1 });     // new item
  }
  saveCart(cart);
  alert("Added to cart!");
}

// UPDATE: change quantity (change is +1 or -1)
function changeQty(id, change) {
  var cart = getCart();
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart[i].qty = cart[i].qty + change;
      if (cart[i].qty < 1) {
        cart[i].qty = 1;
      }
    }
  }
  saveCart(cart);
  showCart();
}

// REMOVE: delete a product from the cart
function removeItem(id) {
  var cart = getCart();
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id != id) {
      newCart.push(cart[i]);
    }
  }
  saveCart(newCart);
  showCart();
}

// Show the number of items beside "Cart" in the menu
function showCartCount() {
  var cart = getCart();
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    total = total + cart[i].qty;
  }
  var spans = document.getElementsByClassName("cart-count");
  for (var j = 0; j < spans.length; j++) {
    spans[j].innerHTML = total;
  }
}

// ---------- 3. Show products ----------
function makeCard(p) {
  return '<div class="product">' +
    '<div class="thumb">' + p.icon + '</div>' +
    '<div class="info">' +
    '<span class="tag">' + p.category + '</span>' +
    '<h3>' + p.name + '</h3>' +
    '<div class="price">RM ' + p.price.toFixed(2) + '</div>' +
    '<button class="btn" onclick="addToCart(' + p.id + ')">Add to Cart</button>' +
    '</div></div>';
}

// Shop page: show products by category ("all", "console", "game", "accessory")
function showProducts(category) {
  var html = "";
  for (var i = 0; i < products.length; i++) {
    if (category == "all" || products[i].category == category) {
      html = html + makeCard(products[i]);
    }
  }
  document.getElementById("productGrid").innerHTML = html;
}

// ---------- 4. Show cart page ----------
function showCart() {
  var cart = getCart();
  var box = document.getElementById("cartBox");

  if (cart.length == 0) {
    box.innerHTML = '<div class="empty"><h2>Your cart is empty</h2><br><a class="btn" href="products.html">Go Shopping</a></div>';
    return;
  }

  var rows = "";
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    var p = findProduct(cart[i].id);
    var lineTotal = p.price * cart[i].qty;
    total = total + lineTotal;
    rows = rows + '<tr>' +
      '<td>' + p.icon + ' ' + p.name + '</td>' +
      '<td>RM ' + p.price.toFixed(2) + '</td>' +
      '<td><div class="qty">' +
      '<button onclick="changeQty(' + p.id + ', -1)">-</button>' +
      '<span>' + cart[i].qty + '</span>' +
      '<button onclick="changeQty(' + p.id + ', 1)">+</button></div></td>' +
      '<td>RM ' + lineTotal.toFixed(2) + '</td>' +
      '<td><button class="btn danger" onclick="removeItem(' + p.id + ')">Remove</button></td>' +
      '</tr>';
  }

  box.innerHTML = '<table>' +
    '<thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table>' +
    '<div class="summary"><div class="row total"><span>Total</span><span>RM ' + total.toFixed(2) + '</span></div></div>';
}

// ---------- 5. Contact form validation ----------
function checkForm() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;
  var ok = true;

  document.getElementById("nameErr").innerHTML = "";
  document.getElementById("emailErr").innerHTML = "";
  document.getElementById("msgErr").innerHTML = "";

  if (name == "") {
    document.getElementById("nameErr").innerHTML = "Please enter your name.";
    ok = false;
  }
  if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
    document.getElementById("emailErr").innerHTML = "Please enter a valid email.";
    ok = false;
  }
  if (message.length < 10) {
    document.getElementById("msgErr").innerHTML = "Message must be at least 10 characters.";
    ok = false;
  }

  if (ok == true) {
    document.getElementById("formResult").innerHTML = "Thank you, " + name + "! We will reply soon.";
  }
  return false;   // stop the page from reloading
}

// ---------- 6. Mobile menu ----------
function toggleMenu() {
  document.getElementById("menu").classList.toggle("open");
}

// ---------- 7. Run when the page opens ----------
window.onload = function () {
  showCartCount();
  if (document.getElementById("productGrid")) { showProducts("all"); }
  if (document.getElementById("cartBox")) { showCart(); }
};
