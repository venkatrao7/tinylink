import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(links);
  }

  if (req.method === "POST") {
    const { url, code } = req.body;

    if (!url) return res.status(400).json({ error: "URL is required" });

    // check if custom code already exists
    if (code) {
      const existing = await prisma.link.findUnique({ where: { code } });
      if (existing) {
        return res.status(400).json({ error: "Custom code already exists" });
      }
    }

    // generate random code if none provided
    const newCode = code || Math.random().toString(36).substring(2, 8);

    const newLink = await prisma.link.create({
      data: { url, code: newCode },
    });

    return res.status(201).json(newLink);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
