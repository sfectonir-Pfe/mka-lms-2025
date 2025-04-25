import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPasswordpage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Password reset requested for:', email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <div className="card border-primary">
              <div className="card-body p-5 text-center">
                <h2 className="fw-bold mb-4">Email envoyé</h2>
                <div className="border-bottom border-primary mx-auto mb-4" style={{ width: '150px', height: '2px' }}></div>
                
                <p className="mb-4">Si un compte existe avec l'adresse email fournie, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.</p>
                
                <Link to="/" className="btn btn-outline-primary">Retour à la connexion</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card border-primary">
            <div className="card-body p-5">
              <div className="text-center mb-5">
                <h2 className="fw-bold">Mot de passe oublié</h2>
                <div className="border-bottom border-primary mx-auto" style={{ width: '150px', height: '2px' }}></div>
              </div>
              
              <p className="text-center mb-4">Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4 text-center">
                  <label htmlFor="email" className="form-label fw-bold">Email:</label>
                  <input 
                    type="email" 
                    className="form-control mx-auto" 
                    id="email" 
                    style={{ maxWidth: '400px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="d-grid gap-2 col-6 mx-auto">
                  <button type="submit" className="btn btn-primary py-2">Envoyer le lien</button>
                </div>
              </form>
              
              <div className="text-center mt-4">
                <Link to="/" className="text-decoration-none">Retour à la connexion</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordpage;
