import { GetServerSideProps } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const code = params?.code as string;

  if (!code) {
    return {
      notFound: true,
    };
  }

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return {
      notFound: true,
    };
  }

  // Update analytics: increment clickCount + update lastClicked
  await prisma.link.update({
    where: { code },
    data: {
      clickCount: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  return {
    redirect: {
      destination: link.url,
      permanent: false,
    },
  };
};

export default function RedirectPage() {
  return <p>Redirecting...</p>;
}
