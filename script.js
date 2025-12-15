/*
  SCRIPT.JS
  PetalFawnStudio Portfolio
*/

var artData; // make artData accessible to other handlers outside the DOMContentLoaded scope

// --- LOCALSTORAGE PERSISTENCE --------------------------------------------
const ART_DATA_KEY = 'jessArtData';

function saveArtData() {
  localStorage.setItem(ART_DATA_KEY, JSON.stringify(artData));
}

function getInitialData() {
  // Combined and structured artwork data
  return [
    { 
      id: 1,
      category: 'ych',
      title: 'Fire Character YCH', 
      startingBid: 60,
      reservePrice: 60,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop',
      currentBid: 60,
      auctionEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      bids: []
    },
    { 
      id: 2,
      category: 'ych',
      title: 'Fantasy Warrior Pose', 
      startingBid: 70,
      reservePrice: 70,
      status: 'available',
      image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=400&fit=crop',
      currentBid: 70,
      auctionEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      bids: []
    },
    { 
      id: 3, 
      category: 'ych',
      title: 'Magical Girl YCH', 
      startingBid: 65, 
      reservePrice: 65,
      status: 'sold',
      image: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=400&h=400&fit=crop',
      currentBid: 110, // Example of a final bid
      auctionEnd: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Ended yesterday
      bids: [{ amount: 80, email: 'a@test.com' }, { amount: 110, email: 'b@test.com' }]
    },
    { 
      id: 4, 
      category: 'bases',
      title: 'Wolf Base - PSD', 
      buyNowPrice: '$30', 
      status: 'available',
      image: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400&h=400&fit=crop'
    },
    { 
      id: 5, 
      category: 'bases',
      title: 'Feline Base Pack', 
      buyNowPrice: '$35', 
      status: 'available',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop'
    },
    { 
      id: 6, 
      category: 'adopts',
      title: 'Pink Fawn Character', 
      buyNowPrice: '$45', 
      status: 'available',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
    { 
      id: 7, 
      category: 'adopts',
      title: 'Galaxy Dragon Adopt', 
      buyNowPrice: '$80', 
      status: 'available',
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop'
    },
    { 
      id: 8,
      category: 'adopts',
      title: 'Ocean Spirit Design', 
      buyNowPrice: '$55', 
      status: 'sold',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop'
    }
    ,
    // Example personal work to show on home page personal gallery
    {
      id: 9,
      category: 'personal',
      title: 'Forest Nymph Illustration',
      buyNowPrice: '—',
      status: 'available',
      image: 'https://images.unsplash.com/photo-1503264116251-35a269479413?w=600&h=600&fit=crop'
    }
  ];
}

function loadArtData() {
  const savedData = localStorage.getItem(ART_DATA_KEY);
  if (savedData) {
    artData = JSON.parse(savedData);
    // --- Data migration/validation step ---
    artData.forEach(item => {
      if (item.category === 'ych') {
        if (item.startingBid === undefined) {
          item.startingBid = 10; // Default starting bid
        }
        if (item.currentBid === undefined) {
          item.currentBid = item.startingBid;
        }
        if (item.bids === undefined) {
          item.bids = [];
        }
        if (item.auctionEnd === undefined) {
          // Set a default auction end time, e.g., 3 days from now
          item.auctionEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
        }
      }
    });
    // The data has been "migrated", so save it back to ensure it's correct for next time
    saveArtData();
  } else {
    // Fallback to initial data if nothing is in localStorage
    artData = getInitialData();
    saveArtData(); // Save the initial data
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // --- DATA ----------------------------------------------------------------
  // Load data from localStorage or use initial data
  loadArtData();

  let currentFile = null;

  // --- ELEMENTS ------------------------------------------------------------
  const adminPanel = document.getElementById('adminPanel');
  const loginForm = document.getElementById('loginForm');
  const loginView = document.getElementById('loginView');
  const adminDashboard = document.getElementById('adminDashboard');
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const categorySelect = document.getElementById('categorySelect');

  // --- ADMIN UI DYNAMIC FIELDS ------------------------------------------
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      const buyNowPriceGroup = document.getElementById('buyNowPriceGroup');
      const startingBidGroup = document.getElementById('startingBidGroup');
      if (categorySelect.value === 'ych') {
        buyNowPriceGroup.classList.add('hidden');
        startingBidGroup.classList.remove('hidden');
      } else {
        buyNowPriceGroup.classList.remove('hidden');
        startingBidGroup.classList.add('hidden');
      }
    });
  }

  // --- FLAIR ANIMATIONS (Define First) -----------------------------------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Stop observing once visible
      }
    });
  }, {
    threshold: 0.1 // Trigger when 10% of the element is visible
  });

  // Function to find and observe all animatable elements on the page
  const applyObserver = () => {
    const elementsToAnimate = document.querySelectorAll('.content-section:not(.is-visible), .gallery-item:not(.is-visible)');
    elementsToAnimate.forEach(el => {
      observer.observe(el);
    });
  };

  // --- GALLERY FUNCTIONS ---------------------------------------------------
  
  /**
   * Renders artwork into a specific grid.
   * @param {string} category - The category to display ('ych', 'bases', 'adopts')
   * @param {string} gridId - The ID of the grid element to render into.
   */
  const renderArtworks = (category, gridId) => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.innerHTML = '';
    const filteredData = artData.filter(item => item.category === category);

    if (filteredData.length === 0) {
      grid.innerHTML = '<p class="empty-gallery">No items in this category yet.</p>';
      return;
    }

    filteredData.forEach(item => {
      const div = document.createElement('div');
      div.className = `gallery-item cat-${item.category}`;

      // Create the common image part
      let itemHTML = `
        <div class="gallery-item-image">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>`;

      // Build the info block with contextual action buttons
      itemHTML += `
        <div class="gallery-item-info">
          <h4 class="gallery-item-title">${item.title}</h4>`;

      if (category === 'ych') {
        itemHTML += `<span class="info-label" style="font-size:0.8rem; color:var(--color-grey);">Starting Bid</span>
          <p class="gallery-item-price">$${item.startingBid}</p>
          <span class="info-label" style="font-size:0.8rem; color:var(--color-grey);">Current Bid</span>
          <p class="gallery-item-price">$${item.currentBid}</p>
          <button class="btn btn-primary purchase-btn" onclick="openAuctionModal(${item.id})" style="margin-top:1rem; width:100%">Place Bid</button>`;
      } else {
        itemHTML += `<span class="gallery-item-status status-${item.status}">
            ${item.status}
          </span>
          <button class="btn btn-primary purchase-btn" onclick="openArtDetailModal(${item.id})" style="margin-top:1rem; width:100%">View Details</button>`;
      }
      
      // Admin-only quick controls (mark sold)
      if (category !== 'bases') {
        itemHTML += `
            <div class="admin-quick-controls" style="margin-top:0.75rem">`;
        itemHTML += `<button class="btn btn-secondary" onclick="markSold(${item.id})">Mark Sold</button>`;
        itemHTML += `</div>`;
      }

      itemHTML += `</div>`; // close info block

      itemHTML += `<button class="delete-btn" onclick="deleteItem(${item.id})" title="Delete">✕</button>`;

      div.innerHTML = itemHTML;
      grid.appendChild(div);
    });
  };

  /**
   * Renders all galleries on the page.
   */
  const renderAllGalleries = () => {
    renderArtworks('personal', 'personalGrid');
    renderArtworks('ych', 'ychGrid');
    renderArtworks('bases', 'basesGrid');
    renderArtworks('adopts', 'adoptsGrid');
    applyObserver(); // Re-apply observer to new items
  };

  // --- ADMIN PANEL FUNCTIONS -----------------------------------------------

  window.openAdmin = function() {
    adminPanel.classList.add('active');
  }

  window.closeAdmin = function() {
    adminPanel.classList.remove('active');
  }

  window.login = function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === 'admin') {
      document.body.classList.add('admin-mode');
      loginView.classList.add('hidden');
      adminDashboard.classList.remove('hidden');
    } else {
      openAlertModal('Login Failed', '✗ Invalid credentials. Try: admin / admin');
    }
  }

  window.logout = function() {
    document.body.classList.remove('admin-mode');
    loginView.classList.remove('hidden');
    adminDashboard.classList.add('hidden');
    loginForm.reset();
    closeAdmin();
  }
  
  window.addArtwork = function() {
    if (!currentFile) {
      openAlertModal('Validation Error', '⚠ Please select an image first!');
      return;
    }

    const category = document.getElementById('categorySelect').value;
    const title = document.getElementById('artTitle').value || 'Untitled Artwork';
    const status = document.getElementById('artStatus').value;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const baseItem = {
        id: Date.now(),
        category: category,
        title: title,
        status: status,
        image: e.target.result
      };

      let newItem;
      if (category === 'ych') {
        let startingBid = parseInt(document.getElementById('artStartingBid').value.replace('$', ''), 10) || 0;
        if (startingBid < 10) {
          openAlertModal('Validation Error', 'Starting bid must be at least $10.');
          return; // Stop the function
        }
        newItem = {
          ...baseItem,
          startingBid: startingBid,
          reservePrice: startingBid, // Reserve is same as starting for now
          currentBid: startingBid,
          auctionEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Default 5 days
          bids: []
        };
      } else {
        const buyNowPrice = document.getElementById('artPrice').value || '$0';
        newItem = {
          ...baseItem,
          buyNowPrice: buyNowPrice
        };
      }
      
      artData.unshift(newItem);
      saveArtData(); // Persist data
      renderAllGalleries();
      
      // Reset form
      document.getElementById('artTitle').value = '';
      document.getElementById('artPrice').value = '';
      document.getElementById('artStartingBid').value = '';
      currentFile = null;
      uploadPreview.innerHTML = '';
      uploadPreview.classList.add('hidden');
      uploadArea.classList.remove('hidden');

      openAlertModal('Success', '✓ Artwork added successfully!');
      closeAdmin();
    };
    reader.readAsDataURL(currentFile);
  }

  window.deleteItem = function(id) {
    openConfirmationModal('Delete Item', 'Are you sure you want to delete this item? This cannot be undone.', () => {
      artData = artData.filter(item => item.id !== id);
      saveArtData(); // Persist data
      renderAllGalleries();
      openAlertModal('Success', '✓ Item deleted successfully!');
    });
  }

  // Mark an item as sold (admin quick action)
  window.markSold = function(id) {
    const item = artData.find(it => it.id === id);
    if (!item) return;
    if (item.status === 'sold') {
      openAlertModal('Already Sold', 'This item is already marked as sold.');
      return;
    }
    openConfirmationModal('Mark as Sold', 'Mark this item as SOLD?', () => {
      item.status = 'sold';
      saveArtData(); // Persist data
      renderAllGalleries();
      openAlertModal('Success', '✓ Item marked as SOLD');
    });
  }

  // --- EVENT LISTENERS -----------------------------------------------------

  // Admin login form submission
  if (loginForm) loginForm.addEventListener('submit', window.login);
  
  // File Input and Drag & Drop (only attach if elements exist - admin UI isn't present on every page)
  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      currentFile = file;
      uploadPreview.classList.remove('hidden');
      uploadArea.classList.add('hidden');
      uploadPreview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Preview"> <p>${file.name}</p>`;
    } else {
      openAlertModal('File Error', 'Please upload a valid image file.');
    }
  };
  if (fileInput && uploadArea && uploadPreview) {
    fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      handleFile(e.dataTransfer.files[0]);
    });
  }
  
  // --- INITIALIZATION ------------------------------------------------------
  renderAllGalleries();
  applyObserver();

});

