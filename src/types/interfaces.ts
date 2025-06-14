export interface Product {
  id: number;
  name: string;
  price: string;
  link_img: string;
  description: string;
}

export interface TransactionResponse {
  data: {
    id: number;
    customer_id: number;
    transaction_type_id: number;
    transaction_type: string;
    transaction_status_id: number;
    transaction_status: string;
    points: string;
    product_id: number;
    product_name: string;
    product_value: string;
    product_link_img: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}

export interface Mission {
  nivel: number;
  objetivo: number;
  descricao: string;
  valor: number;
  percentual: number;
  tooltip?: string;
}

export interface SubTheme {
  [subTheme: string]: Mission[] | { error: string } | { tooltip: string };
}

export interface MetaProgress {
  [category: string]: SubTheme;
}

export interface LevelInfo {
  name: string;
  progress: number;
  current: number;
  next: number;
  max: number;
  min: number;
}

export interface PostUserParams {
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