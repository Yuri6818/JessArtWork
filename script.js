/*
  SCRIPT.JS
  PetalFawnStudio Portfolio
*/

document.addEventListener('DOMContentLoaded', () => {

  // --- DATA ----------------------------------------------------------------
  // Combined and structured artwork data
  let artData = [
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
  ];

  let currentFile = null;

  // --- ELEMENTS ------------------------------------------------------------
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  
  // Admin Panel Elements
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
   * Renders the gallery based on a filter
   * @param {string} filter - The category to display ('all', 'ych', 'bases', 'adopts')
   */
  window.renderGallery = function(filter = 'all') {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';
    
    const filteredData = filter === 'all' 
      ? artData 
      : artData.filter(item => item.category === filter);

    if (filteredData.length === 0) {
      galleryGrid.innerHTML = '<p class="empty-gallery">No items in this category yet.</p>';
      return;
    }

    filteredData.forEach(item => {
      const div = document.createElement('div');
      div.className = `gallery-item cat-${item.category}`; // Let the observer handle the animation
      div.innerHTML = `
        <div class="gallery-item-image">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
        <div class="gallery-item-info">
          <h4 class="gallery-item-title">${item.title}</h4>
          <p class="gallery-item-price">${item.price}</p>
          <span class="gallery-item-status status-${item.status}">
            ${item.status}
          </span>
        </div>
        <button class="delete-btn" onclick="deleteItem(${item.id})" title="Delete">✕</button>
      `;
      galleryGrid.appendChild(div);
    });
  }

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
    
    // In a real application, this would be a secure check against a server
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
        id: Date.now(), // Use timestamp for a unique ID
        category: category,
        title: title,
        price: price,
        status: status,
        image: e.target.result // Base64 encoded image
      };
      
      artData.unshift(newItem); // Add to the beginning of the array
      renderGallery(); // Re-render the whole gallery
      applyObserver(); // Apply observer to the new item
      
      // Reset form
      document.getElementById('adminDashboard').querySelector('form')?.reset();
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
      renderGallery();
      applyObserver(); // Re-apply observer after deletion
      alert('✓ Item deleted successfully!');
    }
  }

  // --- EVENT LISTENERS -----------------------------------------------------

  // Gallery filter buttons
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter);
      applyObserver(); // Re-apply observer to new/filtered items
    });
  });

  // Admin login form submission
  loginForm.addEventListener('submit', window.login);
  
  // File Input and Drag & Drop
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
  
  // --- INITIALIZATION ------------------------------------------------------
  renderGallery(); // Initial render of the gallery on page load
  applyObserver(); // Apply animations to initial elements

});