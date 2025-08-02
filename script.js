// Global variables
let currentUser = null
let tickets = []
let currentTicketId = 1

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  animateStats()
  setupSmoothScrolling()
})

// Initialize application
function initializeApp() {
  // Load sample tickets
  tickets = [
    {
      id: 1,
      title: "Login Issues with Mobile App",
      description:
        "Unable to login to the mobile application after recent update. Getting authentication failed error.",
      status: "open",
      priority: "high",
      category: "Technical",
      user: "John Doe",
      created: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      upvotes: 5,
      downvotes: 1,
      replies: [
        {
          user: "Sarah Wilson",
          role: "Support Agent",
          content: "Thank you for reporting this issue. Can you please provide your device and OS version?",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
      ],
    },
    {
      id: 2,
      title: "Feature Request: Dark Mode",
      description: "Would love to see a dark mode option in the application for better user experience.",
      status: "in_progress",
      priority: "medium",
      category: "Feature Request",
      user: "Jane Smith",
      created: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      upvotes: 12,
      downvotes: 2,
      replies: [],
    },
    {
      id: 3,
      title: "Billing Question",
      description: "Question about my recent invoice and payment methods. Need clarification on charges.",
      status: "resolved",
      priority: "low",
      category: "Billing",
      user: "Mike Johnson",
      created: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
      upvotes: 3,
      downvotes: 0,
      replies: [
        {
          user: "Mike Chen",
          role: "Support Agent",
          content: "I've reviewed your account and sent you a detailed breakdown via email.",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      ],
    },
  ]

  // Check if user is logged in (simulate with localStorage)
  const savedUser = localStorage.getItem("quickdesk_user")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    updateUIForLoggedInUser()
  }
}

// Setup event listeners
function setupEventListeners() {
  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal(event.target.id)
    }
  })

  // Handle escape key for modals
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals()
    }
  })

  // Handle form submissions
  document.addEventListener("submit", (event) => {
    event.preventDefault()
  })
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Animate statistics counters
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number[data-target]")

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  })

  statNumbers.forEach((stat) => {
    observer.observe(stat)
  })
}

// Animate individual counter
function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-target"))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current).toLocaleString()
  }, 16)
}

// Mobile menu toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu")
  mobileMenu.classList.toggle("show")
}

// Show specific section
function showSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

// Modal functions
function showModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("show")
    document.body.style.overflow = "hidden"
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("show")
    document.body.style.overflow = "auto"
  }
}

function closeAllModals() {
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    modal.classList.remove("show")
  })
  document.body.style.overflow = "auto"
}

function showLogin() {
  showModal("loginModal")
}

function showRegister() {
  showModal("registerModal")
}

function showDashboard() {
  if (currentUser) {
    showModal("dashboardModal")
    updateDashboardContent()
  } else {
    showLogin()
  }
}

// Authentication functions
function handleLogin(event) {
  event.preventDefault()
  const formData = new FormData(event.target)
  const email = formData.get("email") || event.target.querySelector('input[type="email"]').value
  const password = formData.get("password") || event.target.querySelector('input[type="password"]').value

  // Simulate login (in real app, this would be an API call)
  if (email && password) {
    currentUser = {
      id: 1,
      name: "John Doe",
      email: email,
      role: "End User",
      company: "Acme Corp",
    }

    localStorage.setItem("quickdesk_user", JSON.stringify(currentUser))
    closeModal("loginModal")
    updateUIForLoggedInUser()
    showNotification("Login successful!", "success")

    // Show dashboard after login
    setTimeout(() => {
      showDashboard()
    }, 1000)
  }
}

function handleRegister(event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)

  const name = form.querySelector('input[type="text"]').value
  const email = form.querySelector('input[type="email"]').value
  const role = form.querySelector("select").value
  const company = form.querySelectorAll('input[type="text"]')[1].value
  const password = form.querySelector('input[type="password"]').value

  // Simulate registration
  if (name && email && role && password) {
    currentUser = {
      id: Date.now(),
      name: name,
      email: email,
      role: role,
      company: company,
    }

    localStorage.setItem("quickdesk_user", JSON.stringify(currentUser))
    closeModal("registerModal")
    updateUIForLoggedInUser()
    showNotification("Account created successfully!", "success")

    // Show dashboard after registration
    setTimeout(() => {
      showDashboard()
    }, 1000)
  }
}

function logout() {
  currentUser = null
  localStorage.removeItem("quickdesk_user")
  updateUIForLoggedOutUser()
  closeAllModals()
  showNotification("Logged out successfully!", "info")
}

