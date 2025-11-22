import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const links = await prisma.link.findMany({ orderBy: { createdAt: "desc" } });
      return res.status(200).json(links);
    }

    if (req.method === "POST") {
      const { url, code } = req.body;

      if (!url) return res.status(400).json({ error: "URL is required" });

      const existing = await prisma.link.findUnique({ where: { code } });
      if (existing) return res.status(409).json({ error: "Code already exists" });

      const newLink = await prisma.link.create({ data: { url, code } });
      return res.status(201).json(newLink);
    }

    if (req.method === "DELETE") {
      const { code } = req.query;
      await prisma.link.delete({ where: { code: String(code) } });
      return res.status(200).json({ message: "Deleted successfully" });
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
