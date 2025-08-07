export class Réclamation {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  response?: string;
  responseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
