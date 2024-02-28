import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import TextField from "~/components/TextField";
import { ArrowRight, ChevronLeft } from "~/svgs";
import classNames from "~/utils/classNames";
import LoginCarousel from "~/components/LoginCarousel";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [signInDisabled, setSignInDisabled] = useState(true);
  const [createAccountDisabled, setCreateAccountDisabled] = useState(true);
  const [registering, setRegistering] = useState(false);

  return (
    <>
      <div className="flex min-h-screen gap-8 bg-summit-100 px-8 py-6 font-sans">
        {!registering ? (
          <div className="flex flex-col gap-8 rounded-lg bg-white px-12 pb-8 pt-24">
            <div className="flex flex-col gap-6">
              <Image
                src="/logos/HorizontalTealEdited.svg"
                alt="Summit Logo"
                height={100}
                width={100}
              />
              <h1 className="text-xl font-semibold text-summit-700">
                Welcome to Summit
              </h1>
            </div>
            <div className="flex flex-col gap-4">
              <TextField
                input={username}
                setInput={setUsername}
                label={"Username"}
                className="w-72"
              />
              <div className="flex flex-col items-end gap-1">
                <TextField
                  input={password}
                  setInput={setPassword}
                  label={"Password"}
                  className="w-72"
                  password
                />
                <Link
                  href="/forgot-password"
                  className="text-xs text-summit-700 underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <button
              className={classNames(
                "w-full rounded-lg py-2 text-center text-sm font-semibold",
                signInDisabled
                  ? "bg-gray-300 text-gray-500"
                  : "bg-summit-700 text-white",
              )}
              disabled={signInDisabled}
            >
              Sign in
            </button>
            <div className="flex items-center gap-2">
              <div className="h-px w-full bg-gray-300" />
              <p className="text-xs text-gray-500">or</p>
              <div className="h-px w-full bg-gray-300" />
            </div>
            <button
              className="flex justify-center gap-3 rounded-lg border border-gray-300 p-2 text-sm font-semibold hover:border-gray-400"
              onClick={() =>
                signIn("google", { redirect: true, callbackUrl: "/" })
              }
            >
              <Image
                src="/svgs/Google.svg"
                alt="Google Logo"
                height={20}
                width={20}
              />
              Sign in with Google
            </button>
            <button
              className="flex items-center justify-center gap-1 text-xs text-gray-500 underline-offset-4 hover:text-summit-700 hover:underline"
              onClick={() => {
                setRegistering(true);
                setUsername("");
                setPassword("");
              }}
            >
              Don&apos;t have an account?{" "}
              <span className="text-summit-700">Create one</span>
              <ArrowRight className="mt-[2px] h-3 w-3 text-summit-700" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8 rounded-lg bg-white px-12 pb-8 pt-24">
            <div className="flex flex-col gap-6">
              <Image
                src="/logos/HorizontalTealEdited.svg"
                alt="Summit Logo"
                height={100}
                width={100}
              />
              <h1 className="text-xl font-semibold text-summit-700">
                Create an account
              </h1>
            </div>
            <div className="flex flex-col gap-4">
              <TextField
                input={email}
                setInput={setEmail}
                label={"Email"}
                className="w-72"
              />
              <TextField
                input={username}
                setInput={setUsername}
                label={"Username"}
                className="w-72"
              />
              <TextField
                input={password}
                setInput={setPassword}
                label={"Password"}
                className="w-72"
                password
              />
              <TextField
                input={confirmPassword}
                setInput={setConfirmPassword}
                label={"Confirm Password"}
                className="w-72"
                password
              />
              <div className="flex justify-center">
                <div className="flex flex-col gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <div>Must contain at least 8 characters</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <div>Must contain one uppercase letter</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                    <div>Must contain a special character (i.e. !,?,/,&,$)</div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className={classNames(
                "w-full rounded-lg py-2 text-center text-sm font-semibold",
                createAccountDisabled
                  ? "bg-gray-300 text-gray-500"
                  : "bg-summit-700 text-white",
              )}
              disabled={createAccountDisabled}
            >
              Create account
            </button>
            <div className="flex items-center gap-2">
              <div className="h-px w-full bg-gray-300" />
              <p className="text-xs text-gray-500">or</p>
              <div className="h-px w-full bg-gray-300" />
            </div>
            <button
              className="flex justify-center gap-3 rounded-lg border border-gray-300 p-2 text-sm font-semibold hover:border-gray-400"
              onClick={() =>
                signIn("google", { redirect: true, callbackUrl: "/" })
              }
            >
              <Image
                src="/svgs/Google.svg"
                alt="Google Logo"
                height={20}
                width={20}
              />
              Sign up with Google
            </button>
            <button
              className="flex items-center justify-center gap-1 text-xs text-gray-500 underline-offset-4 hover:text-summit-700 hover:underline"
              onClick={() => {
                setRegistering(false);
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setEmail("");
              }}
            >
              Already have an account?{" "}
              <span className="text-summit-700">Sign in</span>
              <ArrowRight className="mt-[2px] h-3 w-3 text-summit-700" />
            </button>
          </div>
        )}
        <div className="flex w-full flex-col justify-between">
          <div className="flex w-full justify-end">
            <button className="flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">
              <ChevronLeft className="h-6 w-6 rounded-full bg-summit-700/20 p-1" />
              Back to home
            </button>
          </div>
          <LoginCarousel />
        </div>
      </div>
    </>
  );
}
