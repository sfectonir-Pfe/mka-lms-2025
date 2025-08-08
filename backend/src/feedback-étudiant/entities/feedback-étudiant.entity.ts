export class FeedbackÉtudiant {
  id: string;
  fromStudentId: number;
  toStudentId: number;
  groupId: string;
  rating: number; // 1-5
  comment: string;
  category: string; // 'collaboration', 'communication', 'participation', 'qualité_travail'
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}
