/*
  SCRIPT.JS
  PetalFawnStudio Portfolio
*/

var artData; // make artData accessible to other handlers outside the DOMContentLoaded scope
document.addEventListener('DOMContentLoaded', () => {

  // --- DATA ----------------------------------------------------------------
  // Combined and structured artwork data (assign to the outer-scoped var `artData`)
  artData = [
    { 
      id: 1,
      category: 'ych',
      title: 'Fire Character YCH', 
      price: '$60', 
      status: 'available',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=400&fit=crop'
    },
    { 
      id: 2,
      category: 'ych',
      title: 'Fantasy Warrior Pose', 
      price: '$70', 
      status: 'available',
      image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=400&fit=crop'
    },
    { 
      id: 3, 
      category: 'ych',
      title: 'Magical Girl YCH', 
      price: '$65', 
      status: 'sold',
      image: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=400&h=400&fit=crop'
    },
    { 
      id: 4, 
      category: 'bases',
      title: 'Wolf Base - PSD', 
      price: '$30', 
      status: 'available',
      image: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400&h=400&fit=crop'
    },
    { 
      id: 5, 
      category: 'bases',
      title: 'Feline Base Pack', 
      price: '$35', 
      status: 'available',
      image: 'https://images.unsplash.com/photo-1573865526739-10c1dd7aa59e?w=400&h=400&fit=crop'
    },
    { 
      id: 6, 
      category: 'adopts',
      title: 'Pink Fawn Character', 
      price: '$45', 
      status: 'available',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    },
    { 
      id: 7, 
      category: 'adopts',
      title: 'Galaxy Dragon Adopt', 
      price: '$80', 
      status: 'available',
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop'
    },
    { 
      id: 8,
      category: 'adopts',
      title: 'Ocean Spirit Design', 
      price: '$55', 
      status: 'sold',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop'
    }
    ,
    // Example personal work to show on home page personal gallery
    {
      id: 9,
      category: 'personal',
      title: 'Forest Nymph Illustration',
      price: '—',
      status: 'available',
      image: 'https://images.unsplash.com/photo-1503264116251-35a269479413?w=600&h=600&fit=crop'
    }
  ];

  let currentFile = null;

  // --- ELEMENTS ------------------------------------------------------------
  const adminPanel = document.getElementById('adminPanel');
  const loginForm = document.getElementById('loginForm');
  const loginView = document.getElementById('loginView');
  const adminDashboard = document.getElementById('adminDashboard');
  const uploadArea = document.getElementById('uploadArea');
  const uploadPreview = document.getElementById('uploadPreview');
  const fileInput = document.getElementById('fileInput');

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
          <h4 class="gallery-item-title">${item.title}</h4>
          <span class="gallery-item-status status-${item.status}">
            ${item.status}
          </span>`;

      if (category === 'ych') {
        itemHTML += `
            <button class="btn btn-primary purchase-btn" onclick="openPurchaseModal(${item.id})" style="margin-top:1rem; width:100%">Contact / Bid (Starts at ${item.price})</button>`;
      } else if (category === 'bases') {
        itemHTML += `
            <button class="btn btn-primary purchase-btn" onclick="handleDownload(${item.id})" style="margin-top:1rem; width:100%">Purchase / Download (${item.price})</button>`;
      } else { // adopts and other categories
        itemHTML += `
            <button class="btn btn-primary purchase-btn" onclick="handleDownload(${item.id})" style="margin-top:1rem; width:100%">Buy Now (${item.price})</button>`;
      }

      // Admin-only quick controls (mark sold)
      itemHTML += `
          <div class="admin-quick-controls" style="margin-top:0.75rem">`;
      itemHTML += `<button class="btn btn-secondary" onclick="markSold(${item.id})">Mark Sold</button>`;
      itemHTML += `</div>`;

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
      alert('✗ Invalid credentials. Try: admin / admin');
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
      alert('⚠ Please select an image first!');
      return;
    }

    const category = document.getElementById('categorySelect').value;
    const title = document.getElementById('artTitle').value || 'Untitled Artwork';
    const price = document.getElementById('artPrice').value || '$0';
    const status = document.getElementById('artStatus').value;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const newItem = {
        id: Date.now(),
        category: category,
        title: title,
        price: price,
        status: status,
        image: e.target.result
      };
      
      artData.unshift(newItem);
      renderAllGalleries();
      
      // Reset form
      document.getElementById('artTitle').value = '';
      document.getElementById('artPrice').value = '';
      currentFile = null;
      uploadPreview.innerHTML = '';
      uploadPreview.classList.add('hidden');
      uploadArea.classList.remove('hidden');

      alert('✓ Artwork added successfully!');
      closeAdmin();
    };
    reader.readAsDataURL(currentFile);
  }

  window.deleteItem = function(id) {
    if (confirm('Are you sure you want to delete this item? This cannot be undone.')) {
      artData = artData.filter(item => item.id !== id);
      renderAllGalleries();
      alert('✓ Item deleted successfully!');
    }
  }

  // Mark an item as sold (admin quick action)
  window.markSold = function(id) {
    const item = artData.find(it => it.id === id);
    if (!item) return;
    if (item.status === 'sold') {
      alert('Item is already marked as sold.');
      return;
    }
    if (!confirm('Mark this item as SOLD?')) return;
    item.status = 'sold';
    renderAllGalleries();
    alert('✓ Item marked as SOLD');
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
      alert('Please upload a valid image file.');
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

/* ---------------------- Purchase / Download Modal & Handlers ---------------------- */

// Create purchase modal dynamically (shared across pages)
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('purchaseModal')) return; // already created

  const modalHtml = `
    <div class="modal-overlay" id="purchaseModal">
      <div class="modal-content">
        <button class="close-modal" onclick="closePurchaseModal()">&times;</button>
        <h3 class="modal-title">Contact / Purchase</h3>
        <form id="purchaseForm">
          <input type="hidden" id="purchaseItemId">
          <div class="form-group">
            <label for="buyerEmail">Your Email</label>
            <input type="email" id="buyerEmail" required placeholder="you@example.com">
          </div>
          <div class="form-group">
            <label for="buyerMessage">Message / Notes</label>
            <textarea id="buyerMessage" rows="4" placeholder="Include any references or notes"></textarea>
          </div>
          <div class="form-group">
            <label for="buyerFile">Attach reference (PNG/JPG) — optional</label>
            <input type="file" id="buyerFile" accept="image/*">
          </div>
          <div style="display:flex; gap:1rem; justify-content:space-between; margin-top:1rem">
            <button type="submit" class="btn btn-primary">Send</button>
            <button type="button" class="btn btn-secondary" onclick="closePurchaseModal()">Cancel</button>
          </div>
        </form>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // attach submit handler if form exists; otherwise use delegated submit listener as fallback
  const purchaseForm = document.getElementById('purchaseForm');
  if (purchaseForm) {
    purchaseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handlePurchaseSubmit();
    });
  } else {
    // delegated fallback in case insertion timing differs across pages/environments
    document.addEventListener('submit', function delegatedPurchase(e) {
      if (e.target && e.target.id === 'purchaseForm') {
        e.preventDefault();
        handlePurchaseSubmit();
        document.removeEventListener('submit', delegatedPurchase);
      }
    });
  }
});

