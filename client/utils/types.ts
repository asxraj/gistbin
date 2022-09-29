export interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

export interface IGistbin {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
  expires: string;
}
