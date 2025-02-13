# Ori&Nori 🐶 ✚ 🐱 🟰 ❤️

## Introduction 📖

This is our portfolio project Ori&Nori for Holberton School.

## Usage for development 🛠️

### How to run commands in node container 🐳

```bash
docker compose run --rm node <command>
```

Example:

```bash
docker compose run --rm node npm install
```

### How to use bash in node container 🐚

```bash
docker compose run --rm node bash
```

Ctrl + D to exit the bash.

## Installation for development ⚙️

### Step 1: Clone the repository 🧩

```bash
git clone https://github.com/thomas-maye/OriAndNori.git
```

### Step 2: Install dependencies 📦

```bash
docker compose run --rm node npm install
```

### Step 3: Add environment variables 🌍

Copy the `.env.example` file to `.env`.

```bash
cp .env.example .env
```

Edit the `.env` file and fill in the necessary environment variables.

### Step 4: Generate Application Key 🔑

```bash
docker compose run --rm node node ace generate:key
```

### Step 5: Start the development server 🚀

```bash
docker compose up -d
```

### Step 6: Access the application 🌐

Open your browser and navigate to `http://localhost:3333`.

### Step 7: Stop the development server 🛑

```bash
docker-compose down --remove-orphans
```
