/*
  Simple cart functionality and initialization code.
  This script handles adding products to a cart stored in localStorage
  and updating the cart count displayed in the header. Each product button
  should have the class `add-cart` and data attributes for `name` and `price`.
*/

document.addEventListener('DOMContentLoaded', () => {
  const cartCountEl = document.querySelector('.cart-count');

  /**
   * Load the existing cart from localStorage. Returns an array of product objects.
   */
  function loadCart() {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Persist the cart back to localStorage.
   * @param {Array} cart
   */
  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  /**
   * Recalculate the cart count and update the badge in the header.
   */
  function updateCartCount() {
    const cart = loadCart();
    if (cartCountEl) {
      cartCountEl.textContent = cart.length;
    }
  }

  /**
   * Add a new product to the cart.
   * @param {Object} product
   */
  function addToCart(product) {
    const cart = loadCart();
    cart.push(product);
    saveCart(cart);
    updateCartCount();
  }

  /**
   * Render the contents of the cart on the cart page. This function
   * dynamically populates the cart table, calculates the total price and
   * attaches event listeners for removing individual items or clearing the
   * entire cart. If the elements it needs are not present, the function
   * simply returns.
   */
  function renderCart() {
    const tableBody = document.getElementById('cart-items');
    if (!tableBody) return; // Only run on cart page
    const cart = loadCart();
    tableBody.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td><button class="remove-item" data-index="${index}">Remove</button></td>
      `;
      tableBody.appendChild(row);
      total += item.price;
    });
    const totalCell = document.querySelector('.cart-total');
    if (totalCell) {
      totalCell.textContent = 'Total: $' + total.toFixed(2);
    }
    // Attach remove handlers
    const removeButtons = tableBody.querySelectorAll('.remove-item');
    removeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        const cartArr = loadCart();
        cartArr.splice(idx, 1);
        saveCart(cartArr);
        renderCart();
        updateCartCount();
      });
    });
    // Attach clear cart handler
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
      clearBtn.onclick = () => {
        saveCart([]);
        renderCart();
        updateCartCount();
      };
    }
  }

  // Initialize cart count on page load
  updateCartCount();

  // Attach click handlers to all add-cart buttons
  const addButtons = document.querySelectorAll('.add-cart');
  addButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      addToCart({ name, price });
      // Provide simple feedback
      btn.textContent = 'Added!';
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
      }, 1500);
    });
  });

  // Render cart contents if on the cart page
  renderCart();
});