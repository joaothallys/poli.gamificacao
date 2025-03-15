import axios from "axios";

const userService = {
  getMetaProgress: async (customer_id: number, token: string) => {
    try {
      const response = await axios.get(`https://gamification-gamma-polidigital.svc-us5.zcloud.ws/get/meta-progress/${customer_id}`, {
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
      const response = await axios.get(`https://gamification-gamma-polidigital.svc-us5.zcloud.ws/get-products?perPage=${perPage}&page=${page}`, {
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
        "https://gamification-gamma-polidigital.svc-us5.zcloud.ws/post-transaction",
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
      const response = await axios.get(`https://gamification-gamma-polidigital.svc-us5.zcloud.ws/get-customer-total-points/${customerId}`, {
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

  getPointTransactions: async (page: number, perPage: number, customerId: number, status: number, token: string) => {
    try {
      const response = await axios.get(`https://gamification-gamma-polidigital.svc-us5.zcloud.ws/get-point-transactions?page=${page}&per_page=${perPage}&customer_id=${customerId}&transaction_status_id=${status}`, {
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
        `https://gamification-gamma-polidigital.svc-us5.zcloud.ws/update-point-transactions/${transactionId}`,
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