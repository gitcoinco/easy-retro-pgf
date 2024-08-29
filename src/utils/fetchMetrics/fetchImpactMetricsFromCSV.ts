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

export function normalizeData(data: OSOMetricsCSV[]): OSOMetricsCSV[] {
  if (data.length === 0) return data; // Return empty array if no data

  // Extract metric keys, excluding 'project_name' and 'project_id'
  const metricKeys = Object.keys(data[0]!).filter(key =>
    key !== 'project_name' && key !== 'project_id'
  ) as (keyof OSOMetricsCSV)[];

  // Initialize sum map for each metric
  const sumMap: Record<string, number> = {};

  // Calculate the sum for each metric
  metricKeys.forEach(metric => {
    const sum = data.reduce((acc, project) => acc + (project[metric] as number || 0), 0);
    sumMap[metric] = sum;
  });

  // Normalize the data
  return data.map(project => {
    const normalizedProject: Partial<OSOMetricsCSV> | any = {
      project_name: project.project_name,
      project_id: project.project_id
    };

    metricKeys.forEach(metric => {
      const value = project[metric] as number;
      const total = sumMap[metric] || 0;

      // Normalize value
      normalizedProject[metric] = total === 0 ? 0 : value / total;
    });

    return normalizedProject as OSOMetricsCSV;
  });
}