import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RedirectPage() {
  const router = useRouter();
  const { code } = router.query;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    const redirect = async () => {
      try {
        const res = await fetch(`/api/links?code=${code}`);
        const data = await res.json();

        if (res.ok && data?.url) {
          window.location.href = data.url;
        } else {
          setError("Short link not found");
        }
      } catch (err) {
        setError("Error fetching link");
      }
    };

    redirect();
  }, [code]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">404 - Not Found</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg text-gray-500">Redirecting...</p>
    </div>
  );
}
