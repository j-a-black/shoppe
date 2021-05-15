// Making sure the DOM is finished loading so the app can work off the body of the DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready); // once loaded, it calls ready function
} else {
  ready(); // if it's already loaded, then ready function is called
}

function ready() {
  // Removing Cart Items by clicking 'Remove' button
  let removeCartItemButton = document.getElementsByClassName("btn-remove");
  for (let i = 0; i < removeCartItemButton.length; i++) {
    let button = removeCartItemButton[i];
    button.addEventListener("click", removeCartItem);
  }

  // Updating the value of the quantity when we add or subtract item quantity in checkout
  let quantityInputs = document.getElementsByClassName("cart__quantity-js");
  for (let i = 0; i < quantityInputs.length; i++) {
    let input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  // Adding item to cart when 'add to cart' button clicked by user
  let addToCartButton = document.getElementsByClassName("add-to-cart-js");
  for (let i = 0; i < addToCartButton.length; i++) {
    let button = addToCartButton[i];
    button.addEventListener("click", addToCartButtonClicked);
  }

  // Clearing cart once purchase button is clicked
  document
    .getElementsByClassName("btn-purchase-js")[0]
    .addEventListener("click", purchaseButtonClicked);
}

// Function for remove button Event listener
function removeCartItem(event) {
  let removeBtnClicked = event.target; // selects the element the button is in
  removeBtnClicked.parentElement.parentElement.parentElement.parentElement.remove(); // move up 4 lvls to the parent, then removes the parent and its child elements

  updateCartTotal();
}

// Checks value of quantity input field to determine if its a number greater than 0
function quantityChanged(event) {
  let input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    // if user enters neg num or leaves blank
    input.value = 1;
  }

  updateCartTotal();
}

// Function for adding item to cart
function addToCartButtonClicked(event) {
  let button = event.target;
  let product = button.parentElement.parentElement; // this selects the div with class='product'; must select this element so we can then select the child elements
  let productImageSrc = product.getElementsByClassName("product__image")[0].src;
  let productName =
    product.getElementsByClassName("product__title")[0].innerText;
  let productPrice =
    product.getElementsByClassName("product__price")[0].innerText;

  addItemToCart(productImageSrc, productName, productPrice);
  updateCartTotal();
}

// Function for clear cart when purchase button is clicked
function purchaseButtonClicked() {
  alert("Thank you for your purchase!");
  let cartItems = document.getElementsByClassName("cart")[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }

  updateCartTotal();
}

// Function for adding the actual product item to cart
function addItemToCart(productImageSrc, productName, productPrice) {
  let cartItem = document.createElement("div"); // creating new <div>
  cartItem.classList.add("cart__item"); // class added to newly created div; <div class="cart__item">
  let cart = document.getElementsByClassName("cart")[0];
  let cartProductNames = cart.getElementsByClassName("cart__title");
  for (let i = 0; i < cartProductNames.length; i++) {
    if (cartProductNames[i].innerText == productName) {
      return;
    }
  }

  let cartItemContents = `
    <div class="cart__figure">
        <img
        src="${productImageSrc}"
        alt="Chocolate Cake"
        class="cart__image"
        />
    </div>
    <div class="cart__body">
        <div class="cart__title">${productName}</div>
        <div class="cart__price">${productPrice}</div>
        <div>
        <input
            type="number"
            min="1"
            step="1"
            value="1"
            class="cart__input cart__quantity-js"
        />
        <span><button class="btn-remove">x</button></span>
        </div>
    </div>
    `;
  cartItem.innerHTML = cartItemContents;
  cart.appendChild(cartItem);
  cartItem
    .getElementsByClassName("btn-remove")[0]
    .addEventListener("click", removeCartItem); // must add event listener b/c 'new' remove buttons are added after the DOM has loaded
  cartItem
    .getElementsByClassName("cart__quantity-js")[0]
    .addEventListener("change", quantityChanged); // must add event listener b/c 'new' quantities are added after the DOM has loaded
}

// Update Total Price
function updateCartTotal() {
  let cartItems = document.getElementsByClassName("cart__item");
  let total = 0;

  for (let i = 0; i < cartItems.length; i++) {
    let cartItem = cartItems[i];
    let priceElement = cartItem.getElementsByClassName("cart__price")[0];
    let quantityElement =
      cartItem.getElementsByClassName("cart__quantity-js")[0];
    let price = parseFloat(priceElement.innerText.replace("$", "")); // want a number rather than string
    let quantity = quantityElement.value;
    total = total + price * quantity;
  }

  document.getElementsByClassName(
    "total-price-js"
  )[0].innerText = `${total.toFixed(2)}`;
}
