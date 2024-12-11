import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return (
    <div className="flex flex-col h-screen items-center justify-center ">
      <h1 className="uppercase font-bold">Linkdrasill</h1>
      <Link href="/linktree">Go to Links</Link>
    </div>
  );
}
