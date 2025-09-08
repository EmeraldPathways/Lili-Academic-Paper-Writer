
export enum ReferencingStyle {
  IEEE = 'IEEE',
  Harvard = 'Harvard',
}

export interface HistoryItem {
  id: number;
  draft: string;
  output: string;
  style: ReferencingStyle;
  timestamp: string;
}
