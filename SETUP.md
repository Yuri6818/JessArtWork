# Petal Fawn Studio - Setup & Usage Guide

## Project Overview
This is a portfolio website for Petal Fawn Studio featuring:
- **About** - Artist bio and personal works gallery
- **Commissions** - Commission pricing and quote request form
- **YCH** - "Your Character Here" auction listings
- **Bases** - Character base templates for purchase
- **Adopts** - Pre-made adoptable characters for purchase
- **T.O.S.** - Terms of service
- **Admin Panel** - Manage artwork inventory

## Files Structure
```
JessArtPage/
├── index.html          # Home page (About + Personal Works)
├── commissions.html    # Commission pricing & quote form
├── ych.html            # YCH auction listings
├── bases.html          # Base templates
├── adopts.html         # Adoptable characters
├── tos.html            # Terms of service
├── script.js           # JavaScript logic (gallery, purchases, admin)
├── style.css           # All styling
├── images/             # Background images
│   ├── background.webp
│   └── rose-background.png
└── SETUP.md            # This file
```

## Key Features

### 1. **Artwork Management**
- **Admin Panel** accessible from the Home page (click "Admin" button)
- Demo credentials: `admin` / `admin`
- Upload images and set pricing, category, and status
- Artwork data persists using browser localStorage

### 2. **Commission Quotes**
- Commission pricing page displays all service offerings with clear pricing
- Quote request form opens buyer's email client with pre-filled message
- Email goes to: **petalfawnstudio@gmail.com**
- Buyers can select commission type and describe their project

### 3. **YCH Auctions**
- YCH items show in gallery with "Contact / Bid" button
- Clicking triggers a contact form modal
- Form allows buyers to:
  - Enter their email
  - Attach reference images (PNG/JPG)
  - Add notes/message
- Submitting opens email client with all details prefilled
- Buyers send directly to **petalfawnstudio@gmail.com**

### 4. **Bases & Adopts**
- Both categories feature "Buy Now" or "Purchase" buttons
- Clicking triggers an instant download of the artwork file
- After purchase, the item is marked as **Sold** automatically
- Sold items cannot be purchased again (persists across page refreshes)

### 5. **Persistent Storage**
- All artwork data (title, price, status, image) is saved in browser localStorage
- Purchased/sold items remain marked as sold even after closing and reopening the browser
- Admin changes (add, delete, mark sold) persist automatically

### 6. **Styling**
- Dark green footer and social media section
- Removed floating rose decorations from the title
- Responsive design for mobile, tablet, and desktop
- Smooth animations for gallery items

---

## Local Testing

### Option 1: Double-click HTML files
Simply double-click `index.html` in File Explorer. This works but has some limitations with certain features.

### Option 2: Use a Local Server (Recommended)
Run a simple HTTP server to test with full functionality:

**Using Python:**
```bash
cd "C:\Users\DeanSmith\Desktop\JessArtPage"
python -m http.server 8000
```

Then open: `http://localhost:8000`

**Using Node.js (if installed):**
```bash
npx http-server -p 8000
```

---

## Deployment

### Option 1: Vercel (Recommended - Already Deployed)
The site is currently hosted at: **https://jess-art-work.vercel.app/**

To update after making changes:
1. Push changes to GitHub
2. Vercel automatically redeploys

### Option 2: Manual Deployment
1. Compress the entire `JessArtPage` folder
2. Upload to your hosting provider via FTP/cPanel
3. Update DNS records if needed

---

## Admin Panel Guide

1. **Login:**
   - Click the "Admin" button in the navigation
   - Enter credentials: `admin` / `admin`

2. **Add Artwork:**
   - Select a category (YCH, Bases, Adopts, Personal)
   - Drag & drop or click to upload an image
   - Enter artwork title and price
   - Select status (Available or Sold)
   - Click "Add Artwork"

3. **Mark as Sold:**
   - When logged in as admin, a "Mark Sold" button appears on each gallery item
   - Click to mark an item as sold (prevents future purchases)

4. **Delete Artwork:**
   - When logged in, an "✕" button appears on each item
   - Click to permanently delete (cannot be undone)

5. **Logout:**
   - Click the "Logout" button in the admin dashboard

---

## Email Integration

All contact/quote forms work via `mailto:` links, which open the user's default email client:

- **Commission Quotes** → Prefilled email to `petalfawnstudio@gmail.com`
- **YCH Bids** → Prefilled email with buyer details and reference upload instructions
- **Support** → Users can attach files manually and send

**Note:** For automated emails and file delivery, a backend server or email service (SendGrid, Mailgun, etc.) would be needed.

---

## Troubleshooting

### Images not showing up?
- Check browser console for CORS errors (right-click → Inspect → Console tab)
- Some image hosts block requests from certain domains
- Fallback: Images will open in a new tab for manual download

### Admin panel not showing?
- Make sure you're viewing from the home page (`index.html`)
- Check that JavaScript is enabled in your browser

### Forms not working?
- Forms use `mailto:` links (opens email client)
- Make sure an email client is configured on your computer
- Gmail users: Use the "Send email" feature in Gmail instead

### Items not staying sold after refresh?
- localStorage should persist across sessions
- Clear browser cache if you suspect stale data
- Check that your browser hasn't disabled localStorage

---

## Customization

### Colors
Edit `style.css` and change these CSS variables:
```css
--color-pink: #f78fb3;
--color-pink-dark: #e06c9f;
--color-gold: #ffcb6b;
```

### Fonts
Fonts are loaded from Google Fonts in the `<head>` of each HTML file:
- Heading: `'Great Vibes'` (cursive)
- Body: `'Lato'` (sans-serif)

### Social Links
Update links in `index.html` social section:
```html
<a href="https://twitter.com/PetalFawnStudio" target="_blank">Twitter</a>
<a href="https://www.deviantart.com/petalfawnstudio" target="_blank">DeviantArt</a>
<a href="https://www.furaffinity.net/user/petalfawnstudio" target="_blank">FurAffinity</a>
```

---

## Future Enhancements

- [ ] PayPal integration for instant payments
- [ ] Email notifications when items sell
- [ ] Backend server for file hosting and downloads
- [ ] User accounts for buyers to track purchases
- [ ] Commission status tracker
- [ ] Social media feed integration
- [ ] Lightbox for full-size image viewing

---

## Support

For questions or issues, contact: **petalfawnstudio@gmail.com**

---

**Last Updated:** December 10, 2025
**Version:** 1.0
