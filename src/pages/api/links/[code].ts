import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (req.method === "DELETE") {
    try {
      await prisma.link.delete({ where: { code: String(code) } });
      return res.status(200).json({ success: true, message: "Link deleted successfully" });
    } catch (error) {
      return res.status(404).json({ error: "Link not found" });
    }
  }

  res.setHeader("Allow", ["DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