/* ---------------------- Art Detail / Purchase Modal ---------------------- */

// Create the modal dynamically (shared across pages)
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('artDetailModal')) return; // already created

  const modalHtml = `
    <div class="modal-overlay" id="artDetailModal">
      <div class="modal-content art-detail-modal-content">
        <button class="close-modal" onclick="closeArtDetailModal()">&times;</button>
        <div class="modal-art-container">
          <div class="modal-art-image">
            <img src="" alt="Artwork Preview">
          </div>
          <div class="modal-art-details">
            <h3 class="modal-title"></h3>
            <span class="gallery-item-status"></span>
            <p class="modal-art-price"></p>
            <div class="modal-actions">
                <button id="modalBuyBtn" class="btn btn-primary">Buy Now</button>
                <button id="modalDownloadBtn" class="btn btn-secondary">Download</button>
            </div>
            <p class="modal-art-note">
              This is a demo. In a real transaction, you would be redirected to PayPal. Clicking "Buy Now" simulates a successful payment and starts the download.
            </p>
          </div>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const confirmationModalHtml = `
    <div class="modal-overlay" id="confirmationModal">
      <div class="modal-content">
        <h3 id="confirmationTitle" class="modal-title"></h3>
        <p id="confirmationMessage"></p>
        <div id="confirmationButtons" class="form-actions" style="justify-content:flex-end;">
          
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', confirmationModalHtml);
});

