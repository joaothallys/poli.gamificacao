import { useState } from "react";
import userService from "~/services/userService";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import * as yup from "yup";

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
  user_role: string;
}

interface ProfileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userUuid: string | null;
  token: string;
}

const FormInput: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}> = ({ label, name, value, onChange, placeholder, type = "text", required, disabled, invalid }) => (
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-600 mb-1 uppercase">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded-lg p-2 text-sm focus:outline-none w-full ${invalid ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"}`}
      required={required}
      disabled={disabled}
    />
  </div>
);

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
  invalid?: boolean;
}> = ({ label, name, value, onChange, placeholder, mask, required, disabled, prefix, invalid }) => (
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
        className={`border rounded-lg p-2 text-sm focus:outline-none w-full ${invalid ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"}`}
        required={required}
        disabled={disabled}
      />
    </div>
  </div>
);

const FormSelect: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}> = ({ label, name, value, onChange, options, placeholder, required, disabled, invalid }) => (
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-600 mb-1 uppercase">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`border rounded-lg p-2 text-sm focus:outline-none ${invalid ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"}`}
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

const formSchema = yup.object().shape({
  user_name: yup.string().required("Nome obrigatório"),
  user_role: yup.string().required("Cargo obrigatório"),
  user_phone: yup
    .string()
    .required("WhatsApp obrigatório")
    .matches(/^\d+$/, "Somente números")
    .min(10, "Mínimo 10 dígitos")
    .max(11, "Máximo 11 dígitos"),
  user_email: yup.string().email("E-mail inválido").required("E-mail obrigatório"),
  address_street: yup.string().required("Rua obrigatória"),
  address_number: yup.string().required("Número obrigatório"),
  address_complement: yup.string().required("Complemento obrigatório"),
  address_property_type: yup.string().required("Tipo obrigatório"),
  address_cep: yup.string().required("CEP obrigatório"),
  address_neighborhood: yup.string().required("Bairro obrigatório"),
  address_city: yup.string().required("Cidade obrigatória"),
  address_state: yup.string().required("Estado obrigatório"),
});

const FormTerms: React.FC<{
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
  disabled: boolean;
}> = ({ checked, onChange, required, disabled }) => (
  <div className="mb-4">
    <div className="font-semibold text-sm mb-1">Termos de uso</div>
    <div className="text-xs text-gray-700 mb-2">
      Para participar do programa, é necessário concordar com os termos de uso e a política de privacidade.
      Ao aceitar, você declara estar ciente e de acordo com as regras e condições estabelecidas.
      Saiba mais em nossa <a
        href="https://poli.digital/policoins/termos-e-condicoes"
        className="font-bold underline text-blue-900"
        target="_blank"
        rel="noopener noreferrer"
      >
        Política do Programa
      </a>.
    </div>
    <div className="flex items-center">
      <input
        type="checkbox"
        id="accept_terms"
        checked={checked}
        onChange={onChange}
        className="mr-2 accent-blue-700"
        disabled={disabled}
        required={required}
      />
      <label htmlFor="accept_terms" className="text-sm text-gray-900 select-none">
        Aceito os termos de uso.
      </label>
    </div>
  </div>
);

const ProfileFormModal: React.FC<ProfileFormModalProps> = ({ isOpen, onClose, userUuid, token }) => {
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
    user_role: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);


  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;
    if (name === "user_phone") {
      value = value.replace(/\D/g, "");
    }
    setFormData({ ...formData, [name]: value });
    setInvalidFields((prev) => prev.filter((field) => field !== name));
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptTerms(e.target.checked);
  };

  const handleSubmit = async () => {
    if (!userUuid) {
      toast.error("UUID do usuário não encontrado. Faça login novamente.");
      return;
    }

    if (!acceptTerms) {
      toast.error("Você precisa aceitar os termos de uso para continuar.");
      return;
    }

    try {
      await formSchema.validate(formData, { abortEarly: false });
      setInvalidFields([]);
    } catch (err: any) {
      if (err.inner) {
        setInvalidFields(err.inner.map((e: any) => e.path));
      }
      return;
    }

    setFormSubmitting(true);
    try {
      const dataToSend = {
        ...formData,
        user_phone: formData.user_phone.replace(/\D/g, ""),
        uuid_user: userUuid,
      };
      await userService.postUser(dataToSend, token);
      await userService.postUserTermsAcceptance(userUuid, token);
      toast.success("Sucesso!");
      onClose();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail?.[0]?.msg || "Erro ao enviar dados do perfil";
      toast.error(errorMessage);
    } finally {
      setFormSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
              invalid={invalidFields.includes("user_name")}
            />
            <FormInput
              label="Cargo"
              name="user_role"
              value={formData.user_role}
              onChange={handleFormChange}
              placeholder="Ex.: Gerente comercial"
              required
              disabled={formSubmitting}
              invalid={invalidFields.includes("user_role")}
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
              invalid={invalidFields.includes("user_phone")}
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
                invalid={invalidFields.includes("user_email")}
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
              invalid={invalidFields.includes("address_street")}
            />
            <FormInput
              label="Número"
              name="address_number"
              value={formData.address_number}
              onChange={handleFormChange}
              placeholder="Ex.: 1234"
              required
              disabled={formSubmitting}
              invalid={invalidFields.includes("address_number")}
            />
            <FormInput
              label="Complemento"
              name="address_complement"
              value={formData.address_complement}
              onChange={handleFormChange}
              placeholder="Ex.: Ap 101, Bloco B"
              disabled={formSubmitting}
              invalid={invalidFields.includes("address_complement")}
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
              invalid={invalidFields.includes("address_property_type")}
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
              invalid={invalidFields.includes("address_cep")}
            />
            <FormInput
              label="Bairro"
              name="address_neighborhood"
              value={formData.address_neighborhood}
              onChange={handleFormChange}
              placeholder="Ex.: Bela Vista"
              required
              disabled={formSubmitting}
              invalid={invalidFields.includes("address_neighborhood")}
            />
            <FormInput
              label="Cidade"
              name="address_city"
              value={formData.address_city}
              onChange={handleFormChange}
              placeholder="Ex.: São Paulo"
              required
              disabled={formSubmitting}
              invalid={invalidFields.includes("address_city")}
            />
            <FormInput
              label="Estado"
              name="address_state"
              value={formData.address_state}
              onChange={handleFormChange}
              placeholder="Ex.: São Paulo"
              required
              disabled={formSubmitting}
              invalid={invalidFields.includes("address_state")}
            />
            <div className="sm:col-span-2 md:col-span-3">
              <FormInput
                label="País"
                name="user_country"
                value="Brasil"
                onChange={() => { }}
                placeholder=""
                disabled
              />
            </div>
          </div>

          <FormTerms
            checked={acceptTerms}
            onChange={handleTermsChange}
            required
            disabled={formSubmitting}
          />

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