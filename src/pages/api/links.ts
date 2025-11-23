import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Handle POST request — create a new short link
    if (req.method === "POST") {
      const { code, url } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const existing = await prisma.link.findUnique({ where: { code } });
      if (existing) {
        return res.status(400).json({ error: "Code already exists" });
      }

      const newLink = await prisma.link.create({
        data: { code, url },
      });

      return res.status(201).json(newLink);
    }
    // Handle DELETE request
    if (req.method === "DELETE") {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ error: "Code is required for deletion" });
      }

      try {
        await prisma.link.delete({
          where: { code },
        });
        return res.status(200).json({ success: true });
      } catch (err) {
        console.error("Error deleting link:", err);
        return res.status(404).json({ error: "Link not found" });
      }
    }

    // Handle GET request — retrieve short link by code
    // Handle GET request — get all links
    if (req.method === "GET") {
      const { code } = req.query;

      // If a specific code is requested, return only that one
      if (code && typeof code === "string") {
        const link = await prisma.link.findUnique({ where: { code } });
        if (!link) {
          return res.status(404).json({ error: "Link not found" });
        }
        return res.status(200).json({ url: link.url });
      }

      // Otherwise, return all links as an array
      const links = await prisma.link.findMany({
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(links);
    }


    // Invalid method
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