window.openArtDetailModal = function(id) {
  const modal = document.getElementById('artDetailModal');
  const item = artData.find(it => it.id === id);
  if (!modal || !item) return;

  // Populate modal content
  modal.querySelector('.modal-art-image img').src = item.image;
  modal.querySelector('.modal-art-image img').alt = item.title;
  modal.querySelector('.modal-title').textContent = item.title;
  modal.querySelector('.modal-art-price').textContent = item.buyNowPrice;
  
  const statusEl = modal.querySelector('.gallery-item-status');
  statusEl.textContent = item.status;
  statusEl.className = `gallery-item-status status-${item.status}`;

  // Configure buttons
  const buyBtn = document.getElementById('modalBuyBtn');
  const downloadBtn = document.getElementById('modalDownloadBtn');

  buyBtn.onclick = () => handleDownload(item.id);
  downloadBtn.onclick = () => triggerDownloadForItem(item);

  if (item.status === 'sold') {
    buyBtn.style.display = 'none'; // Hide buy button if sold
    downloadBtn.style.display = 'inline-block'; // Show download button
  } else {
    buyBtn.style.display = 'inline-block';
    downloadBtn.style.display = 'none'; // Hide download button if not sold
  }

  modal.classList.add('active');
}

window.closeArtDetailModal = function() {
  const modal = document.getElementById('artDetailModal');
  if (!modal) return;
  modal.classList.remove('active');
}

