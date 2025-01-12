"use client";
import { cn } from "~/lib/utils";
import { AnimatedList } from "~/components/magicui/animated-list";

interface Item {
  name: string;
  message: string;
  icon: string;
  time: string;
}

let notifications = [
  {
    name: "DHL Express",
    message: "Your package has been picked up.",
    time: "15m ago",
    icon: "📦",
  },
  {
    name: "FedEx",
    message: "Delivery scheduled for tomorrow.",
    time: "10m ago",
    icon: "🚚",
  },
  {
    name: "UPS",
    message: "Package out for delivery.",
    time: "5m ago",
    icon: "🏃‍♂️",
  },
  {
    name: "Amazon Logistics",
    message: "Your order has been shipped.",
    time: "2m ago",
    icon: "🚀",
  },
  {
    name: "USPS",
    message: "Package arrived at local facility.",
    time: "1m ago",
    icon: "🏬",
  },
];

notifications = Array.from({ length: 4 }, () => notifications).flat();

const Notification = ({ name, message, icon, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-xl p-4",
        "transition-all duration-200 ease-in-out hover:bg-white/10 dark:hover:bg-gray-800/30",
        "bg-white/5 dark:bg-gray-900/5",
        "border-b border-gray-200/10 dark:border-gray-700/10",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/40 backdrop-blur-sm">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex flex-grow flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center justify-between whitespace-pre text-lg font-medium text-gray-800 dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="truncate text-sm font-normal text-gray-600 dark:text-gray-300">
            {message}
          </p>
        </div>
      </div>
    </figure>
  );
};

function HeroNotifications({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl md:shadow-xl",
        "bg-gradient-to-br from-white/10 to-white/30 dark:from-gray-900/10 dark:to-gray-900/30",
        "backdrop-blur-md backdrop-saturate-150",
        "border border-white/20 dark:border-gray-800/20",
        className,
      )}
    >
      <div className="bg-primary/40 p-4 text-gray-800 backdrop-blur-sm dark:text-white">
        <h2 className="text-lg font-semibold">Courier Updates</h2>
      </div>
      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 flex-grow overflow-y-auto">
        <AnimatedList>
          {notifications.map((item, idx) => (
            <Notification {...item} key={idx} />
          ))}
        </AnimatedList>
      </div>
    </div>
  );
}

export default HeroNotifications;
