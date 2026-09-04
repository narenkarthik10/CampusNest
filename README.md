# CampusNest - Student City Relocation & Hostel Discovery Platform

# Project Deployed Link - https://campus-nest-iota.vercel.app

CampusNest is a specialized, web-based platform designed to streamline the process of finding and
securing student accommodation. Specifically tailored for the student demographic in Trichy and
surrounding academic institutions, the application bridges the gap between property administrators and
students seeking verified housing. The platform utilizes interactive mapping and proximity algorithms
to provide users with a comprehensive view of local hostels, paying guest (PG) facilities, and vital
neighborhood amenities.

# Interactive Geospatial Mapping

Integration with OpenStreetMap via Leaflet allows users to visually
explore accommodation options across different city zones. Custom map
markers dynamically update based on user search criteria.

# Proximity Matrix & Distance

The application employs the Haversine formula to compute and display
real-time geographical distances between selected accommodations and
nearby essential services.

# Database Schema

A fully normalized PostgreSQL database handles data persistence,
managing complex relational mapping between users, properties, favorites
lists, and user reviews.

# Backend API Infrastructure

A Node.js and Express server processes client requests, manages business
logic, and executes database transactions efficiently.


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
