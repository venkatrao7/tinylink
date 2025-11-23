import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateRandomCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      let { url, code } = req.body;

      // Validate URL
      if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "URL is required" });
      }
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      // If custom code provided → validate format
      if (code) {
        if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
          return res
            .status(400)
            .json({ error: "Custom code must be 6–8 alphanumeric characters (A-Z, a-z, 0-9)" });
        }
      } else {
        // Auto-generate random code
        code = generateRandomCode();
      }

      // Check if code already exists → return 409 Conflict
      const existing = await prisma.link.findUnique({ where: { code } });
      if (existing) {
        return res.status(409).json({ error: "Code already exists" });
      }

      // Create the link
      const newLink = await prisma.link.create({
        data: {
          url,
          code,
        },
      });

      return res.status(201).json(newLink);
    } catch (error) {
      console.error("Error creating link:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "GET") {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(links);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
