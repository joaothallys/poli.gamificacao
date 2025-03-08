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
  }
};

export default userService;