# Reddit Bot Detection Dashboard

An interactive dashboard for comparative analysis of unsupervised learning models detecting potential bot accounts on Reddit. It visualizes model performance, characteristics, and user-level analysis.

## Getting Started

Prerequisites:
- Node.js 18+
- npm

Install and run locally:
```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app runs at `http://localhost:5173/` by default.

## Tech Stack
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Project Structure
- `src/components/` UI components
- `src/pages/` page-level components
- `src/utils/` calculation and parsing utilities
- `public/data/` CSV dataset used by the dashboard

## Deployment
You can deploy this app to any static hosting service that supports modern front-end builds (e.g., Vercel, Netlify, GitHub Pages). Build with:
```sh
npm run build
```
Then deploy the `dist/` directory.

## License
No license specified. For private use only unless otherwise noted.
