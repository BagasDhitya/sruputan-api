export interface UserPayload {
  id: number;
  email: string;
  role: string;
}

export interface AuthRequest extends Express.Request {
  user?: UserPayload;
}