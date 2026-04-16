# JobTrackPro Frontend

React frontend for the JobTrackPro job application tracking system.

## Features

- **User Authentication**: Login and registration forms
- **Application Management**: Add, view, and delete job applications
- **Real-time Updates**: Instant UI updates with API integration
- **Responsive Design**: Mobile-friendly interface with glassmorphism styling
- **Modern React**: Built with React 19 and hooks

## Tech Stack

- **React 19** with modern hooks
- **Vite** for fast development and building
- **CSS** with glassmorphism design
- **Fetch API** for HTTP requests

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment

The frontend connects to the backend API at `http://localhost:4000` by default. Update the `API_BASE` in `src/api.js` if your backend runs on a different port.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   │   ├── Navbar.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ApplicationList.jsx
│   │   ├── AddApplicationForm.jsx
│   │   └── LoginForm.jsx
│   ├── api.js          # API service functions
│   ├── App.jsx         # Main React app
│   ├── main.jsx        # App entry point
│   └── index.css       # Global styles
├── public/             # Static assets
└── package.json
```
