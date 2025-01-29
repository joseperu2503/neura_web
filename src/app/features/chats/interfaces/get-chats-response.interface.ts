export type GetChatsResponse = Chat[];

export interface Chat {
  readonly _id: string;
  readonly userId: string;
  readonly title: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly __v: number;
}
