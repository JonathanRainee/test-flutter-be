export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; 
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}