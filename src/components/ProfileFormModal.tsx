import { useState } from "react";
import userService from "~/services/userService";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";

// Interface for postUser parameters
interface PostUserParams {
  address_cep: string;
  address_state: string;
  user_email: string;
  address_street: string;
  uuid_user: string;
  address_complement: string;
  address_number: string;
  address_city: string;
  address_neighborhood: string;
  address_property_type: string;
  user_phone: string;
  user_name: string;
}

interface ProfileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userUuid: string | null;
  token: string;
}

const ProfileFormModal: React.FC<ProfileFormModalProps> = ({ isOpen, onClose, userUuid, token }) => {
  const [formData, setFormData] = useState<PostUserParams>({
    address_cep: "",
    address_state: "",
    user_email: "",
    address_street: "",
    uuid_user: "",
    address_complement: "",
    address_number: "",
    address_city: "",
    address_neighborhood: "",
    address_property_type: "",
    user_phone: "",
    user_name: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAcceptTerms = async () => {
    if (!userUuid) {
      toast.error("UUID do usuário não encontrado. Faça login novamente.");
      return;
    }

    if (!termsAccepted) {
      toast.error("Você deve aceitar os termos de uso para continuar.");
      return;
    }

    setFormSubmitting(true);
    try {
      const updatedFormData = { ...formData, uuid_user: userUuid };
      await userService.postUser(updatedFormData, token);
      await userService.postUserTermsAcceptance(userUuid, token);
      toast.success("Sucesso!");
      onClose();
    } catch (error: any) {
      console.error("Erro ao processar:", error);

      const errorMessage =
        error.response?.data?.detail?.[0]?.msg || "Erro ao enviar dados do perfil ou aceitar termos";

      toast.error(errorMessage);
    } finally {
      setFormSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-90 flex items-center justify-center z-50 px-4 py-6">
      <div
        className="bg-white shadow-lg w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[700px] lg:max-w-[900px] h-auto rounded-lg flex flex-col"
        style={{
          padding: "24px",
          gap: "6px",
          borderRadius: "8px",
        }}
      >
        {/* Logo Poli */}
        <div className="flex justify-center mb-3">
          <img src="/poli.svg" alt="Poli Logo" className="h-8 w-auto" />
        </div>

        <h2 className="text-lg font-bold text-gray-800 text-center mb-3">
          Complete seus dados para resgatar recompensas
        </h2>

        <div className="flex flex-col gap-2">
          {/* Grid para campos lado a lado em telas maiores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">WhatsApp</label>
              <InputMask
                mask="99 99999-9999"
                name="user_phone"
                value={formData.user_phone}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
                  setFormData({ ...formData, user_phone: numericValue });
                }}
                placeholder="Ex.: 21 98377-0123"
                className="border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0000C8]"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">E-mail</label>
              <input
                type="email"
                name="user_email"
                value={formData.user_email}
                onChange={handleFormChange}
                placeholder="Ex.: exemplo@hotmail.com"
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0000C8]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Logradouro</label>
              <input
                type="text"
                name="address_street"
                value={formData.address_street}
                onChange={handleFormChange}
                placeholder="Ex.: Av. Paulista"
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0000C8]"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Número</label>
              <input
                type="text"
                name="address_number"
                value={formData.address_number}
                onChange={handleFormChange}
                placeholder="Ex.: 1234"
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0000C8]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Complemento</label>
              <input
                type="text"
                name="address_complement"
                value={formData.address_complement}
                onChange={handleFormChange}
                placeholder="Ex.: Ap 101, Bloco B"
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0000C8]"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Tipo</label>
              <select
                name="address_property_type"
                value={formData.address_property_type}
                onChange={handleFormChange}
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0000C8]"
                required
              >
                <option value="" disabled>
                  Selecione o tipo
                </option>
                <option value="Comercial">Comercial</option>
                <option value="Residencial">Residencial</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">CEP</label>
              <InputMask
                mask="99999-999"
                name="address_cep" // Added name prop to link with formData
                value={formData.address_cep}
                onChange={handleFormChange}
                placeholder="Ex.: 01310-000"
                className="border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0000C8] w-full"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Bairro</label>
              <input
                type="text"
                name="address_neighborhood"
                value={formData.address_neighborhood}
                onChange={handleFormChange}
                placeholder="Ex.: Bela Vista"
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0000C8]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Cidade</label>
              <input
                type="text"
                name="address_city"
                value={formData.address_city}
                onChange={handleFormChange}
                placeholder="Ex.: São Paulo"
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0000C8]"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Estado</label>
              <input
                type="text"
                name="address_state"
                value={formData.address_state}
                onChange={handleFormChange}
                placeholder="Ex.: São Paulo"
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0000C8]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">País</label>
              <input
                type="text"
                name="user_country"
                value="Brasil"
                disabled
                className="border border-gray-300 rounded-lg p-2 text-sm bg-gray-100"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Nome</label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                onChange={handleFormChange}
                placeholder="Ex.: Nome do Usuário"
                className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0000C8]"
                required
              />
            </div>
          </div>

          {/* Termos de uso */}
          <div className="mt-2 text-gray-700 text-xs">
            <span className="font-bold">Termos de uso</span>
            <br />
            Para participar do programa, é necessário concordar com os termos de uso e a política de privacidade. Ao aceitar, você declara estar ciente e de acordo com as regras e condições estabelecidas. Saiba mais em nossa{" "}
            <a
              href="https://docs.google.com/document/d/1t-ng5n29UiPdDgK8mcXtCWDxidn3gNCWK7Xg9_T6Qps/edit?tab=t.0"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Política do Programa
            </a>.
            <div className="mt-1 flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mr-2 h-4 w-4 text-[#0000C8] border-gray-300 rounded focus:ring-[#0000C8]"
              />
              <label htmlFor="terms" className="text-xs">Aceito os termos de uso.</label>
            </div>
          </div>

          <button
            onClick={handleAcceptTerms}
            disabled={formSubmitting || !termsAccepted}
            className={`mt-3 bg-[#0000C8] text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto ${formSubmitting || !termsAccepted ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {formSubmitting ? "Enviando..." : "Salvar e continuar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileFormModal;