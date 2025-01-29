export interface GetChatResponse {
  readonly title: string;
  readonly _id: string;
  readonly userId: string;
  readonly messages: any[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly __v: number;
}
