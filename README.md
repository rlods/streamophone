# Streamophone

Interactive web-based music remixing and sampling application that allows users to create custom audio samples from multiple music sources (Deezer, Spotify, Freesound, INA) and control playback using various input devices.

## Requirements

- [Bun](https://bun.sh/) (recommended) or Node.js 20+
- [Docker](https://www.docker.com/) & Docker Compose (for production)
- Redis (for caching)

## Project Structure

```
streamophone/
├── api/          # Backend API (Express + TypeScript)
├── streamer/     # CORS proxy service (Express + TypeScript)
├── www/          # Frontend (React 18 + TypeScript + Redux)
└── docker-compose.yml
```

## Installation

### Using Bun (Recommended)

```bash
# Install all dependencies
cd api && bun install
cd ../streamer && bun install
cd ../www && bun install

# Or use the Makefile
make bun-install
```

### Using npm

```bash
# Install all dependencies
cd api && npm install
cd ../streamer && npm install
cd ../www && npm install

# Or use the Makefile
make install
```

## Development

### 1. Start Redis cache

```bash
make dev-cache
# or
docker-compose up cache
```

### 2. Configure environment

Copy `.env-test` and adjust values if needed:

```bash
source .env-test
```

### 3. Start services

Using Bun:
```bash
# Terminal 1 - API
cd api && bun run dev

# Terminal 2 - Streamer
cd streamer && bun run dev

# Terminal 3 - Frontend
cd www && bun run dev
```

Using Makefile:
```bash
make dev-api       # Start API
make dev-streamer  # Start Streamer
make dev-www       # Start Frontend
```

## Production (Docker)

### Build

```bash
make prod-build
# or
docker-compose build
```

### Run

```bash
make prod-up
# or
docker-compose up
```

## Available Scripts

### API & Streamer

| Command | Description |
|---------|-------------|
| `bun run dev` | Development mode with hot reload |
| `bun run start` | Production mode |

### Frontend (www)

| Command | Description |
|---------|-------------|
| `bun run dev` | Development server |
| `bun run build` | Production build |
| `bun run start` | Serve production build |

## Tech Stack

### Frontend
- React 18
- TypeScript
- Redux + Redux Thunk
- React Router 6
- Socket.IO Client

### Backend
- Bun runtime
- Express
- TypeScript
- Redis (caching)
- Axios

### Infrastructure
- Docker & Docker Compose
- Redis 7
- HAProxy 2.9

## Supported Audio Sources

- Deezer (Playlist, Album, Artist, Search)
- Spotify (Album, Artist, Search)
- Freesound (Pack, Search)
- INA (French National Archives)

## Supported Controllers

- Keyboard (AZERTY/QWERTY)
- MIDI Controllers (BCF2000, KORG NanoKey2, ROLI LightPadBlock)
- Custom Socket Controllers

## License

MIT
