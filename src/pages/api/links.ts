import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

// Handle GET and POST requests
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const links = await prisma.link.findMany();
      return res.status(200).json(links);
    }

    if (req.method === "POST") {
      const { url, code } = req.body;

      if (!url) return res.status(400).json({ error: "URL is required" });

      // Check if custom code exists
      if (code) {
        const existing = await prisma.link.findUnique({
          where: { code },
        });

        if (existing && existing.url !== url) {
          // Code exists for another URL — reject
          return res.status(400).json({ error: "Code already exists" });
        }

      }

      const newLink = await prisma.link.create({
        data: {
          url,
          code: code || Math.random().toString(36).substring(2, 8),
        },
      });

      return res.status(201).json(newLink);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error("Error in /api/links:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
