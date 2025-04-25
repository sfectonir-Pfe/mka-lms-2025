import React from 'react';
import{Link} from 'react-router-dom';
const ProfilePageActions = () => {
  return (
    <div className="row pt-1">
        <div className="col-6 mb-3">
            <h6>Email</h6>
            <p className="text-muted">info@example.com</p>
        </div>
        <div className="col-6 mb-3">
            <h6>Phone</h6>
            <p className="text-muted">123 456 789</p>
        </div>
     </div>
    
  )
}

export default ProfilePageActions
