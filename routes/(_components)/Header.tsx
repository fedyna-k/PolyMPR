type HeaderProps = {
  link: string;
};

export default function Header(props: HeaderProps) {
  return (
    <header>
      <h1>
        <a href="/" f-client-nav={false}>PolyMPR</a>
      </h1>
      <nav>
        <a href="/apps" f-client-nav={false}>Catalog</a>
        <a href={`/log${props.link}`} f-client-nav={false}>Log {props.link}</a>
      </nav>
    </header>
  );
}
