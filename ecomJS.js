const cardHolder = document.querySelector(".card-holder");
const cartImage = document.querySelector(".cart-image");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const modalCloseButton = document.querySelector(".close");
const modalContent = document.querySelector(".modalContent");
const modalB = document.querySelector(".modalB");
const checkOutPrice = document.querySelector(".checkOutPrice");
const checkOP = document.querySelector(".checkOP");
const noItemInCart = document.querySelector(".noItemInCart");
let cardAllList = [];
localStorage.setItem("cartItems", cardAllList);

window.addEventListener("DOMContentLoaded", () => {
  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      obj = data.products;
      console.log(obj);
      display(obj);
    });
});

// function to render all products on the screen.
function display(allItems) {
  allItems.map((item) => {
    // console.log("value is getting fetched through localStorage" + localStorage.getItem('cardItems'));
    // create div tag
    let card1 = document.createElement("div");
    card1.classList.add("card");
    // create image tag
    let image = document.createElement("img");
    image.src = item.images[0];
    image.classList.add("Image");
    //create title tag
    let hTHree = document.createElement("h3");
    hTHree.textContent = item.title;
    hTHree.classList.add("title");
    //create price tag
    let price = document.createElement("h3");
    price.classList.add("price");
    price.textContent = item.price;
    let description = document.createElement("p");
    description.classList.add("description");
    description.textContent = item.description;
    let br = document.createElement("br");
    let button = document.createElement("button");
    button.classList.add("btn");
    button.id = item.id;
    button.textContent = "Add to Cart";
    let removeButton = document.createElement("button");
    removeButton.classList.add("btnRemove");
    removeButton.classList.add("visibility");
    removeButton.id = item.id;
    removeButton.textContent = "Remove from Cart";
    cardHolder.appendChild(card1);
    card1.appendChild(image);
    card1.appendChild(hTHree);
    card1.appendChild(price);
    card1.appendChild(description);
    card1.append(br);
    card1.appendChild(button);
    card1.appendChild(removeButton);
  });

  let addToCartBtn = document.querySelectorAll(".btn");

  addToCartBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let id = e.target.id;
      let price = e.target.parentElement.querySelector(".price").textContent;
      let image = e.target.parentElement.querySelector(".Image").src;
      let title = e.target.parentElement.querySelector(".title").textContent;
      let button = e.target.parentElement.querySelector(".btn");
      let removeButton = e.target.parentElement.querySelector(".btnRemove");

      //pushing the selected items to card
      cardAllList.push({
        id: id,
        price: price,
        image: image,
        title: title,
        qty: 1,
        totalPrice: 1 * price,
      });

      button.classList.toggle("visibility");
      removeButton.classList.toggle("visibility");
      console.log(cardAllList);
    });
  });

  // remove from cart button

  let removeFromCart = document.querySelectorAll(".btnRemove");
  removeFromCart.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      let id = e.target.id;
      let button = e.target.parentElement.querySelector(".btn");
      let removeButton = e.target.parentElement.querySelector(".btnRemove");

      // deleting the selected items in card
      cardAllList = cardAllList.filter((item) => {
        if (item.id !== id) {
          return item;
        }
      });

      button.classList.toggle("visibility");
      removeButton.classList.toggle("visibility");
    });
  });

  //product checkOut Function
  function checkOut() {
    if (cardAllList.length === 0) {
      noItemInCart.classList.remove("visibility");
      checkOutPrice.classList.add("visibility");
    } else if (cardAllList.length > 0) {
      noItemInCart.classList.add("visibility");
      checkOutPrice.classList.remove("visibility");
      let ttl = 0;
      cardAllList.forEach((item) => {
        ttl += item["totalPrice"];
      });
      checkOP.innerText = ttl;
    }
  }

  //open cart items and render the cart items.
  cartImage.addEventListener("click", () => {
    let ui = cardAllList.map((item) => {
      return `<div class="modalBody">
            <button class="removeBtn" id=${item.id}>X</button>
            <img class="cartImage" src=${item.image} alt=${item.title}>
            <div class="cartDetail">
                <p class="cartTitle">${item.title}</p>
                <p class="cartPrice">${item.price}</p>
            </div>
            <div class="cartButtonGroup">
                <button class="cart-button increase" id=${item.id}>+</button>
                <span class="increDecre">${item.qty}</span>
                <button class="cart-button decrease" id=${item.id}>-</button>
            </div>
            <p class="cartPrice totalPrice" style="color:green;font-weight:bold;">${item.totalPrice}</p>
        </div>`;
    });

    modalB.innerHTML = ui.join("");
    modal.style.display = "block";
    checkOut();

    // increase quantity button
    const increase = document.querySelectorAll(".increase");
    increase.forEach((item) => {
      item.addEventListener("click", (e) => {
        let id = parseInt(e.target.id);
        cardAllList.forEach((item) => {
          if (item["id"] == id) {
            item["qty"] += 1;
            item["totalPrice"] = item["qty"] * item["price"];
            let increDecre =
              e.target.parentElement.querySelector(".increDecre");
            let totalPrice =
              e.target.parentElement.parentElement.querySelector(".totalPrice");
            increDecre.innerText = item["qty"];
            totalPrice.textContent = item["totalPrice"];

            // calling the checkout function to update the total check out price

            checkOut();
          }
        });
      });
    });

    // decrease quantity button
    const decrease = document.querySelectorAll(".decrease");
    decrease.forEach((item) => {
      item.addEventListener("click", (e) => {
        let id = parseInt(e.target.id);
        cardAllList.forEach((item) => {
          if (item["id"] == id) {
            if (item["qty"] > 1) {
              item["qty"] -= 1;
              item["totalPrice"] = item["qty"] * item["price"];
              let increDecre =
                e.target.parentElement.querySelector(".increDecre");
              let totalPrice =
                e.target.parentElement.parentElement.querySelector(
                  ".totalPrice"
                );

              increDecre.innerText = item["qty"];
              totalPrice.textContent = item["totalPrice"];

              // calling the checkout function to update the total check out price
              checkOut();
            }
          }
        });
      });
    });

    //individual close button
    const individualCloseBtn = document.querySelectorAll(".removeBtn");
    individualCloseBtn.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let id = e.target.id;
        console.log(id);
        let modalB = e.target.parentElement;
        const removebutton = document
          .getElementById(id)
          .parentElement.querySelector(".btnRemove");

        const btn = document
          .getElementById(id)
          .parentElement.querySelector(".btn");
        removebutton.classList.toggle("visibility");
        btn.classList.toggle("visibility");
        cardAllList = cardAllList.filter((item) => {
          if (item.id !== id) {
            return item;
          }
        });

        modalB.innerHTML = "";
        modalB.classList.toggle("borderNull");

        // calling the checkout function to update the total check out price
        checkOut();
      });
    });
  });

  // close cart modal

  modalCloseButton.addEventListener("click", () => {
    modal.style.display = "none";
    modalB.remove;
  });
}
