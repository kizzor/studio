# Multi-Client Template Setup

This project is designed to be deployed for multiple clients using dynamic configuration files and environment variables.

## Adding a New Client
1. Create a new JSON file in `src/configs/` (e.g., `brand-x.json`).
2. Follow the structure of `aurhouse.json` for brand, hero, and banner settings.
3. Update your `.env` file or deployment environment variable:
   `VITE_CLIENT_CONFIG=brand-x`

## Environment Variables
Configure these in Vercel or your local `.env.local`:
- `VITE_CLIENT_CONFIG`: The filename (without .json) of your client config.
- `VITE_WOOCOMMERCE_API_URL`: Your WooCommerce site URL.
- `VITE_WOOCOMMERCE_CONSUMER_KEY`: WooCommerce Consumer Key.
- `VITE_WOOCOMMERCE_CONSUMER_SECRET`: WooCommerce Consumer Secret.
- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key.