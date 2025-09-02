export interface CheckEmailRequest {
  email: string;
}

export interface CheckEmailResponse {
  email: string;
  isRegistered: boolean;
  message: string;
  emailSent?: boolean;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  email: string;
  authenticated: boolean;
  message: string;
  registrationInfo?: UserRegistration;
}

export interface UserRegistration {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  city?: string;
  educationLevel?: string;
  participationMode?: 'Presencial' | 'Remoto';
}