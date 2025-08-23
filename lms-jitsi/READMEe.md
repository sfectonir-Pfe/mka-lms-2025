# 🧑‍💻 LMS + Jitsi Meet — Dev Setup

This guide helps you or any teammate run the LMS and Jitsi Meet stack locally using Docker.

---

## ⚙️ Prerequisites

- Docker + Docker Compose v2
- Node.js + npm (for LMS frontend)
- Git (to clone the repo)

---

## 🚀 Quick Start

### 1. Clone the project

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Start Jitsi locally (with recording support)

```bash
docker compose -f docker-compose.yml -f jibri.yml up -d
```

This will run all necessary services using the provided `.env` config.

- Jitsi will be available at: https://localhost:8443
- Uses guest mode (no authentication)
- Recording is enabled (via Jibri)
- Uses HTTPS (required for mic/cam in browser)

### 3. Set the LMS frontend to use your local Jitsi

In your LMS React project, create or update `.env.local`:

```env
VITE_JITSI_BASE_URL=https://localhost:8443
```

### 4. Embed Jitsi in your LMS frontend

Example iframe (basic usage):

```jsx
<iframe
  src={`${import.meta.env.VITE_JITSI_BASE_URL}/my-room#config.deeplinking.disabled=true`}
  allow="camera; microphone; fullscreen; display-capture"
  style={{ width: '100%', height: '70vh', border: 'none' }}
  title="Jitsi Meeting"
/>
```

---

## 🛠 Helpful Commands

| Task                    | Command |
|-------------------------|---------|
| Start services          | `docker compose -f docker-compose.yml -f jibri.yml up -d` |
| Stop everything         | `docker compose down` |
| View logs               | `docker compose logs -f` |
| Reset config (dev only) | `docker compose down -v && rm -rf ./config` |

---

## ✅ Notes

- Mic/cam only work on **HTTPS** (localhost:8443 is fine)
- Room links follow: `https://localhost:8443/<room-name>`
- Recording files are stored inside the Jibri container (`/config/recordings`)
- Firewall must allow UDP 10000 if remote guests will join

---

## 🤝 Credits

Built with ❤️ by the team.