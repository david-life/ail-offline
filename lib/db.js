import { Pool } from "pg";


const mySecret = process.env['DATABASE_URL']
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Your Neon PostgreSQL URL
  ssl: {
    rejectUnauthorized: false, // Set to false for Neon PostgreSQL
  },
});

export const query = (text, params) => pool.query(text, params);

async function testConnection() {
  try {
    const result = await query("SELECT NOW()"); // Simple query to test connection
    console.log("Database connected successfully:", result.rows[0]);
  } catch (error) {
    console.error("Database connection failed:", {
      message: error.message,
      stack: error.stack,
    });console.log("Attempting to query database...");
const testConnection = await query("SELECT 1");
console.log("Database connection successful:", testConnection);

  }
}

// Run the test connection on server startup
testConnection();
