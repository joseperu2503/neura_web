import { Message } from './message.interface';

export interface Chat {
  readonly _id: string;
  readonly userId: string;
  readonly title: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly __v: number;
  readonly messages: Message[];
  isCompletion?: boolean;
}
