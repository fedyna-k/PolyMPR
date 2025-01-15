type NavbarProps = {
  pages: Record<string, string>;
};

export default function Navbar(props: NavbarProps) {
  return (
    <>
      <p>{JSON.stringify(props.pages)}</p>
    </>
  );
}
