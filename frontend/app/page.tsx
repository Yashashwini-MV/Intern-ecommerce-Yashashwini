import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-10 w-[420px] text-center">
        <h1 className="text-4xl font-bold text-blue-600">
          ShopEase
        </h1>

        <p className="mt-3 text-gray-600">
          Welcome to our E-Commerce Store
        </p>

        <div className="mt-8 flex justify-center gap-5">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
