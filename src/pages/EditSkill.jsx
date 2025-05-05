import { useParams } from "react-router-dom";

function EditSkill() {
  let { id } = useParams();
  return <h1>Edit Skill {id}</h1>;
}

export default EditSkill;
