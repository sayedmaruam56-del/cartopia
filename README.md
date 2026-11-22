# Cartopia

A modern, animated e-commerce web app built as my Route Academy graduation project. Dark and light themes, a black and purple design system, and a full shopping flow from browsing to checkout.

## Live Demo

https://cartopia-5hq4.vercel.app

## Features

- **Authentication**: register, login, forgot password (email code), change password, edit profile
- **Shop**: product listing with pagination, sorting, price range, category and brand filters
- **Live search**: instant search modal across the catalog (Ctrl + K)
- **Product details**: image gallery, ratings, reviews, related products
- **Categories and Brands**: listing pages and detail pages
- **Cart**: add, remove, update quantity, clear cart
- **Wishlist**: save and remove favorite products
- **Checkout**: cash on delivery and online payment (Stripe), saved addresses picker
- **Orders**: order history with a status timeline
- **Addresses**: add and delete shipping addresses
- **Design**: animated hero, glass UI, dark and light mode, custom cursor, skeleton loading, toast notifications, responsive layout

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Axios
- Route E-commerce API

## Getting Started

```bash
git clone https://github.com/sayedmaruam56-del/cartopia.git
cd YOUR-REPO
npm install
npm run dev
```

Open http://localhost:3000

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
  components/   reusable UI (Navbar, Hero, ProductCard, SearchModal, ...)
  context/      Auth, Cart, Wishlist and Toast providers
  lib/          axios instance
  products/     shop and product details
  categories/   categories pages
  brands/       brands pages
  cart/ wishlist/ checkout/ orders/ profile/ addresses/
```

## API

All data comes from the Route E-commerce API:
`https://ecommerce.routemisr.com/api/v1`

## Author

**Mariam Sayed**
Route Academy, Front-End Track
