import axios from "axios";

const userService = {
  getMetaProgress: async (id: number, token: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get/meta-progress/${id}`, {
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