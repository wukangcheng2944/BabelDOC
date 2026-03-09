export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 px-6 py-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>BabelDOC Web — PDF Scientific Paper Translation</span>
        <span>
          Powered by{" "}
          <a
            href="https://github.com/funstory-ai/BabelDOC"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            BabelDOC
          </a>
        </span>
      </div>
    </footer>
  );
}
