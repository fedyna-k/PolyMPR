interface PartialLinkProps {
  link: string;
  partial: string;
  display: string;
}

export default function PartialLink(props: PartialLinkProps) {
  return (
    <a href={props.link} f-partial={props.partial}>
      {props.display}
    </a>
  );
}
