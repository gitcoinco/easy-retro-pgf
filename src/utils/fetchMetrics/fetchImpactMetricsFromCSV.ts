import fs from "fs";
import path from "path";
import Papa from "papaparse";
import type { MetricId, OSOMetricsCSV } from "~/types/metrics";

type FetchImpactMetricsParams = {
  projects?: string[];
  metrics?: MetricId[];
};

const CSV_FILENAME = "metrics.csv";

export async function fetchImpactMetricsFromCSV(
  filters?: FetchImpactMetricsParams,
): Promise<OSOMetricsCSV[]> {
  const { projects, metrics } = filters ?? {};

  const filePath = path.join(process.cwd(), "public", CSV_FILENAME);

  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file ${CSV_FILENAME} does not exist.`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");

  return new Promise((resolve, reject) => {
    Papa.parse<OSOMetricsCSV>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length) {
          reject(results.errors);
        } else {
          let data = results.data;

          // Filter by projects if specified
          if (projects && projects.length > 0) {
            data = data.filter((record) =>
              projects.includes(record.project_name),
            );
          }

          // Filter by metrics if specified
          if (metrics && metrics.length > 0) {
            data = data.map((record) => {
              const filteredRecord: Partial<OSOMetricsCSV> = {
                project_name: record.project_name,
              };

              metrics.forEach((metric) => {
                if (metric in record) {
                  filteredRecord[metric] = record[metric];
                }
              });

              // Since project_name is guaranteed to be present, cast it back to MetricsCSV
              return filteredRecord as OSOMetricsCSV;
            });
          }

          resolve(data);
        }
      },
    });
  });
}
