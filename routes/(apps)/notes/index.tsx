type ModulesProps = Record<string | number | symbol, never>;

export default function Modules(_props: ModulesProps) {
  return (
    <>
      <a href="notes/test" f-partial={"notes/partial/test"}>click</a>
    </>
  );
}