import axios from "axios";

// URL fixa da API para teste
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const userService = {
  getMetaProgress: async (customer_id: number, token: string) => {
    try {
      const url = `${API_URL}/get/meta-progress/${customer_id}`;
      const response = await axios.get(url, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProducts: async (perPage: number, page: number, token: string) => {
    try {
      const url = `${API_URL}/get-products?perPage=${perPage}&page=${page}&transaction_type_id=0`;
      const response = await axios.get(url, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Função atualizada em src/services/userService.ts
  postTransaction: async (
    customerId: number,
    transactionalType: number,
    productId: number,
    token: string,
    userUuid: string
  ) => {
    try {
      if (!customerId || !productId || !userUuid || !token) {
        throw new Error("Parâmetros obrigatórios ausentes");
      }

      const url = `${API_URL}/post-transaction`;
      const body = new URLSearchParams({
        customer_id: customerId.toString(),
        user_uuid: userUuid,
        transactional_type: transactionalType.toString(),
        points: "",
        product_id: productId.toString(),
      }).toString();

      const response = await axios.post(url, body, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro em postTransaction:", error);
    }
  },

  getCustomerTotalPoints: async (customerId: number, token: string) => {
    try {
      const url = `${API_URL}/get-customer-total-points/${customerId}`;
      const response = await axios.get(url, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPointTransactions: async (page: number, perPage: number, token: string, customerId?: number, status?: number) => {
    try {
      let url = `${API_URL}/get-point-transactions?page=${page}&per_page=${perPage}`;
      if (customerId !== undefined) {
        url += `&customer_id=${customerId}`;
      }
      if (status !== undefined) {
        url += `&transaction_status_id=${status}`;
      }

      const response = await axios.get(url, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePointTransactionStatus: async (transactionId: number, status: number, token: string) => {
    try {
      const url = `${API_URL}/update-point-transactions/${transactionId}`;
      const body = new URLSearchParams({
        transaction_status_id: status.toString(),
      }).toString();

      const response = await axios.put(url, body, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;