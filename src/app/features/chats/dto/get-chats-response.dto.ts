export type GetChatsResponseDto = ChatDto[];

export interface ChatDto {
  _id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
