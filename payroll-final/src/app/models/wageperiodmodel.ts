export interface IWagePeriod {
  id: number;
  cd: string; // Code
  wF: string; // Wage Period From
  wT: string; // Wage Period To
  st: string; // Status
  tF: string; // Tax From
  tT: string; // Tax To
  pT: string; // Process Type
  pM: string; // Pay on Month
  sM: number;  // Specific Day of Month
  cM: string; // Calculation Mode
  cuD: number;  // Custom Days
}



