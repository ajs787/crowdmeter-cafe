# RU Cafe Hopping?

## Start Options!

### Option 1: Automatic Setup (Recommended)
```bash
npm run dev:auto
```
This will:
- Start the backend server with auto-reload
- Wait 3 seconds for server to start
- Automatically seed the database with cafe data
- Automatically refresh live popularity data
- **Keep refreshing data every 7 minutes automatically**
- Keep the server running

### Option 2: Shell Script
```bash
npm run dev:setup
```
Uses the `dev-setup.sh` script to do the same thing with auto-refresh.

### Option 3: Manual Steps
```bash
# Terminal 1: Start server
npm run dev

# Terminal 2: Seed data (after server starts)
npm run seed

# Terminal 3: Refresh popularity data
npm run refresh
```

## Available Commands

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Add cafes to database
- `npm run refresh` - Get live popularity data once
- `npm run dev:auto` - **Start server + auto seed/refresh every 7 minutes**
- `npm run dev:setup` - Same as above using shell script
- `npm run refresh:loop` - Run refresh every 7 minutes (server must be running)

## What Each Step Does

1. **Server Start**: Connects to MongoDB, loads environment variables
2. **Seed**: Calls Google Places API to find 11 Rutgers area cafes
3. **Refresh**: Uses Puppeteer to scrape live popularity from Google Maps

## Frontend
The React frontend should be started separately:
```bash
cd client
npm run dev
```

Your app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5175
