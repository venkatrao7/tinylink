import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (typeof code !== "string") {
    return res.status(400).json({ error: "Invalid code" });
  }

  // GET /api/links/:code  → stats for one link
  if (req.method === "GET") {
    const link = await prisma.link.findUnique({ where: { code } });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    return res.status(200).json(link);
  }

  // DELETE /api/links/:code  → delete link
  if (req.method === "DELETE") {
    try {
      await prisma.link.delete({ where: { code } });
      return res.status(200).json({ success: true, message: "Link deleted successfully" });
    } catch (error) {
      console.error("Error deleting link:", error);
      return res.status(404).json({ error: "Link not found" });
    }
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
