import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold text-white text-lg">
          🤖 RFP Generator
        </Link>
        <div className="flex gap-4 text-sm text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <a
            href="https://github.com/your-username/rfp-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
