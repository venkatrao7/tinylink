import { GetServerSideProps } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.params?.code as string;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return { notFound: true };
  }

  return {
    props: {
      code: link.code,
      url: link.url,
      clickCount: link.clickCount,
      lastClicked: link.lastClicked ? link.lastClicked.toString() : null,
      createdAt: link.createdAt.toString(),
    },
  };
};

export default function LinkStats({
  code,
  url,
  clickCount,
  lastClicked,
  createdAt,
}: any) {
  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>📊 Stats for {code}</h1>
      <p>
        <strong>Original URL:</strong>{" "}
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      </p>
      <p>
        <strong>Click Count:</strong> {clickCount}
      </p>
      <p>
        <strong>Last Clicked:</strong> {lastClicked || "Never clicked"}
      </p>
      <p>
        <strong>Created At:</strong> {createdAt}
      </p>
      <a href="/">← Back to Dashboard</a>
    </main>
  );
}
