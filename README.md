<p align="center">
  <img src="./public/axiomid-banner.png" alt="AxiomID Banner" width="100%" />
</p>

<h1 align="center">AxiomID: The Human Authorization Protocol</h1>

<p align="center">
  <em>Built by <a href="https://github.com/Moeabdelaziz007">Mohamed Abdelaziz</a></em>
</p>

<p align="center">
  <strong>"Identity is an Asset, not a Biometric."</strong>
</p>

<div align="center">
  <img src="https://img.shields.io/badge/Status-Beta_V1.0.4-00ff41?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Stack-Next.js_15_|_Prisma_|_SQLite-000000?style=for-the-badge&logo=next.js" alt="Stack" />
  <img src="https://img.shields.io/badge/Aesthetic-Sophisticated_Cyberpunk-00d4ff?style=for-the-badge" alt="Aesthetic" />
</div>

<p align="center">
  <a href="#-philosophy">🧬 Philosophy</a> •
  <a href="#-architecture">📐 Architecture</a> •
  <a href="#-roadmap">🗺️ Roadmap</a> •
  <a href="#-quick-start">🚀 Quick Start</a>
</p>

---

## 🧬 Philosophy

**AxiomID** rejects the dystopian future of iris scans and hardware dependencies. We believe your identity is defined by your **history**, your **actions**, and your **reputation**—not your biology.

We are building the **"Quantum Command Center"** for digital identity:
- **Software-First:** No Orbs, no hardware.
- **Privacy-Preserving:** Zero-knowledge proofs of humanity.
- **Asset-Based:** Your reputation is an asset you build, own, and stake.

### The "Sophisticated Engineering" Aesthetic
Our UI reflects our code: dark, precise, and data-dense. We use an **OLED Black** foundation with **Neon Emerald** (Verified) and **Electric Blue** (Data) accents. It feels like jacking into a secure mainframe, not browsing a marketing site.

---

## 📐 Architecture & Tiers

AxiomID uses a progressive trust model. You don't just "have" an ID; you **level up** your clearance.

| Tier | XP | Status | Description |
| :--- | :--- | :--- | :--- |
| **GHOST** | 0 | 🌑 Locked | Unverified. Lurker status. Limited access. |
| **SPARK** | 100 | 🟢 Verified | Basic "Proof of Humanity". Social accounts connected. |
| **PULSE** | 500 | 🔵 Active | Proven history. Active wallet, transaction history. |
| **AXIOM** | 1000 | 🟣 Elite | High reputation. Financial stake locked. Vouching power. |

### 🛠️ Tech Stack
- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Framer Motion (Bento Grids, Floating Elements).
- **Backend:** Next.js API Routes (Serverless).
- **Database:** SQLite (via **Prisma ORM**) for rapid MVP execution. Ready for migration to PostgreSQL/Supabase.
- **Auth:** Web3 First (Wallet Connect).

### 📂 Project Structure
```
axiomid/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 🖥️ The Command Center (Bento Grid)
│   │   ├── globals.css           # 🎨 Dark Engineering Theme
│   │   ├── api/                  # ⚡ Backend Logic
│   │   │   ├── auth/connect/     # Wallet Authentication
│   │   │   ├── action/claim/     # XP & Tier Logic
│   │   │   └── user/status/      # Data Fetching
│   │   └── context/
│   │       └── wallet-context.tsx # 🧠 Global State Management
│   └── lib/
│       ├── prisma.ts             # Database Client
│       ├── actions.ts            # "Proof of Work" Definitions
│       └── tiers.ts              # Gamification Logic
├── prisma/
│   ├── schema.prisma             # Database Schema
│   └── dev.db                    # Local SQLite DB
└── STRATEGY.md                   # 📜 Competitive Analysis & Future Roadmap
```

---

## 🤝 The Consortium

| Entity | Classification | Primary Function |
| :--- | :--- | :--- |
| **Mohamed Abdelaziz** | Founder & Lead Architect | Vision, First Principles & Final Authority |
| **Gemini (Google)** | Strategic AI Model | Systems Thinking, Logic Core & Roadmap Strategy |
| **Jules (Google)** | Autonomous Agent | Code Generation, Refactoring & Security |
| **Google Antigravity** | Agentic IDE Platform | Mission Control, Cross-Surface Orchestration & Vibe-Coding Environment |

<p align="center">
  <em>Built in the Agent-First Era using Google Antigravity.</em>
</p>

---

## 🗺️ Roadmap & Strategy

We have conducted a deep **[Competitive Analysis](./STRATEGY.md)** of World Network, Gitcoin Passport, and others.

**Upcoming "Moonshot" Features:**
1.  **The Meta-Aggregator:** Ingest scores from Gitcoin/WorldID to boost Axiom XP.
2.  **Proof of Time-Stake ("The Vault"):** Lock USDC to prove long-term human intent.
3.  **Axiom Vouch:** High-stakes peer-to-peer verification.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Moeabdelaziz007/axiomid-project.git
cd axiomid-project

# 2. Install dependencies
npm install

# 3. Initialize Database (SQLite)
npx prisma db push

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click **"INITIALIZE SEQUENCE"** to connect your wallet (simulated or real).

---

## 📄 License

Proprietary — All Rights Reserved © 2026 Mohamed Abdelaziz.

See [`LICENSE`](./LICENSE) for full terms. This repository is private (`package.json` declares `private: true`); the source, documentation, and configuration may not be copied, redistributed, sublicensed, or used to train any model without prior written permission.

---

<br/>

<div dir="rtl">

---

<h1 align="center">AxiomID: بروتوكول التفويض البشري</h1>

<p align="center">
  <strong>「الهوية هي أصل تمتلكه، وليست بصمة بيولوجية.」</strong>
</p>

---

## 🌍 الرؤية والفلسفة

نحن نرفض المستقبل الديستوبي الذي يعتمد على مسح قزحية العين والأجهزة المعقدة. **AxiomID** هو "مركز القيادة" للهوية الرقمية:
- **برمجيات أولاً (Software-First):** لا حاجة لأجهزة "Orbs".
- **الخصوصية:** إثبات الإنسانية دون كشف هويت الشخصية.
- **الأصول:** سمعتك هي أصل تبنيه وتمتلكه.

## 📐 الهيكلة والمستويات

| المستوى | XP | الحالة | الوصف |
| :--- | :--- | :--- | :--- |
| **GHOST** | 0 | 🌑 شبح | غير موثق. صلاحيات محدودة. |
| **SPARK** | 100 | 🟢 شرارة | إثبات إنسانية أساسي (حسابات اجتماعية). |
| **PULSE** | 500 | 🔵 نبض | تاريخ موثق. نشاط محفظة ومعاملات. |
| **AXIOM** | 1000 | 🟣 بدهية | سمعة عالية. رهان مالي (Stake). قوة التزكية. |

## 🚀 البدء السريع

```bash
# 1. استنساخ المستودع
git clone https://github.com/Moeabdelaziz007/axiomid-project.git
cd axiomid-project

# 2. تثبيت التبعيات
npm install

# 3. تهيئة قاعدة البيانات
npx prisma db push

# 4. تشغيل النظام
npm run dev
```

</div>
