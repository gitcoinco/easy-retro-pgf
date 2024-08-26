import { saveAs } from "file-saver";
import Papa, { type UnparseConfig } from "papaparse";
import { Application } from "~/features/applications/types";

export function parse<T>(file: string) {
  return Papa.parse<T>(file, { header: true });
}
export function format(data: unknown[], config: UnparseConfig) {
  return Papa.unparse(data, config);
}

export const convertAndDownload = (data: Application[]) => {
  // Manually transform complex data fields before unparsing
  const transformedData = data.map((app) => ({
    ...app,
    impactCategory: JSON.stringify(app.impactCategory),
    contributionLinks: JSON.stringify(app.contributionLinks),
    impactMetrics: JSON.stringify(app.impactMetrics),
    fundingSources: JSON.stringify(app.fundingSources),
  }));

  // Configuration for unparsing
  const config: Papa.UnparseConfig = {
    quotes: true, // Wrap every field in quotes
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ",",
    header: true,
    columns: [
      "name",
      "bio",
      "websiteUrl",
      "payoutAddress",
      "contributionDescription",
      "impactDescription",
      "impactCategory",
      "contributionLinks",
      "impactMetrics",
      "fundingSources",
    ],
  };

  // Convert the transformed data array into a CSV string using Papa.unparse
  const csvString = Papa.unparse(transformedData, config);

  // Create a blob with the CSV data
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "projects.csv");
};
