import React, { useState } from "react";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import axios from "axios";

interface PhoneValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userUuid: string;
  token: string;
  onValidated: (phone: string) => void;
  initialPhone?: string;
}

export const PhoneValidationModal: React.FC<PhoneValidationModalProps> = ({
  isOpen,
  onClose,
  userUuid,
  token,
  onValidated,
  initialPhone = "",
}) => {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState(initialPhone.replace(/^55/, ""));
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async () => {
    setSending(true);
    setError(null);
    try {
      const phoneToSend = "55" + phone.replace(/\D/g, "");
      await axios.post(
        `https://gamification-gamma-polidigital.svc-us5.zcloud.ws/generate-token/${userUuid}?phone=${phoneToSend}`,
        {},
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStep("code");
      toast.success("Código enviado para seu WhatsApp!");
    } catch (err: any) {
      setError("Erro ao enviar código. Verifique o número e tente novamente.");
    } finally {
      setSending(false);
    }
  };

  const handleValidateCode = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await axios.get(
        `https://gamification-gamma-polidigital.svc-us5.zcloud.ws/validate-token/?user_uuid=${userUuid}&code=${code}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success("Telefone validado com sucesso!");
        const userCache = JSON.parse(localStorage.getItem("user_data") || "{}");
        userCache.phone_validated = true;
        userCache.phone = "55" + phone.replace(/\D/g, "");
        localStorage.setItem("user_data", JSON.stringify(userCache));
        onValidated("55" + phone.replace(/\D/g, ""));
        onClose();
      } else {
        setError("Código inválido. Tente novamente.");
      }
    } catch {
      setError("Código inválido ou expirado.");
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col items-center relative">
        <div className="mb-4 flex flex-col items-center">
          <div className="bg-blue-100 rounded-full p-3 mb-2">
            <svg width={32} height={32} fill="none" viewBox="0 0 24 24">
              <path d="M2 6.5A4.5 4.5 0 016.5 2h11A4.5 4.5 0 0122 6.5v11A4.5 4.5 0 0117.5 22h-11A4.5 4.5 0 012 17.5v-11z" stroke="#2563eb" strokeWidth={1.5}/>
              <path d="M7 9h10M7 13h6" stroke="#2563eb" strokeWidth={1.5} strokeLinecap="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-blue-900 mb-1">Valide seu WhatsApp</h3>
          <p className="text-sm text-gray-600 text-center">
            Para continuar, valide seu número de WhatsApp.
          </p>
        </div>
        {step === "phone" ? (
          <>
            <label className="block text-xs text-gray-500 mb-1">Seu WhatsApp</label>
            <div className="flex items-center w-full mb-2">
              <span className="text-gray-500 text-sm mr-1">+55</span>
              <InputMask
                mask="(99) 99999-9999"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="border rounded p-2 w-full"
                placeholder="(11) 91234-5678"
                disabled={sending}
              />
            </div>
            <button
              className="w-full bg-blue-700 text-white rounded-lg py-2 font-semibold mt-2 hover:bg-blue-800 transition"
              onClick={handleSendCode}
              disabled={sending || phone.replace(/\D/g, "").length < 10}
            >
              {sending ? "Enviando..." : "Enviar código"}
            </button>
          </>
        ) : (
          <>
            <label className="block text-xs text-gray-500 mb-1">Código recebido</label>
            <input
              className="border rounded p-2 w-full mb-2 text-center tracking-widest font-mono"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Digite o código"
              maxLength={8}
              disabled={sending}
            />
            <button
              className="w-full bg-blue-700 text-white rounded-lg py-2 font-semibold mt-2 hover:bg-blue-800 transition"
              onClick={handleValidateCode}
              disabled={sending || code.length < 4}
            >
              {sending ? "Validando..." : "Validar código"}
            </button>
            <button
              className="w-full text-xs text-blue-700 mt-2 underline"
              onClick={() => setStep("phone")}
              disabled={sending}
            >
              Alterar número
            </button>
          </>
        )}
        {error && <div className="text-red-500 text-xs mt-2 text-center">{error}</div>}
      </div>
    </div>
  );
};