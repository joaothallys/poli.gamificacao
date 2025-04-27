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
  }
  
  export interface SubTheme {
    [key: string]: Mission[] | { error: string };
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
  }