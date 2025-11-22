import { PrismaClient } from "@prisma/client";

export async function getServerSideProps({ params }: any) {
  const prisma = new PrismaClient();
  const code = params.code;

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    return { notFound: true };
  }

  return {
    redirect: {
      destination: link.url,
      permanent: false,
    },
  };
}

export default function RedirectPage() {
  return null;
}
