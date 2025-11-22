import { GetServerSideProps } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.params?.code as string;

  const link = await prisma.link.findUnique({ where: { code } });

  if (!link) {
    return {
      notFound: true,
    };
  }

  // Increment click count (optional)
  await prisma.link.update({
    where: { code },
    data: { clickCount: { increment: 1 }, lastClicked: new Date() },
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
