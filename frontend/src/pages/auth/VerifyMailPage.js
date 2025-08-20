import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axiosInstance";

const VerifyMailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const emailFromState = location.state?.email || "";
  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // cooldown for resend
  const [cooldown, setCooldown] = useState(0);
  const sentOnceRef = useRef(false);

  useEffect(() => {
    // auto-send once if we arrived here with an email
    if (email && !sentOnceRef.current) {
      sentOnceRef.current = true;
      handleSendCode();
    }
  }, [email]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleSendCode = async () => {
    if (!email) return toast.error("Email requis");
    try {
      setIsLoading(true);
      await api.post(`/auth/send-email-code`, { email });
      toast.success("Code envoyé à votre adresse email");
      setCooldown(30); // 30s cooldown for resend
    } catch (error) {
      toast.error(error?.response?.data?.message || "Échec de l'envoi du code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !code) return toast.error("Veuillez remplir tous les champs");

    try {
      setIsLoading(true);
      const res = await api.post(`/auth/verify-email-code`, { email, code });

      toast.success("Email vérifié avec succès !");
      localStorage.setItem("authToken", res.data.data.access_token);
      localStorage.setItem("currentUser", JSON.stringify(res.data.data.user));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...res.data.data.user, token: res.data.data.access_token })
      );
      localStorage.setItem("userEmail", res.data.data.user.email);

      window.location.href = "/";
    } catch (error) {
      toast.error(error?.response?.data?.message || "Code invalide ou expiré");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow mx-auto" style={{ maxWidth: 500 }}>
        <div className="card-body">
          <h4 className="text-center mb-4">📧 Vérification par Email</h4>

          <form onSubmit={handleVerify}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                placeholder="Votre adresse email"
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!emailFromState}
              />
            </div>

            <div className="mb-3 d-flex justify-content-between align-items-center">
              <label>Code de vérification</label>
              <button
                type="button"
                className="btn btn-link btn-sm"
                onClick={handleSendCode}
                disabled={isLoading || cooldown > 0}
                title={cooldown > 0 ? `Réessayer dans ${cooldown}s` : ""}
              >
                {cooldown > 0 ? `Renvoyer le code (${cooldown})` : "Renvoyer le code"}
              </button>
            </div>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Ex: 123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
            />

            <div className="d-grid mt-4">
              <button className="btn btn-primary" type="submit" disabled={isLoading}>
                ✅ Vérifier mon email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyMailPage;
