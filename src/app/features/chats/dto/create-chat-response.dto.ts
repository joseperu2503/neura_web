export interface CreateChatResponseDto {
  readonly userId: string;
  readonly messages: any[];
  readonly title: string;
  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly __v: number;
}
