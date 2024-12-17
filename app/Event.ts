
export type Event = {
  id: string;
  title: string;
  date: string;
  categoryId?: string;
  isCompleted: boolean;
  canChecked: boolean;
}