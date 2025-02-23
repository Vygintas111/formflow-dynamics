import { Spinner } from "react-bootstrap";

export default function LoadingSpinner() {
  return (
    <div className="d-flex justify-content-center align-items-center p-3">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
