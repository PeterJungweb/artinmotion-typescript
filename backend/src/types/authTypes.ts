export interface UserRow {
  id: string;
  email: string;
  email_verification_token: string;
  email_verified: boolean;
  password_hash?: string;
  full_name?: string | null;
  phone?: string | null;
  created_at: Date;
}

export interface RegisterBody {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}
