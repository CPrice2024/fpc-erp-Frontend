import { useParams } from "react-router-dom";

const DepartmentMessages = () => {
  const { id } = useParams();

  return (
    <div className="page-container">
      <h1>
        Department Messages
      </h1>

      <p>
        Department ID: {id}
      </p>

      <div className="messages-container">
        Messaging module coming soon...
      </div>
    </div>
  );
};

export default DepartmentMessages;