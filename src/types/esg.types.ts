export interface ESGPillarScore {
  name: string;
  score: number;
  color: string;
}

export interface ESGBlock {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

export interface ESGIndicator {
  category: string;
  indicator: string;
  value: string | number;
  unit: string;
  score: number;
}
