# NBA Player Big Board

## Overview

The NBA Player Big Board is a web application designed for basketball enthusiasts, scouts, and analysts to view, track, and evaluate NBA players, particularly focusing on draft prospects or team-specific scouting. It provides a comprehensive interface to browse players, view detailed profiles including biographical information, physical measurements, performance statistics, game logs, and aggregated scout rankings. The application is fully responsive, offering a seamless experience on both desktop and mobile devices.

## Features

*   **Player Big Board:** Displays a sortable and searchable list of players, presented in clear, responsive cards (`PlayerCard.jsx`).
*   **Search Functionality:** Allows users to quickly find players by name, team, or position.
*   **Detailed Player Profiles (`PlayerProfile.jsx`):**
    *   **Biography:** Name, position, team, height, weight, birth date, and age.
    *   **Photo:** Displays player images with placeholders for missing ones.
    *   **Measurements:** Detailed physical attributes like wingspan, standing reach, body fat, hand size, and athletic test results (e.g., vertical jump, sprint).
    *   **Scout Rankings:** Aggregates and displays rankings from various scouting sources, including an overall average and a team-specific (e.g., "Mavericks Scout Average") rank. Highlights high/low rankings relative to the average.
    *   **Player Statistics:**
        *   **Season Averages:** Viewable as totals or per-game averages, covering a wide range of statistical categories.
        *   **Game Logs:** Detailed logs for recent games, including points, rebounds, assists, shooting percentages, etc.
    *   **Scouting Reports:**
        *   Displays existing scouting notes and analysis.
        *   Allows users to submit new scouting reports via a dedicated form (`ScoutingReportForm.jsx`).
*   **Responsive Design:** All components, including the Navigation Bar (`Navbar.jsx`), Player Cards, Big Board, and Player Profiles, are optimized for various screen sizes, ensuring usability and readability on desktops, tablets, and mobile phones.
*   **Dynamic Data Loading:** Player data is loaded from local JSON sources (`dataProcessor.js`, `playerUtils.js`) and processed for display.

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool and development server for modern web projects.
*   **Material UI (MUI):** A comprehensive React UI component library that helps in building beautiful and responsive applications quickly.
*   **React Router:** For declarative routing in the application.
*   **date-fns:** For date formatting and utility functions.
*   **Custom Hooks:** Such as `useDebounce` for optimizing search input.

## Getting Started

This is a standard Vite project. To run it locally:

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    This will typically open the application in your default web browser at `http://localhost:5173` (or another port if 5173 is in use).

## Project Insights

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/lucianlavric/Dallas-Mavs)
Explore this project with a higher-level view on DeepWiki!
