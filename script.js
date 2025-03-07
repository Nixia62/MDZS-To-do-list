let coins = localStorage.getItem("coins")
  ? parseInt(localStorage.getItem("coins"))
  : 0;
let purchasedItems = localStorage.getItem("purchasedItems")
  ? localStorage.getItem("purchasedItems").split(",")
  : [];


const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const coinCount = document.getElementById("coin-count");
const feedSection = document.getElementById("feed");
const feedList = document.createElement("ul");
const notificationBox = document.getElementById("notification-box");
const inventoryList = document.getElementById("inventory-list");
const hungerBar = document.getElementById("hunger-bar");
const feedButton = document.getElementById("feed-btn");
const characterImage = document.getElementById("character-image");

coinCount.textContent = coins;

const coinValues = {
  easy: 20,
  medium: 40,
  hard: 60,
};

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.classList.add("notification", type);
  notification.textContent = message;

  notificationBox.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

addButton.addEventListener("click", function () {
  const task = taskInput.value.trim();
  const difficulty = document.getElementById("difficulty").value;

  if (task) {
    const li = document.createElement("li");
    li.textContent = `${task} - Difficulty: ${difficulty}`;

    li.addEventListener("click", function () {
      coins += coinValues[difficulty];
      localStorage.setItem("coins", coins);
      coinCount.textContent = coins;
      li.remove();

      showNotification(
        `Task completed! You earned ${coinValues[difficulty]} coins.`,
        "success"
      );
    });

    taskList.appendChild(li);
    taskInput.value = "";
  } else {
    showNotification("Please enter a task!", "warning");
  }
});

taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addButton.click();
  }
});


function updateFeed() {
  inventoryList.innerHTML = "";

  if (purchasedItems.length === 0 || purchasedItems[0] === "") {
    inventoryList.innerHTML = "<p>You haven't bought anything yet!</p>";
  } else {
    purchasedItems.forEach((item) => {
      const invItem = document.createElement("li");
      let parts = item.split(":");
      let productName = parts[0];
      let hungerValue = parts[1];
      invItem.textContent = `${productName} (Restores ${hungerValue} Hunger)`;
      inventoryList.appendChild(invItem);
    });
  }
}

let hunger = localStorage.getItem("hunger")
  ? parseInt(localStorage.getItem("hunger"))
  : 100;

function updateHungerDisplay() {
  hungerBar.style.width = hunger + "%";
  hungerBar.textContent = hunger + "%";
  updateCharacterImage(hunger);
  localStorage.setItem("hunger", hunger);
}

function updateCharacterImage(hungerValue) {
  if (hungerValue >= 95) {
    characterImage.src = "assets2/95.jpeg";
  } else if (hungerValue >= 90) {
    characterImage.src = "assets2/90.jpeg";
  } else if (hungerValue >= 85) {
    characterImage.src = "assets2/85.jpeg";
  } else if (hungerValue >= 80) {
    characterImage.src = "assets2/80.jpeg";
  } else if (hungerValue >= 75) {
    characterImage.src = "assets2/75.jpeg";
  } else if (hungerValue >= 70) {
    characterImage.src = "assets2/70.jpeg";
  } else if (hungerValue >= 65) {
    characterImage.src = "assets2/65.jpeg";
  } else if (hungerValue >= 60) {
    characterImage.src = "assets2/60.jpeg";
  } else if (hungerValue >= 55) {
    characterImage.src = "assets2/55.jpeg";
  } else if (hungerValue >= 50) {
    characterImage.src = "assets/50.jpeg";
  } else if (hungerValue >= 45) {
    characterImage.src = "assets/45.jpeg";
  } else if (hungerValue >= 40) {
    characterImage.src = "assets/40.jpeg";
  } else if (hungerValue >= 35) {
    characterImage.src = "assets/35.jpeg";
  } else if (hungerValue >= 30) {
    characterImage.src = "assets/30.jpeg";
  } else if (hungerValue >= 25) {
    characterImage.src = "assets/25.jpeg";
  } else if (hungerValue >= 20) {
    characterImage.src = "assets/20.jpeg";
  } else if (hungerValue >= 15) {
    characterImage.src = "assets/15.jpeg";
  } else if (hungerValue >= 10) {
    characterImage.src = "assets/10.jpeg";
  } else if (hungerValue >= 5) {
    characterImage.src = "assets/5.jpeg";
  } else {
    characterImage.src = "bg-assets/10percent.jpeg";
  }
}


feedButton.addEventListener("click", function () {
  if (purchasedItems.length > 0) {
    let foodItem = purchasedItems.shift();
    localStorage.setItem("purchasedItems", purchasedItems.join(","));
    updateFeed();

    
    let parts = foodItem.split(":");
    let productName = parts[0];
    let hungerValue = parseInt(parts[1]);


    hunger = Math.min(hunger + hungerValue, 100);
    updateHungerDisplay();

    showNotification(
      `Fed with ${productName}, restored ${hungerValue} hunger!`,
      "success"
    );
  } else {
    showNotification("No food items in inventory!", "warning");
  }
});

setInterval(() => {
  if (hunger > 0) {
    hunger = Math.max(hunger - 1, 0);
    updateHungerDisplay();
  }
}, 25000);

updateHungerDisplay();

document.addEventListener("DOMContentLoaded", () => {
  updateFeed();

  const links = document.querySelectorAll(".nav-left .nav-item");
  const sections = document.querySelectorAll("section");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      sections.forEach((section) => section.classList.remove("active"));

      const target = link.getAttribute("href").substring(1);
      document.getElementById(target).classList.add("active");
    });
  });

  
  document.querySelectorAll(".buy").forEach((button) => {
    button.addEventListener("click", function () {
      const productName = this.getAttribute("data-name");
      const price = parseInt(this.getAttribute("data-price"));
      const hungerValue = parseInt(this.getAttribute("data-hunger"));

      if (coins >= price) {
        coins -= price;
        purchasedItems.push(productName + ":" + hungerValue);
        localStorage.setItem("coins", coins);
        localStorage.setItem("purchasedItems", purchasedItems.join(","));
        coinCount.textContent = coins;
        updateFeed();
        showNotification(`Successfully Bought ${productName}!`, "success");
      } else {
        showNotification("Not enough coins! Get ur ass back to tasks!", "error");
      }
    });
  });
});
