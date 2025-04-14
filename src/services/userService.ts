import axios from "axios";

const BASE_URL = process.env.NEXT_URL_PUBLIC_GAMI;

const userService = {
  getMetaProgress: async (customer_id: number, token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/get-meta-progress/${customer_id}`, {
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter meta progress:", error);
      throw error;
    }
  },

  getProducts: async (perPage: number, page: number, token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/get-products?perPage=${perPage}&page=${page}&transaction_type_id=0`, {
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter produtos:", error);
      throw error;
    }
  },

  postTransaction: async (
    customerId: number,
    transactionalType: number,
    productId: number,
    token: string
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/post-transaction`,
        new URLSearchParams({
          customer_id: customerId.toString(),
          transactional_type: transactionalType.toString(),
          points: "",
          product_id: productId.toString(),
        }).toString(),
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao realizar transação:", error);
      throw error;
    }
  },

  getCustomerTotalPoints: async (customerId: number, token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/get-customer-total-points/${customerId}`, {
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter total de pontos do cliente:", error);
      throw error;
    }
  },

  getPointTransactions: async (page: number, perPage: number, token: string, customerId?: number, status?: number) => {
    try {
      let url = `${BASE_URL}/get-point-transactions?page=${page}&per_page=${perPage}`;
      if (customerId !== undefined) {
        url += `&customer_id=${customerId}`;
      }
      if (status !== undefined) {
        url += `&transaction_status_id=${status}`;
      }
      const response = await axios.get(url, {
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter transações de pontos:", error);
      throw error;
    }
  },

  updatePointTransactionStatus: async (transactionId: number, status: number, token: string) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/update-point-transactions/${transactionId}`,
        new URLSearchParams({
          transaction_status_id: status.toString(),
        }).toString(),
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar status da transação de pontos:", error);
      throw error;
    }
  }
};

export default userService;