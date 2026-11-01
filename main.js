document.addEventListener("DOMContentLoaded", () => {
  const buyButtons = document.querySelectorAll(".btn-buy");

  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const btnCheckout = document.getElementById("btn-checkout");
  const btnClear = document.getElementById("btn-clear");

  function getStoredCart() {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Erro ao ler localStorage:", e);
      return [];
    }
  }

  function saveCart(cartData) {
    try {
      localStorage.setItem("cart", JSON.stringify(cartData));
    } catch (e) {
      console.error("Erro ao salvar no localStorage:", e);
    }
  }

  function updateCartCount() {
    const cart = getStoredCart();
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
  }

  function renderCart() {
    if (!cartItemsContainer) return;

    const cart = getStoredCart();

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="empty-message" style="text-align: center; color: #ccc;">Seu carrinho está vazio.</p>`;
      if (cartTotalElement) cartTotalElement.textContent = "R$ 0,00";
      return;
    }

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");
      itemDiv.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 15px; background-color: #111; border: 1px solid #333; border-radius: 10px; margin-bottom: 10px; color: white;";
      itemDiv.innerHTML = `
        <div class="cart-item-info">
          <h4 style="color: aqua; margin-bottom: 5px;">${item.name}</h4>
          <p style="font-size: 14px; color: #ccc;">Quantidade: ${item.quantity} x R$ ${item.price.toFixed(2).replace(".", ",")}</p>
        </div>
        <div class="cart-item-price" style="font-size: 18px; font-weight: bold;">
          R$ ${itemTotal.toFixed(2).replace(".", ",")}
        </div>
      `;
      cartItemsContainer.appendChild(itemDiv);
    });

    if (cartTotalElement) {
      cartTotalElement.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
    }
  }

  const productImg = document.getElementById("product-img");
  if (productImg) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "1";

    const produtos = {
      "1": { name: "Cupcake de Baunilha", price: 12.00, img: "./img/cupcake1.png" },
      "2": { name: "Cupcake de Chocolate", price: 15.00, img: "./img/cupcake2.png" },
      "3": { name: "Cupcake de Morango", price: 10.00, img: "./img/cupcake3.png" },
      "4": { name: "Cupcake de Chocolate", price: 15.00, img: "./img/cupcake2.png" },
      "5": { name: "Cupcake de Morango", price: 10.00, img: "./img/cupcake3.png" },
      "6": { name: "Cupcake de Morango", price: 10.00, img: "./img/cupcake3.png" },
      "7": { name: "Cupcake de Chocolate", price: 15.00, img: "./img/cupcake2.png" },
      "8": { name: "Cupcake de Baunilha", price: 12.00, img: "./img/cupcake1.png" },
      "9": { name: "Cupcake de Morango", price: 10.00, img: "./img/cupcake3.png" },
      "10": { name: "Cupcake de Baunilha", price: 12.00, img: "./img/cupcake1.png" },
      "11": { name: "Cupcake de Chocolate", price: 15.00, img: "./img/cupcake2.png" },
      "12": { name: "Cupcake de Morango", price: 10.00, img: "./img/cupcake3.png" }
    };

    const produto = produtos[id] || produtos["1"];

    const nameEl = document.getElementById("product-name");
    const priceEl = document.getElementById("product-price");
    if (nameEl) nameEl.textContent = produto.name;
    if (priceEl) priceEl.textContent = `R$ ${produto.price.toFixed(2).replace(".", ",")}`;
    
    productImg.src = produto.img;
    productImg.alt = produto.name;

    const btnAddCart = document.getElementById("btn-add-cart");
    if (btnAddCart) {
      const newBtn = btnAddCart.cloneNode(true);
      btnAddCart.parentNode.replaceChild(newBtn, btnAddCart);

      document.getElementById("btn-add-cart").addEventListener("click", () => {
        let cart = getStoredCart();
        const existingIndex = cart.findIndex((item) => item.id === id);

        if (existingIndex > -1) {
          cart[existingIndex].quantity += 1;
        } else {
          cart.push({ id, name: produto.name, price: produto.price, quantity: 1 });
        }

        saveCart(cart);
        updateCartCount();
        alert("Produto adicionado ao carrinho!");
      });
    }
  }

  updateCartCount();
  renderCart();

  buyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const name = button.getAttribute("data-name");
      const price = parseFloat(button.getAttribute("data-price"));

      let cart = getStoredCart();
      const existingIndex = cart.findIndex((item) => item.id === id);

      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1 });
      }

      saveCart(cart);
      updateCartCount();

      const cartIcon = document.getElementById("cart-icon");
      if (cartIcon) {
        cartIcon.classList.remove("cart-blink");
        void cartIcon.offsetWidth;
        cartIcon.classList.add("cart-blink");
      }
    });
  });

  if (btnClear) {
    btnClear.addEventListener("click", () => {
      localStorage.removeItem("cart");
      updateCartCount();
      renderCart();
    });
  }

  if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
      const cart = getStoredCart();
      if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
      }
      alert("Compra finalizada com sucesso!");
      localStorage.removeItem("cart");
      updateCartCount();
      renderCart();
    });
  }

  const contactForm = document.querySelector("form"); 
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault(); 

      const inputs = contactForm.querySelectorAll("input, textarea");
      let preenchido = true;

      inputs.forEach((input) => {
        if (input.value.trim() === "") {
          preenchido = false;
        }
      });

      if (!preenchido) {
        alert("Por favor, preencha todos os campos antes de enviar!");
        return;
      }

      alert("Mensagem enviada com sucesso!");
      contactForm.reset();
    });
  }
});