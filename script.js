// script.js
document.addEventListener("DOMContentLoaded", () => {
  const addItemBtn = document.getElementById("add-btn");
  const itemInput = document.getElementById("item-input");
  const groceryList = document.getElementById("grocery-list");
  const categoryList = document.querySelector(".category-list ul"); // Select the category list

  // Initialize GSAP
  gsap.from(".container", {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: "power3.out"
  });

  gsap.from(".welcome-banner", {
    duration: 1.2,
    y: 30,
    opacity: 0,
    delay: 0.5,
    ease: "back.out(1.7)"
  });

  // Fetch random food items from API
  async function getRandomFoodItem() {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      return data.meals[0].strMeal;
    } catch (error) {
      console.error('Error fetching food item:', error);
      return null;
    }
  }

  // Fetch categories from API
  async function getCategories() {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const data = await response.json();
      return data.categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Check for low stock notification and pending stock
  async function checkStock(itemName) {
    try {
      const response = await fetch(`https://api.example.com/stock?item=${encodeURIComponent(itemName)}`);
      const data = await response.json();
      if (data.lowStock) {
        const toast = document.createElement("div");
        toast.className = "toast-notification";
        toast.textContent = `${itemName} is running low in stock!`;
        document.body.appendChild(toast);
        gsap.to(toast, {
          duration: 0.5,
          opacity: 1,
          y: -20,
          ease: "power2.out"
        });
        setTimeout(() => {
          gsap.to(toast, {
            duration: 0.5,
            opacity: 0,
            y: 0,
            onComplete: () => toast.remove()
          });
        }, 3000);
      }
      if (data.pendingStock) {
        const toast = document.createElement("div");
        toast.className = "toast-notification";
        toast.textContent = `${itemName} has pending stock of ${data.pendingStock} units.`;
        document.body.appendChild(toast);
        gsap.to(toast, {
          duration: 0.5,
          opacity: 1,
          y: -20,
          ease: "power2.out"
        });
        setTimeout(() => {
          gsap.to(toast, {
            duration: 0.5,
            opacity: 0,
            y: 0,
            onComplete: () => toast.remove()
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Error checking stock:', error);
    }
  }

  // Add item to the list with modern animations
  addItemBtn.addEventListener("click", async () => {
    let itemName = itemInput.value.trim();

    if (itemName === "") {
      itemName = await getRandomFoodItem();
      if (!itemName) {
        // Modern toast notification instead of alert
        const toast = document.createElement("div");
        toast.className = "toast-notification";
        toast.textContent = "Please enter an item or try again later";
        document.body.appendChild(toast);
        gsap.to(toast, {
          duration: 0.5,
          opacity: 1,
          y: -20,
          ease: "power2.out"
        });
        setTimeout(() => {
          gsap.to(toast, {
            duration: 0.5,
            opacity: 0,
            y: 0,
            onComplete: () => toast.remove()
          });
        }, 3000);
        return;
      }
    }

    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span class="item-name">
        <i class="fas fa-shopping-cart"></i>
        ${itemName}
      </span>
      <div class="actions">
        <button class="purchased" title="Mark as purchased">
          <i class="fas fa-check"></i>
        </button>
        <button class="delete" title="Remove item">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    groceryList.appendChild(listItem);
    itemInput.value = "";

    // Animate new item entry
    gsap.from(listItem, {
      duration: 0.5,
      x: -100,
      opacity: 0,
      ease: "power2.out"
    });

    // Modern hover effects using GSAP
    listItem.addEventListener('mouseenter', () => {
      gsap.to(listItem, {
        duration: 0.3,
        scale: 1.02,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        ease: "power2.out"
      });
    });

    listItem.addEventListener('mouseleave', () => {
      gsap.to(listItem, {
        duration: 0.3,
        scale: 1,
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        ease: "power2.out"
      });
    });

    // Mark item as purchased with modern animation
    listItem.querySelector(".purchased").addEventListener("click", () => {
      const itemNameSpan = listItem.querySelector(".item-name");
      gsap.to(itemNameSpan, {
        duration: 0.3,
        color: "#4CAF50",
        textDecoration: "line-through",
        ease: "power2.inOut"
      });
    });

    // Delete item with modern animation
    listItem.querySelector(".delete").addEventListener("click", () => {
      gsap.to(listItem, {
        duration: 0.5,
        x: 100,
        opacity: 0,
        ease: "power2.inOut",
        onComplete: () => groceryList.removeChild(listItem)
      });
    });

    // Check for stock notifications
    checkStock(itemName);

    // Add item to categories list
    const categories = await getCategories();
    const categoryItem = document.createElement("li");
    const category = categories.find(cat => cat.strCategory === itemName);
    if (category) {
      categoryItem.innerHTML = `
        <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="category-image">
        ${category.strCategory}
      `;
    } else {
      categoryItem.textContent = itemName;
    }
    categoryList.appendChild(categoryItem);
  });
});
