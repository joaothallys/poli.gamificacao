import { useState } from "react";
import userService from "~/services/userService";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";

// Interface for form data
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
  user_position: string;
}

interface ProfileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userUuid: string | null;
  token: string;
}

// Component for rendering form input fields
const FormInput: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}> = ({ label, name, value, onChange, placeholder, type = "text", required, disabled }) => (
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-600 mb-1 uppercase">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none w-full"
      required={required}
      disabled={disabled}
    />
  </div>
);

// Component for rendering masked input fields (e.g., phone, CEP)
const MaskedInput: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  mask: string;
  required?: boolean;
  disabled?: boolean;
  prefix?: React.ReactNode;
}> = ({ label, name, value, onChange, placeholder, mask, required, disabled, prefix }) => (
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-600 mb-1 uppercase">{label}</label>
    <div className="flex items-center">
      {prefix}
      <InputMask
        mask={mask}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none w-full"
        required={required}
        disabled={disabled}
      />
    </div>
  </div>
);

// Component for rendering select fields
const FormSelect: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}> = ({ label, name, value, onChange, options, placeholder, required, disabled }) => (
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-600 mb-1 uppercase">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none"
      required={required}
      disabled={disabled}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ProfileFormModal: React.FC<ProfileFormModalProps> = ({ isOpen, onClose, userUuid, token }) => {
  // Form state
  const [formData, setFormData] = useState<PostUserParams>({
    address_cep: "",
    address_state: "",
    user_email: "",
    address_street: "",
    uuid_user: userUuid || "",
    address_complement: "",
    address_number: "",
    address_city: "",
    address_neighborhood: "",
    address_property_type: "",
    user_phone: "",
    user_name: "",
    user_position: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Handle form field changes
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!userUuid) {
      toast.error("UUID do usuário não encontrado. Faça login novamente.");
      return;
    }

    setFormSubmitting(true);
    try {
      const updatedFormData = { ...formData, uuid_user: userUuid };
      await userService.postUser(updatedFormData, token);
      toast.success("Sucesso!");
      onClose();
    } catch (error: any) {
      console.error("Erro ao processar:", error);
      const errorMessage =
        error.response?.data?.detail?.[0]?.msg || "Erro ao enviar dados do perfil";
      toast.error(errorMessage);
    } finally {
      setFormSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Brazilian flag SVG for WhatsApp field
  const brazilFlag = (
    <span
      className="inline-block w-5 h-5 mr-2"
      style={{
        background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><rect width=\"512\" height=\"512\" fill=\"#009739\"/><path d=\"M256 56.5l-199.5 143.5 199.5 143.5 199.5-143.5z\" fill=\"#FFC107\"/><circle cx=\"256\" cy=\"256\" r=\"95.5\" fill=\"#0D47A1\"/><path d=\"M210 208c10 20 30 30 45 30s35-10 45-30\" fill=\"#fff\"/></svg>') no-repeat center",
        backgroundSize: "contain",
      }}
    ></span>
  );

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-90 flex items-center justify-center z-50 px-2 sm:px-4 py-4">
      <div className="bg-white shadow-lg w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[900px] lg:max-w-[1100px] rounded-lg overflow-y-auto max-h-[90vh]" style={{ borderRadius: "8px" }}>
        <div className="p-4 sm:p-6">
          {/* Logo */}
          <div className="flex justify-center mb-3">
            <img src="/poli.svg" alt="Poli Logo" className="h-8 w-auto" />
          </div>

          {/* Contact Information Section */}
          <h2 className="text-base sm:text-lg font-bold text-blue-900 mb-4">
            DADOS DE CONTATO
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <FormInput
              label="Nome Completo"
              name="user_name"
              value={formData.user_name}
              onChange={handleFormChange}
              placeholder="Ex.: João Pedro Marcelo"
              required
              disabled={formSubmitting}
            />
            <FormInput
              label="Cargo"
              name="user_position"
              value={formData.user_position}
              onChange={handleFormChange}
              placeholder="Ex.: Gerente comercial"
              required
              disabled={formSubmitting}
            />
            <MaskedInput
              label="Seu WhatsApp"
              name="user_phone"
              value={formData.user_phone}
              onChange={handleFormChange}
              placeholder="21 983770123"
              mask="99 999999999"
              required
              disabled={formSubmitting}
            />
            <div className="sm:col-span-2 md:col-span-3">
              <FormInput
                label="Seu E-mail"
                name="user_email"
                value={formData.user_email}
                onChange={handleFormChange}
                placeholder="exemplo@hotmail.com"
                type="email"
                required
                disabled={formSubmitting}
              />
            </div>
          </div>

          {/* Address Section */}
          <h2 className="text-base sm:text-lg font-bold text-blue-900 mb-4">
            ENDEREÇO PARA ENTREGA DAS RECOMPENSAS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <FormInput
              label="Rua"
              name="address_street"
              value={formData.address_street}
              onChange={handleFormChange}
              placeholder="Ex.: Av. Paulista"
              required
              disabled={formSubmitting}
            />
            <FormInput
              label="Número"
              name="address_number"
              value={formData.address_number}
              onChange={handleFormChange}
              placeholder="Ex.: 1234"
              required
              disabled={formSubmitting}
            />
            <FormInput
              label="Complemento"
              name="address_complement"
              value={formData.address_complement}
              onChange={handleFormChange}
              placeholder="Ex.: Ap 101, Bloco B"
              disabled={formSubmitting}
            />
            <FormSelect
              label="Tipo"
              name="address_property_type"
              value={formData.address_property_type}
              onChange={handleFormChange}
              options={[
                { value: "Comercial", label: "Comercial" },
                { value: "Residencial", label: "Residencial" },
              ]}
              placeholder="Ex.: Casa, Apartamento"
              required
              disabled={formSubmitting}
            />
            <MaskedInput
              label="CEP"
              name="address_cep"
              value={formData.address_cep}
              onChange={handleFormChange}
              placeholder="Ex.: 01310-000"
              mask="99999-999"
              required
              disabled={formSubmitting}
            />
            <FormInput
              label="Bairro"
              name="address_neighborhood"
              value={formData.address_neighborhood}
              onChange={handleFormChange}
              placeholder="Ex.: Bela Vista"
              required
              disabled={formSubmitting}
            />
            <FormInput
              label="Cidade"
              name="address_city"
              value={formData.address_city}
              onChange={handleFormChange}
              placeholder="Ex.: São Paulo"
              required
              disabled={formSubmitting}
            />
            <FormInput
              label="Estado"
              name="address_state"
              value={formData.address_state}
              onChange={handleFormChange}
              placeholder="Ex.: São Paulo"
              required
              disabled={formSubmitting}
            />
            <div className="sm:col-span-2 md:col-span-3">
              <FormInput
                label="País"
                name="user_country"
                value="Brasil"
                onChange={() => {}} // Disabled field, no change handler needed
                placeholder=""
                disabled
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={formSubmitting}
              className={`bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-900 transition-colors ${formSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {formSubmitting ? "Enviando..." : "Salvar e continuar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileFormModal;