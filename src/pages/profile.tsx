import type { NextPage } from "next";
import { BottomBar } from "~/components/BottomBar";
import { LeftBar } from "~/components/LeftBar";
import React, { useEffect, useState } from "react";
import userService from "~/services/userService";

const Profile: NextPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [editingAccount, setEditingAccount] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  const [accountData, setAccountData] = useState<any>({});
  const [addressData, setAddressData] = useState<any>({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
    const uuid = userData.user_uuid;
    const token = "123456";

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
          status: data.status,
          created_at: data.created_at,
        });
        setAddressData({ ...data.address });
      })
      .finally(() => setLoading(false));
  }, []);

  const allFieldsFilled = (obj: any) =>
    Object.values(obj).every((val) => val !== undefined && val !== "");

  const handleSaveAccount = () => {
    if (allFieldsFilled(accountData)) {
      setUser((prev: any) => ({ ...prev, ...accountData }));
      setEditingAccount(false);
    }
  };

  const handleSaveAddress = () => {
    if (allFieldsFilled(addressData)) {
      setUser((prev: any) => ({ ...prev, address: { ...addressData } }));
      setEditingAddress(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <LeftBar selectedTab="Profile" />

      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-50 bg-opacity-75 flex items-center justify-center z-40 md:ml-64">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-[#0000C8] border-gray-200 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700">Carregando dados do perfil...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center pt-16 md:ml-64 px-4">
        {/* Seção: Conta */}
        <section className="bg-white rounded-xl shadow p-8 w-full max-w-4xl mt-8 relative">
          <h2 className="text-2xl font-bold mb-6 text-[#0000C8]">
            Informações da Conta
          </h2>

          {!editingAccount ? (
            <button
              onClick={() => setEditingAccount(true)}
              className="absolute top-6 right-6 text-sm text-[#0000C8] underline"
            >
              Editar
            </button>
          ) : (
            <div className="absolute top-6 right-6 flex gap-4">
              <button
                onClick={handleSaveAccount}
                disabled={!allFieldsFilled(accountData)}
                className={`text-sm font-medium ${
                  allFieldsFilled(accountData)
                    ? "text-green-600 hover:underline"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
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
                    status: user.status,
                    created_at: user.created_at,
                  });
                }}
                className="text-sm text-red-600 hover:underline"
              >
                Cancelar
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Nome", key: "name" },
              { label: "E-mail", key: "email" },
              { label: "WhatsApp", key: "phone" },
              { label: "Cargo", key: "role" },
              { label: "Status", key: "status" },
              { label: "Data de Cadastro", key: "created_at", readonly: true },
            ].map(({ label, key, readonly }) => (
              <div key={key}>
                <span className="block text-gray-400 text-xs">{label}</span>
                {editingAccount && !readonly ? (
                  <input
                    className="border p-1 rounded w-full"
                    value={accountData[key]}
                    onChange={(e) =>
                      setAccountData({ ...accountData, [key]: e.target.value })
                    }
                  />
                ) : (
                  <span
                    className={`font-semibold ${
                      key === "status"
                        ? user?.status === "ACTIVE"
                          ? "text-green-600"
                          : "text-red-500"
                        : ""
                    }`}
                  >
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
        <section className="bg-white rounded-xl shadow p-8 w-full max-w-4xl mt-8 relative">
          <h2 className="text-2xl font-bold mb-6 text-[#0000C8]">
            Endereço para entrega das recompensas
          </h2>

          {!editingAddress ? (
            <button
              onClick={() => setEditingAddress(true)}
              className="absolute top-6 right-6 text-sm text-[#0000C8] underline"
            >
              Editar
            </button>
          ) : (
            <div className="absolute top-6 right-6 flex gap-4">
              <button
                onClick={handleSaveAddress}
                disabled={!allFieldsFilled(addressData)}
                className={`text-sm font-medium ${
                  allFieldsFilled(addressData)
                    ? "text-green-600 hover:underline"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setEditingAddress(false);
                  setAddressData({ ...user.address });
                }}
                className="text-sm text-red-600 hover:underline"
              >
                Cancelar
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "street",
              "number",
              "complement",
              "property_type",
              "cep",
              "neighborhood",
              "city",
              "state",
            ].map((field) => (
              <div key={field}>
                <span className="block text-gray-400 text-xs">
                  {field.replace(/_/g, " ").toUpperCase()}
                </span>
                {editingAddress ? (
                  <input
                    className="border p-1 rounded w-full"
                    value={addressData[field]}
                    onChange={(e) =>
                      setAddressData({ ...addressData, [field]: e.target.value })
                    }
                  />
                ) : (
                  <span className="font-semibold">{user?.address?.[field]}</span>
                )}
              </div>
            ))}
            <div className="md:col-span-2">
              <span className="block text-gray-400 text-xs">PAÍS</span>
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
