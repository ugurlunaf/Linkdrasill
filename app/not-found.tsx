import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-black">404</h1>
      <h2 className="text-3xl font-bold">Not Found</h2>
      <p>Could not find requested resource</p>
      <Link
        href="/"
        className="border border-purple-300 m-2 py-2 px-4 rounded-lg hover:bg-purple-200/20 ease-in duration-300 text-purple-400"
      >
        Return Home
      </Link>
    </div>
  );
}
