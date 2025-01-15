type FooterProps = Record<string | number | symbol, never>;

export default function Footer(_props: FooterProps) {
  return (
    <footer>
      <p>
        &copy; 2025 PolyMPR -{" "}
        <a href="/about" f-client-nav={false}>About</a>
      </p>
    </footer>
  );
}
