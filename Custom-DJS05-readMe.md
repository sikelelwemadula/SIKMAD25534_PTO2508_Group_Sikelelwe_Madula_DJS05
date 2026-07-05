# Podcast Browsing App
# (DJS05: Show Detail Page with Routing and Navigation)

## 📌Project Overview

This is a podcast website made with React that works on all devices. For this project, the main goals are adding web page navigation and saving the user's progress automatically. While also utilizing the single page load ability of react through React Router for added functionality benefits.

When a user selects a podcast show from the main page grid, they are seamlessly routed to a dedicated, unique URL path (/show/:id) that fetches deep metadata directly from a remote API. The application is built to maximize user experience (UX) by remembering what the user was doing—preserving active search text values, sorting selections, and pagination indices when backing out of a detail screen back to the primary catalog layout.


## 📌Core Features 

### 1. Dynamic Routing & Deep Linking (react-router-dom)
• Built with semantic routing structures mapping to standalone page layout nodes.
• Utilizes dynamic path matching parameters (:id) to query individual profiles on demand.

### 2. Live API Integration & Data Fetching
• Connects to a cloud-hosted Netlify podcast API pipeline to load global lists and contextual details.
• Gracefully displays animated structural indicators during background transit phases.
• Accommodates edge-case states including network transmission breaks or invalid identifier records.

### 3. State Preservation & Seamless Back-Navigation
• Uses React Router's location history state memory stack (location.state).
• Ensures that text inputs, active filters, and position states remain unmodified when returning home.

### 4. Interactive Season Selector Component
• Built an intuitive dropdown selection matrix to toggle between distinct seasons without inducing endless vertical scroll fatigue.
• Iterates dynamically over structured episodic listings to render numbers, titles.

### 5. Code Quality & JSDoc Typing
• Fully documented using extensive JSDoc tags for clear technical documentation.
• Implements a modular file organization dividing codebases cleanly between state providers, independent hooks, page view frames, and components.


## 📌Main Code Architecture & Flow

The system flows through a set of highly focused React modules:

src/
├── api/             # Remote data communication helpers (fetchPodcasts)
├── components/      # UI elements (Header, SearchBar, SortSelect, GenreFilter, Pagination, PodcastGrid)
├── context/         # Centralized state layer engine (PodcastContext)
├── data/            # Static dictionary reference structures (Genres lookup indices)
├── pages/           # Route-level landscape targets (ShowDetail)
└── App.js           # Router tree framework & initialization triggers

## 📌API Configuration & Reference Data

Data transactions resolve through the following cloud endpoints:
• All Previews: https://podcast-api.netlify.app
• Target Show Profile: https://podcast-api.netlify.app/id/<ID> (Retrieves complex embedded structural trees containing multi-layered Season and Episode matrices)

## 📦Local Deployment Instructions

These are the steps that you can follow, so that you may be able to run this project on you local workstation:

1. Clone the Codebase
2. Install Development Dependencies
3. Launch the Local Development Server
4. Compiling Build Configurations for Production Environment
