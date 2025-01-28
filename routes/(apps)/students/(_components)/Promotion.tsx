import Student from "$root/routes/(apps)/students/(_components)/Student.tsx";

type PromotionProps = { students: Student[]; promo: Promotion };

export default function Promotion(props: PromotionProps) {
  if (!props.promo) {
    return <p>Unable to find user in database.</p>;
  }

  return (
    <div key={props.promo.id}>
      <h3>Promotion {props.promo.endyear}</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {props.students
            .filter((student) => student.promotionId === props.promo.id)
            .map((student) => <Student student={student} />)}
        </tbody>
      </table>
    </div>
  );
}
