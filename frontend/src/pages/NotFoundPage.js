import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div>
      <h1>NotFound 404</h1>
      <div className="text-center mt-4">
        <Link to="/" className="text-decoration-none">
          Retour à MKA 
        </Link>
      </div>
      
    </div>
  );
}
