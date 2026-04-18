# Mishra Blog

A modern blog frontend built with React, Vite, Redux Toolkit, and Appwrite.

This project includes authentication state handling, reusable UI components, and Appwrite service layers for auth, posts, and file storage.

## Features

- React + Vite app with a fast development workflow
- Appwrite authentication integration (signup, login, logout, current user)
- Appwrite database integration for blog posts (CRUD-ready service methods)
- Appwrite storage integration for image and file uploads
- Global auth state management with Redux Toolkit
- Reusable component structure (header, footer, container, input, button)
- React Router and provider setup already wired in app entry

## Tech Stack

- React 19
- Vite 8
- Redux Toolkit + React Redux
- React Router DOM
- React Hook Form
- Appwrite SDK
- TinyMCE React
- Tailwind CSS 4 + PostCSS
- ESLint

## Project Structure

```text
MishraBlog/
  public/
  src/
    appwrite/
      auth.js
      db.js
    component/
      header/
      footer/
      container/
      Button.jsx
      Input.jsx
      logo.jsx
      index.js
    config/
      config.js
    store/
      authSlice.js
      store.js
    App.jsx
    main.jsx
    index.css
  package.json
  vite.config.js
```

## Prerequisites

- Node.js 18+
- npm (or another package manager)
- An Appwrite project with:
  - project ID
  - database ID
  - table ID (for posts)
  - bucket ID (for media)

## Environment Variables

Create a `.env` file in the project root with the following keys:

```env
VITE_APPWRITE_URL="https://your-appwrite-endpoint/v1"
VITE_APPWRITE_PROJECT_ID="your_project_id"
VITE_APPWRITE_DATABASE_ID="your_database_id"
VITE_APPWRITE_TABLE_ID="your_table_id"
VITE_APPWRITE_BUCKET_ID="your_bucket_id"
VITE_TINYMCE_API_KEY="your_tinymce_api_key"
```

Notes:

- Vite only exposes environment variables that start with `VITE_`.
- Never commit private credentials or admin API keys.

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

## Build for Production

```bash
npm run build
npm run preview
```

## Appwrite Integration Notes

- `src/appwrite/auth.js` contains account and session methods.
- `src/appwrite/db.js` contains post and storage service methods.
- `src/config/config.js` centralizes environment-based Appwrite config.

## Current Status

The base application shell is working with:

- shared layout (Header, main content, Footer)
- auth state check on app load
- Redux provider and router setup

This provides a solid foundation to add pages such as login, signup, post listing, and post editor.
