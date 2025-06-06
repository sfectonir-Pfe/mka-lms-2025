import { Toast } from "react-bootstrap";

export default function ToastError({ msg, show, setShow }) {
  return (
    <div className="position-fixed" style={{ zIndex: 9999, right: 0 }}>
      <Toast
        className="d-inline-block m-1"
        bg="danger"
        onClose={() => setShow(false)}
        show={show}
        delay={3000}
        autohide
      >
        <Toast.Header>
          {/* <img
        src="holder.js/20x20?text=%20"
        className="rounded me-2"
        alt=""
      /> */}
          <strong className="me-auto">Error</strong>
          {/* <small>11 mins ago</small> */}
        </Toast.Header>
        <Toast.Body className={"text-white"}>{msg}</Toast.Body>
      </Toast>
    </div>
  );
}
