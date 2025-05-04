import axios, { AxiosError, AxiosInstance } from "axios";
import { z } from "zod";
import validator from "validator";
import { PostUserParams } from "~/types/interfaces";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
// if (!API_URL) {
//   throw new Error("Environment variable NEXT_PUBLIC_API_URL is not defined");
// }

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
});

const PostUserResponseSchema = z.unknown();

const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 401) {
      throw new Error("Unauthorized: Invalid or expired token");
    }

    if (axiosError.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    const errorMessage =
      axiosError.response?.data && typeof axiosError.response.data === "object" && "message" in axiosError.response.data
        ? (axiosError.response.data as { message: string }).message
        : defaultMessage;

    throw new Error(errorMessage);
  }

  throw new Error(defaultMessage);
};

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

  getProducts: async (perPage: number, page: number, token: string, transactionTypeId = 0) => {
    try {
      const response = await api.get(`/get-products`, {
        params: { perPage, page, transaction_type_id: transactionTypeId },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch products");
    }
  },

  postTransaction: async (
    customerId: number,
    transactionalType: number,
    productId: number,
    token: string,
    userUuid: string
  ) => {
    try {
      if (!Number.isInteger(customerId) || !Number.isInteger(productId)) {
        throw new Error("Invalid customer or product ID");
      }
      if (!validator.isUUID(userUuid)) {
        throw new Error("Invalid user UUID");
      }
      if (!token) {
        throw new Error("Token is required");
      }
      const body = new URLSearchParams({
        customer_id: customerId.toString(),
        user_uuid: userUuid,
        transactional_type: transactionalType.toString(),
        product_id: productId.toString(),
      }).toString();
      const response = await api.post("/post-transaction", body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to post transaction");
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

  getPointTransactions: async (
    page: number,
    perPage: number,
    token: string,
    customerId?: number,
    status?: number
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      if (customerId !== undefined) {
        params.append("customer_id", customerId.toString());
      }
      if (status !== undefined) {
        params.append("transaction_status_id", status.toString());
      }
      const response = await api.get(`/get-point-transactions?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch point transactions");
    }
  },

  updatePointTransactionStatus: async (transactionId: number, status: number, token: string) => {
    try {
      const body = new URLSearchParams({
        transaction_status_id: status.toString(),
      }).toString();
      const response = await api.put(`/update-point-transactions/${transactionId}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, "Failed to update transaction status");
    }
  },

  postUserTermsAcceptance: async (userUuid: string, token: string): Promise<void> => {
    try {
      if (!validator.isUUID(userUuid)) {
        throw new Error("Invalid user UUID");
      }
      const body = new URLSearchParams({ user_uuid: userUuid }).toString();
      await api.post("/post-user-terms-acceptance", body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    } catch (error) {
      handleApiError(error, "Failed to accept terms");
    }
  },

  postUser: async (params: PostUserParams, token: string) => {
    try {
      const {
        address_cep,
        address_state,
        user_email,
        address_street,
        uuid_user,
        address_complement,
        address_number,
        address_city,
        address_neighborhood,
        address_property_type,
        user_phone,
        user_name,
      } = params;

      if (!validator.isUUID(uuid_user)) {
        throw new Error("Invalid user UUID");
      }
      if (!validator.isEmail(user_email)) {
        throw new Error("Invalid email address");
      }
      if (!validator.isMobilePhone(user_phone, "any")) {
        throw new Error("Invalid phone number");
      }
      if (
        !address_cep ||
        !address_state ||
        !address_street ||
        !address_number ||
        !address_city ||
        !address_neighborhood ||
        !address_property_type ||
        !user_name
      ) {
        throw new Error("Missing required fields");
      }

      const body = new URLSearchParams({
        address_cep,
        address_state,
        user_email,
        address_street,
        uuid_user,
        address_complement,
        address_number,
        address_city,
        address_neighborhood,
        address_property_type,
        user_phone,
        user_name,
      }).toString();

      const response = await api.post("/post-user", body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return PostUserResponseSchema.parse(response.data);
    } catch (error) {
      handleApiError(error, "Failed to create user");
    }
  },
};

export default userService;