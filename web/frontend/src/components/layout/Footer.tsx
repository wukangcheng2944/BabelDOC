export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white px-6 py-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>BabelDOC Web — PDF Scientific Paper Translation</span>
        <span>
          Powered by{" "}
          <a
            href="https://github.com/funstory-ai/BabelDOC"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-blue-600 transition-colors"
          >
            BabelDOC
          </a>
        </span>
      </div>
    </footer>
  );
}
