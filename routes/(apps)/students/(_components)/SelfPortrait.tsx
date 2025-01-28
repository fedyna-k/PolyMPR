import { CasContent } from "$root/defaults/interfaces.ts";

type SelfPortraitProps = { self: CasContent };

const regex =
  /^(?<year>\d{4})(?<month>\d{2})(?<date>\d{2})(?<hours>\d{2})(?<minutes>\d{2})(?<seconds>\d{2})Z$/;

export default function SelfPortrait(props: SelfPortraitProps) {
  const { year, month, date, hours, minutes, seconds } = props.self
    .amuDateValidation.match(regex)!.groups!;

  const validationIsoDate =
    `${year}-${month}-${date}T${hours}:${minutes}:${seconds}Z`;

  const validationDate = new Date(validationIsoDate);

  return (
    <div id="self-portrait">
      <div>Identity</div>
      <div>{props.self.supannCivilite} {props.self.displayName}</div>
      <div>Student number</div>
      <div>{props.self.uid}</div>
      <div>amU mail</div>
      <div>{props.self.mail}</div>
      <div>First amU registration</div>
      <div>{validationDate.toLocaleString()}</div>
      <div>amU class code</div>
      <div>{props.self.supannEtuEtape}</div>
    </div>
  );
}
