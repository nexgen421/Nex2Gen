import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const socialMediaIcons = [
  {
    icon: <TwitterIcon />,
    link: "https://x.com/Nexgencourier",
    label: "Twitter",
  },
  {
    icon: <FacebookIcon />,
    link: "",
    label: "Facebook",
  },
  {
    icon: <InstagramIcon />,
    link: "https://www.instagram.com/nexgencourierservice?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    label: "Instagram",
  },
  {
    icon: <LinkedinIcon />,
    link: "https://www.linkedin.com/company/nex-gen-courier-service/posts",
    label: "LinkedIn",
  },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-100 to-gray-200 py-16 shadow-lg dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-start space-y-6">
            <Link
              href="/"
              className="group flex items-center space-x-3 transition-transform hover:scale-105"
              prefetch={false}
            >
              <Image
                src="/logo.png"
                width={60}
                height={60}
                alt="Nex Gen Courier Service Logo"
                className="rounded-lg shadow-md transition-transform group-hover:scale-110"
              />
              <span className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
                Nex Gen Courier Service
              </span>
            </Link>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
              Bringing You Closer to What You Need, When You Need It - Trusted
              Deliveries, Every Time.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
              Our Location
            </h3>
            <div className="space-y-6">
              <div className="rounded-lg bg-white/50 p-6 shadow-sm backdrop-blur-sm dark:bg-gray-800/50">
                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  <span className="block font-bold text-gray-800 dark:text-gray-100">
                    Corporate Address:
                  </span>
                  395-A Chauhan Mohhala Madanpur Khadar
                  <br />
                  Sarita Vihar
                  <br />
                  <span className="font-medium">Pincode:</span> 110076
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
              Resources
            </h3>
            <nav className="flex flex-col space-y-4">
              {["Refund Policy", "Privacy Policy"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/[\s&]+/g, "-")}`}
                  className="group flex items-center text-base text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  prefetch={false}
                >
                  <span className="relative">
                    {item}
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all group-hover:w-full dark:bg-blue-400"></span>
                  </span>
                </Link>
              ))}
              <Link
                href={`/terms-and-conditions`}
                className="group flex items-center text-base text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                Terms & Conditions
              </Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
              Contact Us
            </h3>
            <div className="space-y-4">
              <a
                href="tel:+911169653981"
                className="group flex items-center space-x-3 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <PhoneIcon className="h-5 w-5" />
                <span>+91 11 6965 3981</span>
              </a>
              <a
                href="mailto:help@nexgencourierservice.in"
                className="group flex items-center space-x-3 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <MailIcon className="h-5 w-5" />
                <span>help@nexgencourierservice.in</span>
              </a>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                {socialMediaIcons.map((social, index) => (
                  <Link
                    key={index}
                    href={social.link}
                    className="group rounded-full bg-gray-200 p-2 transition-all hover:bg-blue-100 hover:text-blue-600 dark:bg-gray-700 dark:hover:bg-blue-900 dark:hover:text-blue-400"
                    prefetch={false}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-300 pt-8 dark:border-gray-700">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Kishan Kumar Sah. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Existing icon components remain the same...

function PhoneIcon(props: { className: string }) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon(props: { className: string }) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
