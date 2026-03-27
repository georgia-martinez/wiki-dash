# WikiDash 📚🏁

[https://wiki-dash.fly.dev/](https://wiki-dash.fly.dev/)

WikiDash is a website where users compete in daily challenges to get from one randomly generated Wikipedia article to another by clicking links within the articles. When a challenge is completed, users can see where they rank on the global leaderboard which is ranked by time taken and the number of links clicked. This project was done as part of a month long hackathon from February 27th, 2026 to March 27th, 2026.

## Tech Stack


| Layer            | Technology               |
| ---------------- | ------------------------ |
| Frontend         | React, Vite, Material UI |
| Backend          | Convex                   |
| Auth             | Clerk                    |
| Containerization | Docker                   |
| Hosting          | Fly.io                   |


## Environment Setup

### Step 1: Clone the repository

```
git clone git@github.com:georgia-martinez/wiki-dash.git
```

### Step 2: Environment variables

Copy `.env.example` and rename the copy to `.env.local`. You should see the following variables:

```
VITE_CLERK_PUBLISHABLE_KEY=
VITE_CONVEX_URL=http://127.0.0.1:3210
CONVEX_SELF_HOSTED_URL=http://127.0.0.1:3210
CONVEX_SELF_HOSTED_ADMIN_KEY=
```

- `VITE_CLERK_PUBLISHABLE_KEY`: Get this from the Clerk dashboard: [https://dashboard.clerk.com/](https://dashboard.clerk.com/) under API Keys.
- `VITE_CONVEX_URL` and `CONVEX_SELF_HOSTED_URL`: Leave as is for local development.
- `CONVEX_SELF_HOSTED_ADMIN_KEY`: This will be generated in Step 4 below. You can leave it blank for now.

### Step 3: Install Docker

Make sure Docker is installed and running before proceeding: [https://www.docker.com/get-started/](https://www.docker.com/get-started/).

Then in the root directory, run the following command to login and follow the instructions:

```
docker login
```

### Step 4: Generate the admin key

Start just the backend service, then generate an admin key:

```
docker compose up backend -d --no-deps
docker compose exec backend ./generate_admin_key.sh
```

Copy the key in its entirety, including the prefix at the beginning. Paste it as the `CONVEX_SELF_HOSTED_ADMIN_KEY` value in your `.env.local` file.

### Step 5: Run the project

Once you have your environment variables set and Docker running, start everything from the root directory:

```
docker compose up
```

Keep this process running while developing. It will watch for changes and automatically reload.

- Local frontend: [http://localhost:5173/](http://localhost:5173/)
- Local database dashboard: [http://localhost:6791](http://localhost:6791) (use the admin key from Step 4 to login)

## Setting Sample Data

When running the project locally, a challenge should be automatically generated. But if you want to populate the challenge and leaderboard data directly without playing the game, you can import sample data directly.

First, make sure the backend is running in a separate terminal if it isn't already

```
docker compose up
```

Then run the bash script from the root directory which will clear all of the existing data and replace it with the sample data

```
./back-end/import-sample-data.sh
```

To set your own sample data, modify `sample-challenge.jsonl` and `sample-leaderboard.jsonl`.

## Development Workflow

Pushing up changes to `main` auto deploys to [https://wiki-dash-staging.fly.dev/](https://wiki-dash-staging.fly.dev/). 

To promote to production, simply merge in the changes from `main` into the `production` branch which will auto deploy to [https://wiki-dash.fly.dev/](https://wiki-dash.fly.dev/)