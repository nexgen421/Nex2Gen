const Loading = () => {
  return (
    <div
      className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-gray-200/95 backdrop-blur-sm"
      aria-live="assertive"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-gray-700 border-t-transparent">
          <LoaderPinwheelIcon className="h-6 w-6 text-gray-700" />
        </div>
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

function LoaderPinwheelIcon(props: { className: string }) {
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
      <path d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5 2.2 5 5 5 5-2.2 5-5" />
      <path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" />
      <path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export default Loading;
