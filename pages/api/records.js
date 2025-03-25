import { query } from "../../lib/db";

export default async function handler(req, res) {
  console.log("Request received at /api/records");

  if (req.method === "GET") {
    try {
      // Test database connection
      console.log("Testing database connection...");
      const result = await query("SELECT * FROM aildb"); // Use the correct table name
      console.log("Query result:", result.rows); // Log the response
      res.status(200).json(result.rows);
    } catch (error) {
      // Log specific error details
      console.error("Error during database query:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      res.status(500).json({ message: "Error fetching records", details: error.message });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).json({ message: "Method not allowed" });
  }

  
}
const records = [
  { id: 1, title: "Document 1", category: "Invoices", date: "2025-01-01", imageUrl: "/images/doc1.png" },
  { id: 2, title: "Document 2", category: "Contracts", date: "2025-01-02", imageUrl: "/images/doc2.png" },
];