/* ---------------------- Confirmation & Alert Modal Handlers ---------------------- */

function openAlertModal(title, message) {
  const modal = document.getElementById('confirmationModal');
  if (!modal) return;
  
  modal.querySelector('#confirmationTitle').textContent = title;
  modal.querySelector('#confirmationMessage').textContent = message;

  const buttonsContainer = modal.querySelector('#confirmationButtons');
  buttonsContainer.innerHTML = `<button type="button" class="btn btn-primary">OK</button>`;
  buttonsContainer.querySelector('button').onclick = closeConfirmationModal;
  
  modal.classList.add('active');
}

function openConfirmationModal(title, message, onConfirm) {
  const modal = document.getElementById('confirmationModal');
  if (!modal) return;

  modal.querySelector('#confirmationTitle').textContent = title;
  modal.querySelector('#confirmationMessage').textContent = message;

  const buttonsContainer = modal.querySelector('#confirmationButtons');
  buttonsContainer.innerHTML = `
    <button type="button" class="btn btn-secondary">Cancel</button>
    <button type="button" class="btn btn-primary">Confirm</button>
  `;
  
  buttonsContainer.querySelector('.btn-secondary').onclick = closeConfirmationModal;
  buttonsContainer.querySelector('.btn-primary').onclick = () => {
    onConfirm();
    closeConfirmationModal();
  };

  modal.classList.add('active');
}

