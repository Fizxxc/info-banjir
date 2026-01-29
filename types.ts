export type FloodLevel = "orange" | "red" | "yellow" | "green" | "blue";

export type FloodReport = {
  id: string;
  title: string;
  description: string;
  level: FloodLevel;
  location: {
    lat: number;
    lng: number;
  };
  reporter: string;
  createdAt: Date;
  timeLabel: string;
};
