# AfroChef 🍲

A modern recipe management platform celebrating African cuisine, built with Next.js, TypeScript, and Supabase.

## Features

- 🔍 Browse and search authentic African recipes
- 🤖 AI-powered recipe generation
- 👤 User authentication and profiles
- 📝 Create and edit your own recipes
- ❤️ Save favorite recipes
- 🎨 Neomorphic UI design
- 📱 Responsive design for all devices

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- A Supabase account and project

### Configuration

1. Clone the repository:

```bash
git clone https://github.com/DripCode-Studio/afro-chef.git
cd afro-chef
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Copy the `.env` file and fill in your Supabase credentials:

```env
# ==========================================
# SUPABASE CONFIGURATION - PUBLIC (Browser)
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# ==========================================
# SUPABASE CONFIGURATION - PRIVATE (Server)
# ==========================================
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# ==========================================
# AUTHENTICATION CONFIGURATION
# ==========================================
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/my

# ==========================================
# AI/LLM CONFIGURATION
# ==========================================
# The AI SDK uses the Vercel AI Gateway by default
# OpenAI models are supported without additional configuration
# If using other AI providers, add their API keys here
```

**Where to find these values:**

- Go to your Supabase project dashboard
- Navigate to `Settings` > `API`
- Copy the `Project URL` and `API Keys` (anon/public and service_role)
- The JWT secret is also found in the API settings

4. Set up the database:

Run the SQL scripts in order from the `scripts/` directory in your Supabase SQL editor:

```
001_create_tables.sql
002_enable_rls.sql
003_profile_trigger.sql
004_seed_recipes.sql
005_seed_ingredients.sql
006_seed_steps.sql
```

5. Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
afro-chef/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── builder/           # Recipe builder
│   ├── my/                # User dashboard
│   └── recipes/           # Recipe pages
├── components/            # React components
│   ├── ai/               # AI-related components
│   ├── dashboard/        # Dashboard components
│   ├── editor/           # Recipe editor components
│   ├── layout/           # Layout components
│   ├── recipes/          # Recipe components
│   └── ui/               # UI components
├── lib/                   # Utility functions and types
│   └── supabase/         # Supabase client configuration
├── public/                # Static assets
├── scripts/               # Database scripts
└── styles/                # Global styles
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Database Schema

The application uses the following main tables:

- `profiles` - User profiles
- `recipes` - Recipe data
- `ingredients` - Recipe ingredients
- `steps` - Recipe cooking steps
- `favorites` - User favorite recipes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
