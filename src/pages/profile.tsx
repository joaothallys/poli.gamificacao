import type { NextPage } from "next";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import React, { useEffect, useState } from "react";
import userService from "~/services/userService";
import InputMask from "react-input-mask";

const Profile: NextPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [editingAccount, setEditingAccount] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  const [accountData, setAccountData] = useState<any>({});
  const [addressData, setAddressData] = useState<any>({});
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const [popup, setPopup] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
  const token = process.env.NEXT_PUBLIC_API_TOKEN || "default_token";
  const uuid = userData.user_uuid;

  useEffect(() => {
    if (!uuid || !token) return;
    userService
      .getUsers(uuid, 1, 1, token)
      .then((res: any) => {
        const data = res.data[0];
        setUser(data);
        setAccountData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          created_at: data.created_at,
        });
        setAddressData({ ...data.address });
      })
      .catch(() => setPopup({ type: "error", message: "Erro ao carregar dados do perfil." }))
      .finally(() => setLoading(false));
  }, []);

  // Checa se todos os campos obrigatórios estão preenchidos (exceto status e created_at)
  const allFieldsFilled = (obj: any) =>
    Object.entries(obj)
      .filter(([key]) => key !== "status" && key !== "created_at")
      .every(([, val]) => val !== undefined && val !== "");

  // Checa se todos os campos obrigatórios do endereço estão preenchidos
  const allAddressFieldsFilled = (obj: any) =>
    ["street", "number", "complement", "property_type", "cep", "neighborhood", "city", "state"].every(
      (key) => obj[key] !== undefined && obj[key] !== ""
    );

  // Salvar dados da conta (edição)
  const handleSaveAccount = async () => {
    if (!allFieldsFilled(accountData) || !allAddressFieldsFilled(addressData)) return;
    setSavingAccount(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      const uuid = userData.user_uuid;
      await userService.putUser(
        uuid,
        {
          user_name: accountData.name,
          user_email: accountData.email,
          user_phone: accountData.phone,
          user_role: accountData.role,
          address_cep: addressData.cep,
          address_state: addressData.state,
          address_street: addressData.street,
          address_complement: addressData.complement,
          address_number: addressData.number,
          address_city: addressData.city,
          address_neighborhood: addressData.neighborhood,
          address_property_type: addressData.property_type,
        },
        token
      );
      setUser((prev: any) => ({
        ...prev,
        ...accountData,
        address: { ...addressData },
      }));
      setEditingAccount(false);
      setPopup({ type: "success", message: "Dados da conta salvos com sucesso!" });
    } catch (err) {
      setPopup({ type: "error", message: "Erro ao salvar dados da conta." });
    } finally {
      setSavingAccount(false);
    }
  };

  // Salvar dados do endereço (edição)
  const handleSaveAddress = async () => {
    if (!allAddressFieldsFilled(addressData) || !allFieldsFilled(accountData)) return;
    setSavingAddress(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      const uuid = userData.user_uuid;
      await userService.putUser(
        uuid,
        {
          user_name: accountData.name,
          user_email: accountData.email,
          user_phone: accountData.phone,
          user_role: accountData.role,
          address_cep: addressData.cep,
          address_state: addressData.state,
          address_street: addressData.street,
          address_complement: addressData.complement,
          address_number: addressData.number,
          address_city: addressData.city,
          address_neighborhood: addressData.neighborhood,
          address_property_type: addressData.property_type,
        },
        token
      );
      setUser((prev: any) => ({
        ...prev,
        address: { ...addressData },
      }));
      setEditingAddress(false);
      setPopup({ type: "success", message: "Endereço salvo com sucesso!" });
    } catch (err) {
      setPopup({ type: "error", message: "Erro ao salvar endereço." });
    } finally {
      setSavingAddress(false);
    }
  };

  // Popup de feedback
  const Popup = ({ type, message }: { type: "error" | "success"; message: string }) => (
    <div
      className={`fixed top-6 left-1/2 z-50 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white flex items-center gap-2
        ${type === "error" ? "bg-red-600" : "bg-green-600"}`}
      role="alert"
    >
      {type === "error" ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      <span>{message}</span>
      <button className="ml-2" onClick={() => setPopup(null)}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <LeftBar selectedTab="Profile" />

      {popup && <Popup type={popup.type} message={popup.message} />}

      {loading && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-[#0000C8] border-gray-200 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700">Carregando perfil...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center pt-16 md:ml-64 px-2 sm:px-4">
        {/* Seção: Conta */}
        <section className="bg-white rounded-xl shadow p-4 sm:p-8 w-full max-w-4xl mt-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#0000C8]">
            Dados de contato
          </h2>

          {!editingAccount ? (
            <button
              onClick={() => setEditingAccount(true)}
              className="absolute top-6 right-6 flex items-center gap-1 px-3 py-1 rounded-md bg-[#0000C8] text-white text-xs sm:text-sm font-semibold shadow hover:bg-[#2323e6] transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" />
              </svg>
              Editar
            </button>
          ) : (
            <div className="absolute top-6 right-6 flex gap-2">
              <button
                onClick={handleSaveAccount}
                disabled={!allFieldsFilled(accountData) || !allAddressFieldsFilled(addressData) || savingAccount}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs sm:text-sm font-semibold shadow transition
                  ${allFieldsFilled(accountData) && allAddressFieldsFilled(addressData) && !savingAccount
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {savingAccount ? (
                  <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Salvar
              </button>
              <button
                onClick={() => {
                  setEditingAccount(false);
                  setAccountData({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    created_at: user.created_at,
                  });
                }}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-500 text-white text-xs sm:text-sm font-semibold shadow hover:bg-red-600 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              { label: "Nome", key: "name" },
              { label: "E-mail", key: "email" },
              { label: "WhatsApp", key: "phone" },
              { label: "Cargo", key: "role" },
              { label: "Data de Cadastro", key: "created_at", readonly: true },
            ].map(({ label, key, readonly }) => (
              <div key={key}>
                <span className="block text-gray-400 text-xs">{label}</span>
                {editingAccount && !readonly ? (
                  key === "phone" ? (
                    <InputMask
                      mask="(99) 99999-9999"
                      value={accountData[key]}
                      onChange={(e) => setAccountData({ ...accountData, [key]: e.target.value })}
                    >
                      {(inputProps: any) => (
                        <input
                          {...inputProps}
                          className="border p-1 rounded w-full"
                          placeholder="(11) 91234-5678"
                        />
                      )}
                    </InputMask>
                  ) : (
                    <input
                      className="border p-1 rounded w-full"
                      value={accountData[key]}
                      onChange={(e) =>
                        setAccountData({ ...accountData, [key]: e.target.value })
                      }
                    />
                  )
                ) : (
                  <span className="font-semibold">
                    {key === "created_at"
                      ? new Date(user?.created_at).toLocaleDateString("pt-BR")
                      : user?.[key]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Seção: Endereço */}
        <section className="bg-white rounded-xl shadow p-4 sm:p-8 w-full max-w-4xl mt-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#0000C8]">
            Endereço para entrega das recompensas
          </h2>

          {!editingAddress ? (
            <button
              onClick={() => setEditingAddress(true)}
              className="absolute top-6 right-6 flex items-center gap-1 px-3 py-1 rounded-md bg-[#0000C8] text-white text-xs sm:text-sm font-semibold shadow hover:bg-[#2323e6] transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" />
              </svg>
              Editar
            </button>
          ) : (
            <div className="absolute top-6 right-6 flex gap-2">
              <button
                onClick={handleSaveAddress}
                disabled={!allAddressFieldsFilled(addressData) || !allFieldsFilled(accountData) || savingAddress}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs sm:text-sm font-semibold shadow transition
                  ${allAddressFieldsFilled(addressData) && allFieldsFilled(accountData) && !savingAddress
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {savingAddress ? (
                  <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Salvar
              </button>
              <button
                onClick={() => {
                  setEditingAddress(false);
                  setAddressData({ ...user.address });
                }}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-500 text-white text-xs sm:text-sm font-semibold shadow hover:bg-red-600 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              { key: "street", label: "Rua" },
              { key: "number", label: "Número" },
              { key: "complement", label: "Complemento" },
              { key: "property_type", label: "Tipo de Imóvel" },
              { key: "cep", label: "CEP" },
              { key: "neighborhood", label: "Bairro" },
              { key: "city", label: "Cidade" },
              { key: "state", label: "Estado" },
            ].map(({ key, label }) => (
              <div key={key}>
                <span className="block text-gray-400 text-xs">{label}</span>
                {editingAddress ? (
                  key === "property_type" ? (
                    <select
                      className="border p-1 rounded w-full"
                      value={addressData[key]}
                      onChange={(e) =>
                        setAddressData({ ...addressData, [key]: e.target.value })
                      }
                    >
                      <option value="">Selecione...</option>
                      <option value="Comercial">Comercial</option>
                      <option value="Residencial">Residencial</option>
                    </select>
                  ) : key === "cep" ? (
                    <InputMask
                      mask="99999-999"
                      value={addressData[key]}
                      onChange={(e) => setAddressData({ ...addressData, [key]: e.target.value })}
                    >
                      {(inputProps: any) => (
                        <input
                          {...inputProps}
                          className="border p-1 rounded w-full"
                          placeholder="01310-000"
                        />
                      )}
                    </InputMask>
                  ) : (
                    <input
                      className="border p-1 rounded w-full"
                      value={addressData[key]}
                      onChange={(e) =>
                        setAddressData({ ...addressData, [key]: e.target.value })
                      }
                    />
                  )
                ) : (
                  <span className="font-semibold">{user?.address?.[key]}</span>
                )}
              </div>
            ))}
            <div className="sm:col-span-2">
              <span className="block text-gray-400 text-xs">País</span>
              <span className="font-semibold">Brasil</span>
            </div>
          </div>
        </section>
      </div>

      <BottomBar selectedTab="Profile" />
    </div>
  );
};

export default Profile;