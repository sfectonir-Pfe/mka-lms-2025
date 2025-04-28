import React from "react";
import { Link } from "react-router-dom";
export default function UserList() {
  return (
    <div>
      <div className="text-end">

      <Link to="add" className="btn btn-primary">
        Ajouter un utilisateur
      </Link>
      </div>
      UserList tableau 
    </div>
  );
}
