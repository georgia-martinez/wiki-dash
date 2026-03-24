# WikiDash 📚🏁

https://wiki-dash.fly.dev/

WikiDash is a website where users compete in daily challenges to get from one randomly generated Wikipedia article to another by clicking links within the articles. When a challenge is completed, users can see where they rank on the global leaderboard which is ranked by time taken and the number of links clicked. This project was done as part of a month long hackathon from February 27th, 2026 to March 27th, 2026.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Material UI |
| Backend | Convex |
| Auth | Clerk |
| Containerization | Docker |
| Hosting | Fly.io |

## Environment Setup

### Step 1: Clone the repository

```
git clone git@github.com:georgia-martinez/wiki-dash.git
```

### Step 2: Environment variables

Copy `.env.example` and rename the copy to `.env.local`. You should see the following two variables:

```
VITE_CLERK_PUBLISHABLE_KEY=
VITE_CONVEX_URL=http://127.0.0.1:3210
```

You can get the `VITE_CLERK_PUBLISHABLE_KEY` from the Clerk dashboard: https://dashboard.clerk.com/ under API Keys. You can leave the `VITE_CONVEX_URL` as is.

### Step 3: Install Docker

Install Docker and make sure it is running before proceeding: https://www.docker.com/get-started/. 

Then in the root directory, run the following command to login and follow the instructions:

```
docker login
```

### Step 4: Run the project

Once you have your environment variables set and Docker running, start the Convex backend and frontend from the root directory:

```
docker compose up
```

Keep this process running while developing. It will watch for changes and automatically.

The local database can be viewed at http://localhost:6791. This is where the local convex dashboard is running. You will need to generate a key to login:

```
docker compose exec backend ./generate_admin_key.sh
```

Copy the key in it's entirety, including the prefix at the beginning.

If you want to input data, you may either do so manually through the local database link, or by uploading the JSON file of prepared data by running the following command:

```
npx convex import --table scores sampleData.jsonl
```

## Development Workflow

Pushing up changes to the `main` auto deploys to https://wiki-dash-staging.fly.dev/. 

To promote to production, simply merge in the changes from `main` into the `production` branch which will auto deploy to https://wiki-dash.fly.dev/