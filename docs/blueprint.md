# **App Name**: AlertFront

## Core Features:

- Hazard Reporting Form: Report submission form with geolocation and image upload. This includes the UI elements and input validation to ensure accurate hazard reporting.
- Interactive Hazard Map: Interactive map interface displaying reported hazards using clustered markers and heatmaps. Uses leaflet/react-leaflet with real-time marker updates.
- Multi-Language Support: Utilize a generative AI tool with LibreTranslate API for translating hazard reports submitted in English to Tamil.
- Alert display: Display alert reports in a clear format.
- User Authentication: Implement user authentication with role-based access (admin/volunteer/citizen).
- Admin Dashboard: Admin dashboard showing key statistics. Implements basic search and filtering.

## Style Guidelines:

- Primary color: Saturated blue (#3498db) evoking trust and stability, aligning with the platform's purpose.
- Background color: Light desaturated blue (#ecf0f1), providing a calm and clean backdrop.
- Accent color: A contrasting orange (#e67e22), for warnings and important actions.
- Body and headline font: 'PT Sans' (sans-serif) provides a modern look with a bit of personality, for headlines or body text.
- Note: currently only Google Fonts are supported.
- Use Material-UI icons to represent different hazard types.
- Mobile-first responsive design.