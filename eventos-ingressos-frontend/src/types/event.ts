export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  price: number;
  capacity: number;
  file?: {
    file_url: string;
  };
}
