export interface GetChatResponseDto {
  _id: string;
  userId: string;
  messages: Message[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  feedbackType: null;
  _id: string;
  feedbackDescription?: string;
  assistantFile?: null;
}
