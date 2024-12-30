# Ori-Nori

## Introduction

This is portfolio project for Holberton School.

## Usage for development

### How to run commands in node container

```bash
docker compose run --rm node <command>
```

Example:

```bash
docker compose run --rm node npm install
```

### How to use bash in node container

```bash
docker compose run --rm node bash
```

## Installation for development

### Step 1: Clone the repository

```bash
git clone
```

### Step 2: Install dependencies

```bash
docker compose run --rm node npm install
```

### Step 3: Add environment variables

Copy the `.env.example` file to `.env`.

```bash
cp .env.example .env
```

Edit the `.env` file and fill in the necessary environment variables.

### Step 4: Generate Application Key

```bash
docker compose run --rm node node ace generate:key
```

### Step 5: Start the development server

```bash
docker compose up
```
