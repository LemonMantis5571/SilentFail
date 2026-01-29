#!/usr/bin/env node
// @ts-nocheck

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');

// Read .env file
let envContent = fs.readFileSync(envPath, 'utf8');

// Parse environment variables
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();

    value = value.replace(/^["'](.*)["']$/, '$1');
    env[key] = value;
  }
});

// Generate DATABASE_URL if DB variables exist
if (env.DB_USER && env.DB_PASSWORD && env.DB_NAME) {
  const host = env.DB_HOST || 'localhost';
  const port = env.DB_PORT || '5432';

  const newDatabaseUrl = `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${host}:${port}/${env.DB_NAME}`;

  // Update DATABASE_URL in .env file
  if (envContent.includes('DATABASE_URL=')) {
    envContent = envContent.replace(
      /DATABASE_URL=.*/,
      `DATABASE_URL="${newDatabaseUrl}"`
    );
  } else {
    envContent += `\nDATABASE_URL="${newDatabaseUrl}"\n`;
  }

  fs.writeFileSync(envPath, envContent);

  console.log('✅ DATABASE_URL generated successfully!');
  console.log(`📊 ${newDatabaseUrl.replace(env.DB_PASSWORD, '****')}`);
} else {
  console.log('⚠️  Missing DB_USER, DB_PASSWORD, or DB_NAME in .env');
  process.exit(1);
}