const $ = el => document.querySelector(el);
const $all = el => document.querySelectorAll(el);

let modalQuantity = 1;
let cart = [];
let modalKey = 0;

// Lista hamburgueres


hambJson.map((item, index) => {
  let hambItem = $(".models .hamb-item").cloneNode(true);

  hambItem.setAttribute("data-key", index);
  hambItem.querySelector(".hamb-item--img img").src = item.img;
  hambItem.querySelector(
    ".hamb-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;
  hambItem.querySelector(".hamb-item--name").innerHTML = item.name;
  hambItem.querySelector(".hamb-item--desc").innerHTML = item.description;

  hambItem.querySelector("a").addEventListener("click", event => {
    event.preventDefault();
    let key = event.target.closest(".hamb-item").getAttribute("data-key");
    modalQuantity = 1;
    modalKey = key;

    $(".hambBig img").src = hambJson[key].img;
    $(".hambInfo .title").innerHTML = hambJson[key].name;
    $(".hambInfo--desc").innerHTML = hambJson[key].description;
    $(".hambInfo--actualPrice").innerHTML = `R$ ${hambJson[key].price.toFixed(
      2
    )}`;

    $(".hambInfo--size.selected").classList.remove("selected");

    $all(".hambInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = hambJson[key].sizes[sizeIndex];
    });

    $(".hambInfo--qt").innerHTML = modalQuantity;

    $(".hambWindowArea").style.opacity = "0";
    $(".hambWindowArea").style.display = "flex";
    setTimeout(() => {
      $(".hambWindowArea").style.opacity = "1";
    }, 350);
  });

  $(".hamb-area").append(hambItem);
});

// Executa o Modal

const closeModal = () => {
  $(".hambWindowArea").style.opacity = "0";
  setTimeout(() => {
    $(".hambWindowArea").style.display = "none";
  }, 500);
};

$all(".hambInfo--cancelButton, .hambInfo--cancelMobileButton").forEach(
  item => {
    item.addEventListener("click", closeModal);
  }
);

$(".quantity.-less").addEventListener("click", () => {
  if (modalQuantity > 1) {
    modalQuantity--;
    $(".hambInfo--qt").innerHTML = modalQuantity;
  }
});

$(".quantity.-more").addEventListener("click", () => {
  modalQuantity++;
  $(".hambInfo--qt").innerHTML = modalQuantity;
});

$all(".hambInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", () => {
    $(".hambInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

$(".hambInfo--addButton").addEventListener("click", () => {
  let size = parseInt($(".hambInfo--size.selected").getAttribute("data-key"));
  let indentifier = hambJson[modalKey].id + "@" + size;

  let key = cart.findIndex(item => item.indentifier == indentifier);

  key > -1
    ? (cart[key].quantity += modalQuantity)
    : cart.push({
        indentifier,
        id: hambJson[modalKey].id,
        size,
        quantity: modalQuantity
      });
  updateCart();
  closeModal();
});

$(".menu-openner").addEventListener("click", () => {
  cart.length > 0 ? ($("aside").style.left = "0") : null;
});

$(".menu-closer").addEventListener("click", () => {
  $("aside").style.left = "100vw";
});

const updateCart = () => {
  $(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    $("aside").classList.add("show");
    $(".cart").innerHTML = "";

    let discount = 0;
    let subtotal = 0;
    let total = 0;

    for (let i in cart) {
      let hambItem = hambJson.find(item => item.id == cart[i].id);

      subtotal += hambItem.price * cart[i].quantity;

      let cartItem = $(".models .cart--item").cloneNode(true);

      let size = cart[i].size;

      const getHambSize = size => {
        const sizes = {
          0: () => (size = "M"),
          1: () => (size = "M"),
          2: () => (size = "G")
        };
        return sizes[size]();
      };

      let hambSizeName = getHambSize(size);

      let hambName = `${hambItem.name} (${hambSizeName})`;

      cartItem.querySelector("img").src = hambItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = hambName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].quantity;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          cart[i].quantity > 1 ? cart[i].quantity-- : cart.splice(i, 1);
          updateCart();
        });

      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].quantity++;
          updateCart();
        });

      $(".cart").append(cartItem);
    }

    discount = subtotal * 0.1;
    total = subtotal - discount;

    $(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    $(".desconto span:last-child").innerHTML = `R$ ${discount.toFixed(2)}`;
    $(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    $("aside").classList.remove("show");
    $("aside").style.left = "100vw";
  }
};