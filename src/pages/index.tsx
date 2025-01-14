import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Summit</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/SimpleTeal.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-summit-700 to-summit-900">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Summit
          </h1>
          <h2 className="text-lg font-medium text-white">
            Empowering student organizations. Founded by students, for students.
          </h2>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
            <Link
              href="/profile"
              className="w-40 rounded-full bg-white bg-opacity-10 px-10 py-3 text-center  font-semibold text-white hover:bg-opacity-20"
            >
              Profile
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="w-40 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
