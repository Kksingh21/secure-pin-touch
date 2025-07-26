# Secure Pin Touch

Secure Pin Touch is a modern web application focused on secure user authentication using fingerprint recognition and PIN codes. The project leverages a robust tech stack to provide a seamless and safe experience for users.

## Overview

This application allows users to register and authenticate using biometric (fingerprint) data along with a PIN code for enhanced security. The backend integration is handled via Supabase, ensuring secure storage and verification of user credentials. The user interface is built with React and styled using Tailwind CSS and shadcn-ui components for a responsive and intuitive experience.

## Features

- **Fingerprint Authentication**: Users can register their fingerprint and authenticate with it. This adds a biometric layer to security.
- **PIN Code Verification**: For additional security, users must enter a PIN code associated with their fingerprint.
- **User Registration & Management**: The app supports creating new users, linking them to their fingerprint and PIN, and managing their authentication status.
- **Responsive UI**: Built with Vite, React, and shadcn-ui, ensuring fast load times and a smooth user experience.
- **Supabase Integration**: Handles all database and authentication operations, making the app scalable and secure.

## Technologies Used

- **Vite**: Fast build tool and development server.
- **TypeScript**: Type-safe, modern JavaScript development.
- **React**: UI library for building interactive user interfaces.
- **shadcn-ui**: A set of modern UI components.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **Supabase**: Backend-as-a-Service for authentication and database.

## Getting Started

### Prerequisites

- [Node.js & npm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/Kksingh21/secure-pin-touch.git

# Step 2: Navigate to the project directory
cd secure-pin-touch

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Editing Code

You can edit this project in several ways:

- **Locally in your IDE**: Clone and push changes.
- **GitHub Web Editor**: Edit files directly on GitHub.
- **GitHub Codespaces**: Launch a cloud development environment instantly.

## Deployment

1. Build the project for production:
    ```sh
    npm run build
    ```
2. Deploy the output (typically in the `dist` folder) to your preferred static host (e.g., Vercel, Netlify, GitHub Pages).

## Custom Domains

To connect a custom domain, follow your hosting provider’s guide for domain setup.

## File Structure Highlights

- `src/components/`: Contains all major UI components, such as fingerprint authentication, PIN input, and reusable UI elements (e.g., carousel, scroll area, pagination, breadcrumb).
- `src/integrations/supabase/`: Contains Supabase client and type definitions for database interactions.
- `index.html`: The main HTML entry point for the app.
- `vite.config.ts`: Configuration for the Vite build tool.
- `tailwind.config.js`: Tailwind CSS configuration (if present).

## How It Works

1. **User Registration**: The user enters their username and registers their fingerprint and PIN.
2. **Authentication**: On login, the app verifies the fingerprint and prompts for the PIN, matching both against Supabase records.
3. **Security**: Biometric and PIN data are never stored in plain text, and all operations are securely handled via Supabase.

## License

This project currently does not specify a license.

---

Feel free to contribute, raise issues, or suggest improvements!
