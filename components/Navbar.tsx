import { FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-green-700">
          Healthy Food Locator
        </Link>

        <a
          href="https://github.com/miwalaa/healthy-food-locator"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on GitHub"
          className="text-gray-700 hover:text-black transition"
        >
          <FaGithub className="w-6 h-6" />
        </a>
      </div>
    </nav>
  );
}
