# ⚔️ Pixel Quest - Idle RPG Adventure

A professional Telegram Mini App with TON wallet integration and token reward system.

## ✨ Features

### 🎮 Engaging Gameplay
- **Idle RPG Combat** - Auto-battle system with manual control option
- **4 Hero Classes** - Warrior, Mage, Archer, Assassin (each with unique stats)
- **Monster Variety** - Goblins, Orcs, Skeletons, Demons, Dragons, Bosses
- **Equipment System** - Collect and equip gear to power up your hero
- **Level Progression** - Gain EXP and level up for stronger stats

### 💎 Token Reward System
- **CRYSTAL → $PIXEL** - All earned crystals convert 1:1 to $PIXEL token at launch
- **Multiple Earning Methods**:
  - Defeating monsters
  - Boss kills (5x rewards!)
  - Completing daily quests
  - Achievements
- **Transparent Tracking** - See all your earnings and transaction history

### 📜 Quest System
- Daily quests with crystal rewards
- Weekly challenges
- Achievement milestones

### 🛒 Shop System
- Mystery Eggs (random equipment)
- Rare & Legendary Eggs
- EXP Boosters
- Crystal Magnets (+50% crystal drop)

## 🚀 Deploy to Vercel

### Prerequisites
- Node.js 18+
- Vercel account

### Quick Deploy

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/pixel-quest.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Click "Deploy"

3. **Update TON Connect Manifest**
   After deployment, update `public/tonconnect-manifest.json`:
   ```json
   {
     "url": "https://your-app.vercel.app",
     "name": "Pixel Quest",
     "iconUrl": "https://your-app.vercel.app/favicon.svg"
   }
   ```

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📱 Telegram Mini App Setup

1. **Create Bot**
   - Open [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot` and follow instructions
   - Copy your bot token

2. **Configure Mini App**
   - Send `/newapp` to @BotFather
   - Select your bot
   - Enter app title: "Pixel Quest"
   - Enter app description
   - Enter Web App URL: `https://your-app.vercel.app`

3. **Set Menu Button** (optional)
   ```
   /setmenubutton
   → Select your bot
   → Enter button text: "Play Pixel Quest"
   → Enter URL: https://your-app.vercel.app
   ```

## 🎯 Game Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Create     │    │   Battle    │    │   Collect   │
│   Hero      │ →  │  Monsters   │ →  │  💎 CRYSTAL │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   Convert   │
                   │  💎 → $PIXEL│
                   │  at Launch  │
                   └─────────────┘
```

## 💰 Reward Rates

| Activity | Crystal |
|----------|---------|
| Normal Monster | 5-25 💎 |
| Boss Kill | 50-100 💎 |
| Daily Quest | 50-200 💎 |
| Weekly Quest | 500 💎 |
| Achievement | 100-1000 💎 |

**Conversion**: 1 Crystal = 1 $PIXEL token at launch

## 🏗️ Project Structure

```
pixel-quest-vercel/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with TON Connect
│   │   ├── page.tsx            # Redirect logic
│   │   ├── create/             # Hero creation page
│   │   └── game/               # Game pages
│   │       ├── layout.tsx      # Game layout with navigation
│   │       ├── page.tsx        # Battle page
│   │       ├── hero/           # Hero stats page
│   │       ├── shop/           # Shop page
│   │       ├── quest/          # Quest page
│   │       └── wallet/         # Wallet & token page
│   ├── components/
│   │   └── ui/                 # UI components
│   ├── hooks/                  # Custom hooks
│   ├── store/
│   │   └── gameStore.ts        # Zustand store (all game logic)
│   ├── types/
│   │   └── game.ts             # TypeScript types
│   └── utils/                  # Utility functions
├── public/
│   ├── favicon.svg
│   └── tonconnect-manifest.json
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── vercel.json
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State**: Zustand (with persist)
- **Animation**: Framer Motion
- **Wallet**: TON Connect UI
- **Platform**: Telegram Web Apps SDK

## 📄 License

MIT License - Feel free to use and modify!

---

Built with 💜 for the TON ecosystem
