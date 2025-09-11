export class Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
