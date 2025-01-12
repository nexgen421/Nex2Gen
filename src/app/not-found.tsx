import React from "react";

import Link from "next/link";

function Component() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-8 px-4 md:px-6">
      <div className="max-w-md text-center">
        <LuggageIcon className="mx-auto h-32 w-32 text-gray-400" />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Oops, looks like you&apos;re lost
        </h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          We couldn&apos;t find the page you were looking for. Don&apos;t worry, we&apos;re
          here to help you find your way back.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus:outline-none focus:ring-1 focus:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus:ring-gray-300"
          prefetch={false}
        >
          Take me home
        </Link>
      </div>
    </div>
  );
}

function LuggageIcon(props: { className: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0" />
      <path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14" />
      <path d="M10 20h4" />
      <circle cx="16" cy="20" r="2" />
      <circle cx="8" cy="20" r="2" />
    </svg>
  );
}

const notFound = () => {
  return <Component />;
};

export default notFound;
