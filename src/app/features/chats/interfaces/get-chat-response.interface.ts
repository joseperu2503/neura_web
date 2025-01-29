export interface GetChatResponse {
  readonly _id: string;
  readonly userId: string;
  readonly messages: Message[];
  readonly title: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly __v: number;
}

export interface Message {
  readonly role: 'user' | 'assistant' | 'system';
  readonly content: string;
  readonly createdAt: Date;
}