function closeConfirmationModal() {
  const modal = document.getElementById('confirmationModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

/* ---------------------- YCH Auction Modal ---------------------- */

let countdownInterval; // a place to store the countdown timer

// Create auction modal dynamically
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('auctionModal')) return;

  const modalHtml = `
    <div class="modal-overlay" id="auctionModal">
      <div class="modal-content art-detail-modal-content">
        <button class="close-modal" onclick="closeAuctionModal()">&times;</button>
        <div class="modal-art-container">
          <div class="modal-art-image">
            <img id="auctionImage" src="" alt="Artwork Preview">
          </div>
          <div class="modal-art-details">
            <h3 id="auctionTitle" class="modal-title"></h3>
            <div class="auction-info">
              <div>
                <span class="info-label">Current Bid</span>
                <p id="auctionCurrentBid" class="modal-art-price"></p>
              </div>
              <div>
                <span class="info-label">Time Left</span>
                <p id="auctionTimeLeft"></p>
              </div>
               <div>
                <span class="info-label">Bids</span>
                <p id="auctionBidCount"></p>
              </div>
            </div>
            
            <form id="bidForm">
              <input type="hidden" id="auctionItemId">
              <div class="form-group">
                <label for="bidAmount">Your Bid (min: $<span id="minBid"></span>)</label>
                <input type="number" id="bidAmount" required>
              </div>
              <div class="form-group">
                <label for="bidderEmail">Your Email</label>
                <input type="email" id="bidderEmail" required placeholder="you@example.com">
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%">Place Bid</button>
            </form>
            <div class="bid-history">
              <h4>Bid History</h4>
              <ul id="auctionBidList"></ul>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const bidForm = document.getElementById('bidForm');
  if (bidForm) {
    bidForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleBidSubmit();
    });
  }
});

function calculateTimeLeft(endDate) {
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return 'Auction Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

window.openAuctionModal = function(id) {
  const modal = document.getElementById('auctionModal');
  const item = artData.find(it => it.id === id);
  if (!modal || !item) return;

  // Clear any existing countdown
  if (countdownInterval) clearInterval(countdownInterval);

  // --- Populate static content ---
  document.getElementById('auctionItemId').value = id;
  document.getElementById('auctionImage').src = item.image;
  document.getElementById('auctionTitle').textContent = item.title;

  // --- Populate dynamic content ---
  const updateAuctionDetails = () => {
    const currentItem = artData.find(it => it.id === id); // get latest data
    document.getElementById('auctionCurrentBid').textContent = `$${currentItem.currentBid}`;
    document.getElementById('auctionBidCount').textContent = `${(currentItem.bids || []).length} bids`;
    
    const isFirstBid = (currentItem.bids || []).length === 0;
    const minBid = isFirstBid ? currentItem.startingBid : currentItem.currentBid + 1;
    document.getElementById('minBid').textContent = minBid;
    document.getElementById('bidAmount').min = minBid;
    document.getElementById('bidAmount').placeholder = minBid;

    const bidList = document.getElementById('auctionBidList');
    bidList.innerHTML = '';
    const bids = currentItem.bids || [];
    if (bids.length === 0) {
      bidList.innerHTML = '<li>No bids yet.</li>';
    } else {
      // Show bids, but anonymize email for privacy
      [...bids].reverse().forEach(bid => {
        const li = document.createElement('li');
        li.textContent = `$${bid.amount} by bidder...${bid.email.slice(-10)}`;
        bidList.appendChild(li);
      });
    }

    // --- Handle Countdown ---
    const timeLeftEl = document.getElementById('auctionTimeLeft');
    const form = document.getElementById('bidForm');
    if (new Date(currentItem.auctionEnd) < new Date()) {
      timeLeftEl.textContent = 'Auction Ended';
      if (countdownInterval) clearInterval(countdownInterval);
      form.style.display = 'none'; // Hide form if auction is over
    } else {
      timeLeftEl.textContent = calculateTimeLeft(currentItem.auctionEnd);
      form.style.display = 'block';
    }
  }
  
  updateAuctionDetails(); // initial call
  // We don't need a live data update for this demo, but this is where you'd set one up
  
  // --- Setup Countdown Timer ---
  countdownInterval = setInterval(() => {
    const timeLeftEl = document.getElementById('auctionTimeLeft');
    const timeLeft = calculateTimeLeft(item.auctionEnd);
    timeLeftEl.textContent = timeLeft;
    if (timeLeft === 'Auction Ended') {
      clearInterval(countdownInterval);
      document.getElementById('bidForm').style.display = 'none';
    }
  }, 1000);

  modal.classList.add('active');
}

window.closeAuctionModal = function() {
  const modal = document.getElementById('auctionModal');
  if (modal) modal.classList.remove('active');
  // Stop the countdown when the modal is closed
  if (countdownInterval) clearInterval(countdownInterval);
}

async function handleBidSubmit() {
  const id = parseInt(document.getElementById('auctionItemId').value, 10);
  const item = artData.find(it => it.id === id);
  const newBidAmount = parseInt(document.getElementById('bidAmount').value, 10);
  const email = document.getElementById('bidderEmail').value.trim();

  if (!item || !newBidAmount || !email) {
    return openAlertModal('Error', 'Please fill out all fields.');
  }
  if (new Date(item.auctionEnd) < new Date()) {
    return openAlertModal('Auction Ended', 'This auction has already ended.');
  }
  const isFirstBid = item.bids.length === 0;

  if (isFirstBid) {
    if (newBidAmount < item.startingBid) {
      return openAlertModal('Bid Too Low', `The first bid must be at least the starting bid of $${item.startingBid}.`);
    }
  } else {
    if (newBidAmount <= item.currentBid) {
      return openAlertModal('Bid Too Low', `Your bid must be higher than the current bid of $${item.currentBid}.`);
    }
  }

  // Add the new bid
  item.bids.push({ amount: newBidAmount, email: email });
  item.currentBid = newBidAmount;
  saveArtData();

  // Re-render the modal content to show the new bid
  openAuctionModal(id); 
  
  // Refocus the modal after update
  const modal = document.getElementById('auctionModal');
  if (modal) modal.focus();
}

// Handle direct download button (bypass modal) for faster flow
window.handleDownload = async function(id) {
  const item = artData.find(it => it.id === id);
  if (!item) return;
  if (item.status === 'sold') {
    openAlertModal('Already Sold', 'This item is already sold.');
    return;
  }

  const message = `You are about to purchase "${item.title}" for ${item.buyNowPrice}.\n\nIn a real transaction, you would be sent to PayPal. This demo will simulate a successful payment, mark the item as sold, and start your download. Proceed?`;

  openConfirmationModal('Confirm Purchase', message, async () => {
    try {
      await triggerDownloadForItem(item);
      item.status = 'sold';
      saveArtData(); // Persist data
      renderAllGalleries();
      openAlertModal('Success', '✓ Downloaded and marked as sold.');
      closeArtDetailModal();
    } catch (err) {
      console.error(err);
      openAlertModal('Download Error', 'Could not download file automatically. Opening image in new tab; please save manually.');
      window.open(item.image, '_blank');
    }
  });
}

async function triggerDownloadForItem(item) {
  // Attempt to fetch the image as blob so we can provide a proper download filename
  const resp = await fetch(item.image, { mode: 'cors' });
  if (!resp.ok) throw new Error('Failed to fetch file');
  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const ext = blob.type.split('/')[1] || 'png';
  const safeTitle = item.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  a.href = url;
  a.download = `${safeTitle}.${ext}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