window.openPurchaseModal = function(id) {
  const modal = document.getElementById('purchaseModal');
  const item = artData.find(it => it.id === id);
  if (!modal || !item) return;
  document.getElementById('purchaseItemId').value = id;
  // Prefill message with item info
  document.getElementById('buyerMessage').value = `I'm interested in ${item.title} (${item.price}). Please contact me with details.`;
  modal.classList.add('active');
}

window.closePurchaseModal = function() {
  const modal = document.getElementById('purchaseModal');
  if (!modal) return;
  modal.classList.remove('active');
}

async function handlePurchaseSubmit() {
  const id = parseInt(document.getElementById('purchaseItemId').value, 10);
  const email = document.getElementById('buyerEmail').value.trim();
  const message = document.getElementById('buyerMessage').value.trim();
  const fileInput = document.getElementById('buyerFile');
  const item = artData.find(it => it.id === id);
  if (!item) return alert('Item not found');

  // For YCH, open mail client with prefilled details so buyer can attach files
  if (item.category === 'ych') {
    const subject = encodeURIComponent(`YCH Bid: ${item.title} - ${item.price}`);
    let body = `Hello,%0D%0A%0D%0AI would like to bid on ${item.title} (${item.price}).%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0AContact Email: ${encodeURIComponent(email)}%0D%0A%0D%0APlease attach any reference images to this email and send to petalfawnstudio@gmail.com.`;
    // Open mail client
    window.location.href = `mailto:petalfawnstudio@gmail.com?subject=${subject}&body=${body}`;
    closePurchaseModal();
    alert('Opened your mail client. Please attach your reference file (if any) and send to petalfawnstudio@gmail.com');
    return;
  }

  // For bases/adopts: attempt to fetch the image and trigger download, then mark as sold
  try {
    await triggerDownloadForItem(item);
    item.status = 'sold';
    renderAllGalleries();
    alert('✓ Purchase complete — file downloaded and item marked as sold.');
  } catch (err) {
    console.error(err);
    alert('Could not download file automatically. Opening image in new tab; please save manually.');
    window.open(item.image, '_blank');
  }

  closePurchaseModal();
}

// Handle direct download button (bypass modal) for faster flow
window.handleDownload = async function(id) {
  const item = artData.find(it => it.id === id);
  if (!item) return;
  if (item.status === 'sold') { alert('This item is already sold.'); return; }

  if (!confirm(`Proceed to download/purchase "${item.title}" for ${item.price}?\nThis demo flow provides a direct download and will mark the item as sold.`)) return;
  try {
    await triggerDownloadForItem(item);
    item.status = 'sold';
    renderAllGalleries();
    alert('✓ Downloaded and marked as sold.');
  } catch (err) {
    console.error(err);
    window.open(item.image, '_blank');
  }
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
