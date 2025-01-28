type StudentProps = { student: Student; promo?: number };

export default function Student(props: StudentProps) {
  return (
    <tr key={props.student.userId}>
      <td>{props.student.userId}</td>
      <td>{props.student.firstName}</td>
      <td>{props.student.lastName}</td>
      <td>{props.student.mail}</td>
      {props.promo && <td>{props.promo}</td>}
    </tr>
  );
}