// Update UI based on authentication state
function updateUIForLoggedInUser() {
  const navLinks = document.querySelector(".nav-links")
  if (navLinks) {
    navLinks.innerHTML = `
            <a href="#home" class="nav-link">Home</a>
            <a href="#features" class="nav-link">Features</a>
            <a href="#demo" class="nav-link">Demo</a>
            <a href="#contact" class="nav-link">Contact</a>
            <button class="btn btn-outline" onclick="showDashboard()">Dashboard</button>
            <button class="btn btn-primary" onclick="logout()">Sign Out</button>
        `
  }

  // Update dashboard user info
  const userName = document.getElementById("userName")
  const userRole = document.getElementById("userRole")
  if (userName && currentUser) {
    userName.textContent = currentUser.name
  }
  if (userRole && currentUser) {
    userRole.textContent = currentUser.role
  }
}

function updateUIForLoggedOutUser() {
  const navLinks = document.querySelector(".nav-links")
  if (navLinks) {
    navLinks.innerHTML = `
            <a href="#home" class="nav-link">Home</a>
            <a href="#features" class="nav-link">Features</a>
            <a href="#demo" class="nav-link">Demo</a>
            <a href="#contact" class="nav-link">Contact</a>
            <button class="btn btn-outline" onclick="showLogin()">Sign In</button>
            <button class="btn btn-primary" onclick="showRegister()">Get Started</button>
        `
  }
}

// Demo functions
function showDemoTab(tabName) {
  // Hide all demo panels
  const panels = document.querySelectorAll(".demo-panel")
  panels.forEach((panel) => panel.classList.remove("active"))

  // Remove active class from all tabs
  const tabs = document.querySelectorAll(".demo-tab")
  tabs.forEach((tab) => tab.classList.remove("active"))

  // Show selected panel
  const selectedPanel = document.getElementById(`demo-${tabName}`)
  if (selectedPanel) {
    selectedPanel.classList.add("active")
  }

  // Add active class to selected tab
  event.target.classList.add("active")
}

// Dashboard functions
function showDashboardTab(tabName) {
  // Hide all dashboard tabs
  const tabs = document.querySelectorAll(".dashboard-tab")
  tabs.forEach((tab) => tab.classList.remove("active"))

  // Remove active class from all nav items
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => item.classList.remove("active"))

  // Show selected tab
  const selectedTab = document.getElementById(`dashboard-${tabName}`)
  if (selectedTab) {
    selectedTab.classList.add("active")
  }

  // Add active class to selected nav item
  if (event && event.target) {
    event.target.classList.add("active")
  }
}

function updateDashboardContent() {
  if (!currentUser) return

  // Update user tickets count
  const userTickets = tickets.filter((ticket) => ticket.user === currentUser.name)
  const openTickets = userTickets.filter((ticket) => ticket.status === "open")
  const resolvedTickets = userTickets.filter((ticket) => ticket.status === "resolved")

  // Update dashboard stats
  const dashboardStats = document.querySelectorAll(".dashboard-stat .stat-info h3")
  if (dashboardStats.length >= 3) {
    dashboardStats[0].textContent = userTickets.length
    dashboardStats[1].textContent = openTickets.length
    dashboardStats[2].textContent = resolvedTickets.length
  }

  // Update recent tickets
  updateRecentTickets()
  updateMyTickets()
}

function updateRecentTickets() {
  const ticketList = document.querySelector("#dashboard-overview .ticket-list")
  if (!ticketList) return

  const userTickets = tickets
    .filter((ticket) => ticket.user === currentUser.name)
    .sort((a, b) => b.created - a.created)
    .slice(0, 3)

  ticketList.innerHTML = userTickets
    .map(
      (ticket) => `
        <div class="ticket-item">
            <div class="ticket-status status-${ticket.status}">${formatStatus(ticket.status)}</div>
            <div class="ticket-info">
                <h4>${ticket.title}</h4>
                <p>Created ${formatTimeAgo(ticket.created)}</p>
            </div>
            <button class="btn btn-sm" onclick="viewTicket(${ticket.id})">View</button>
        </div>
    `,
    )
    .join("")
}

