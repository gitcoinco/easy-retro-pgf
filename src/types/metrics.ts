export enum AvailableMetrics {
  activeContractCount90Days = "Active Contract Count (90 Days)",
  addressCount = "Address Count",
  addressCount90Days = "Address Count (90 Days)",
  daysSinceFirstTransaction = "Days Since First Transaction",
  gasFeesSum = "Gas Fees Sum",
  gasFeesSum6Months = "Gas Fees Sum (6 Months)",
  highActivityAddressCount90Days = "High Activity Address Count (90 Days)",
  lowActivityAddressCount90Days = "Low Activity Address Count (90 Days)",
  mediumActivityAddressCount90Days = "Medium Activity Address Count (90 Days)",
  multiProjectAddressCount90Days = "Multi Project Address Count (90 Days)",
  newAddressCount90Days = "New Address Count (90 Days)",
  returningAddressCount90Days = "Returning Address Count (90 Days)",
  transactionCount = "Transaction Count",
  transactionCount6Months = "Transaction Count (6 Months)",
}

export type OSOMetric = {
  activeContractCount90Days: number;
  addressCount: number;
  addressCount90Days: number;
  daysSinceFirstTransaction: number;
  gasFeesSum: number;
  gasFeesSum6Months: number;
  highActivityAddressCount90Days: number;
  lowActivityAddressCount90Days: number;
  mediumActivityAddressCount90Days: number;
  multiProjectAddressCount90Days: number;
  newAddressCount90Days: number;
  returningAddressCount90Days: number;
  transactionCount: number;
  transactionCount6Months: number;
};

export type MetricId = keyof OSOMetric;

export type Metric = {
  id: string;
  name: string;
  description?: string;
};

type OSOMetricProjectMeta = {
  eventSource: string;
  displayName: string;
  projectId: string;
  projectName: string;
  projectNamespace: string;
  projectSource: string;
};

export type OSOMetrics = (OSOMetric & OSOMetricProjectMeta)[];

export type OSOMetricCSVProjectMeta = {
  projectName: string;
  projectId: string;
};

export type OSOMetricsCSV = OSOMetricCSVProjectMeta & OSOMetric;
