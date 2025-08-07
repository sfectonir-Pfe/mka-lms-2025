import { Toast } from "react-bootstrap";
import React from "react";

export default function ToastSuccess({ msg, show, setShow }) {
  return (
    <div className="position-fixed" style={{ zIndex: 9999, right: 0, top: 0 }}>
      <Toast
        className="d-inline-block m-1"
        bg="success"
        onClose={() => setShow(false)}
        show={show}
        delay={3000}
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">Succès</strong>
        </Toast.Header>
        <Toast.Body className="text-white">{msg}</Toast.Body>
      </Toast>
    </div>
  );
}