function updateMyTickets() {
  const ticketsList = document.querySelector("#dashboard-my-tickets .tickets-list")
  if (!ticketsList) return

  const userTickets = tickets.filter((ticket) => ticket.user === currentUser.name)

  ticketsList.innerHTML = userTickets
    .map(
      (ticket) => `
        <div class="ticket-card">
            <div class="ticket-header">
                <h4>${ticket.title}</h4>
                <div class="ticket-badges">
                    <span class="badge badge-${ticket.status}">${formatStatus(ticket.status)}</span>
                    <span class="badge badge-${ticket.priority}">${ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority</span>
                </div>
            </div>
            <p>${ticket.description.substring(0, 100)}...</p>
            <div class="ticket-footer">
                <span class="ticket-date">Created ${formatTimeAgo(ticket.created)}</span>
                <div class="ticket-actions">
                    <button class="btn btn-sm">
                        <i class="fas fa-thumbs-up"></i>
                        ${ticket.upvotes}
                    </button>
                    <button class="btn btn-sm" onclick="viewTicket(${ticket.id})">View Details</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Ticket functions
function createTicket(event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)

  const title = form.querySelector('input[type="text"]').value
  const category = form.querySelector("select").value
  const priority = form.querySelectorAll("select")[1].value
  const description = form.querySelector("textarea").value

  if (title && category && priority && description && currentUser) {
    const newTicket = {
      id: ++currentTicketId,
      title: title,
      description: description,
      status: "open",
      priority: priority,
      category: category,
      user: currentUser.name,
      created: new Date(),
      upvotes: 0,
      downvotes: 0,
      replies: [],
    }

    tickets.push(newTicket)
    form.reset()
    showNotification("Ticket created successfully!", "success")
    showDashboardTab("my-tickets")
    updateDashboardContent()
  }
}

function viewTicket(ticketId) {
  const ticket = tickets.find((t) => t.id === ticketId)
  if (ticket) {
    showNotification(`Viewing ticket: ${ticket.title}`, "info")
    // In a real app, this would navigate to a detailed ticket view
  }
}

// Utility functions
function formatStatus(status) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatTimeAgo(date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

// Contact form
function submitContactForm(event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)

  // Simulate form submission
  setTimeout(() => {
    form.reset()
    showNotification("Message sent successfully! We'll get back to you soon.", "success")
  }, 1000)
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `

  // Add to document
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOutRight 0.3s ease"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

function getNotificationIcon(type) {
  switch (type) {
    case "success":
      return "check-circle"
    case "error":
      return "exclamation-circle"
    case "warning":
      return "exclamation-triangle"
    default:
      return "info-circle"
  }
}

function getNotificationColor(type) {
  switch (type) {
    case "success":
      return "#10b981"
    case "error":
      return "#ef4444"
    case "warning":
      return "#f59e0b"
    default:
      return "#3b82f6"
  }
}

// Add notification animations to CSS
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`
document.head.appendChild(notificationStyles)

// Initialize tooltips and other interactive elements
function initializeInteractiveElements() {
  // Add hover effects to cards
  const cards = document.querySelectorAll(".stat-card, .feature-card, .ticket-card")
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Add click effects to buttons
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `

      this.style.position = "relative"
      this.style.overflow = "hidden"
      this.appendChild(ripple)

      setTimeout(() => ripple.remove(), 600)
    })
  })
}

// Add ripple animation
const rippleStyles = document.createElement("style")
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`
document.head.appendChild(rippleStyles)

// Initialize interactive elements when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeInteractiveElements)

// Search and filter functionality for demo
function setupDemoFilters() {
  const searchInput = document.querySelector(".demo-search")
  const filterSelect = document.querySelector(".demo-filter")

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      // Simulate search functionality
      console.log("Searching for:", this.value)
    })
  }

  if (filterSelect) {
    filterSelect.addEventListener("change", function () {
      // Simulate filter functionality
      console.log("Filtering by:", this.value)
    })
  }
}

// Initialize demo filters
document.addEventListener("DOMContentLoaded", setupDemoFilters)

// Keyboard shortcuts
document.addEventListener("keydown", (event) => {
  // Ctrl/Cmd + K for search
  if ((event.ctrlKey || event.metaKey) && event.key === "k") {
    event.preventDefault()
    const searchInput = document.querySelector(".demo-search, .search-input")
    if (searchInput) {
      searchInput.focus()
    }
  }

  // Ctrl/Cmd + N for new ticket
  if ((event.ctrlKey || event.metaKey) && event.key === "n") {
    event.preventDefault()
    if (currentUser) {
      showDashboard()
      setTimeout(() => showDashboardTab("create-ticket"), 100)
    }
  }
})

// Performance optimization: Lazy load images
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading
document.addEventListener("DOMContentLoaded", lazyLoadImages)

// Export functions for global access
window.QuickDesk = {
  showLogin,
  showRegister,
  showDashboard,
  logout,
  showSection,
  toggleMobileMenu,
  showDemoTab,
  showDashboardTab,
  createTicket,
  submitContactForm,
  showNotification,
}
