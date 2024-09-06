import fs from "fs";
import path from "path";
import Papa from "papaparse";
import type { MetricId, OSOMetricsCSV } from "~/types/metrics";

export type FetchImpactMetricsParams = {
  projectIds?: string[];
  metricIds?: MetricId[];
};

const CSV_FILENAME = "metrics.csv";
const FILE_PATH = path.join(process.cwd(), "public", CSV_FILENAME);

export async function fetchImpactMetricsFromCSV(
  filters?: FetchImpactMetricsParams,
): Promise<OSOMetricsCSV[]> {
  if (!fs.existsSync(FILE_PATH)) {
    throw new Error(`CSV file ${CSV_FILENAME} does not exist.`);
  }

  const fileContent = fs.readFileSync(FILE_PATH, "utf-8");

  const { projectIds, metricIds } = filters ?? {};

  const isFilterByProjectId = projectIds && projectIds.length > 0;
  const isFilterByMetricId = metricIds && metricIds.length > 0;

  return new Promise((resolve, reject) => {
    const projectsMetricsArray: OSOMetricsCSV[] = [];

    Papa.parse<OSOMetricsCSV>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      step: (results) => {
        // filtering out rows based on the projectIds array and project_id column
        const row = results.data;
        if (!isFilterByProjectId || projectIds.includes(row.project_id)) {
          if (!isFilterByMetricId) projectsMetricsArray.push(row);
          else {
            // filtering out the metrics columns that are not in the metricIds array
            const filteredRow: Partial<OSOMetricsCSV> = {
              project_id: row.project_id,
              project_name: row.project_name,
            };
            metricIds.forEach((metric) => {
              filteredRow[metric] = row[metric];
            });
            projectsMetricsArray.push(filteredRow as OSOMetricsCSV);
          }
        }
      },
      complete: (results) => {
        if (results.errors.length) {
          reject(results.errors);
        } else {
          resolve(projectsMetricsArray);
        }
      },
    });
  });
}

export function normalizeData(data: OSOMetricsCSV[]): OSOMetricsCSV[] {
  if (data.length === 0) return data; // Return empty array if no data

  // Extract metric keys, excluding 'project_name' and 'project_id'
  const metricKeys = Object.keys(data[0]!).filter(
    (key) => key !== "project_name" && key !== "project_id",
  ) as (keyof OSOMetricsCSV)[];

  // Initialize sum map for each metric
  const sumMap: Record<string, number> = {};

  // Calculate the sum for each metric
  metricKeys.forEach((metric) => {
    const sum = data.reduce(
      (acc, project) => acc + ((project[metric] as number) || 0),
      0,
    );
    sumMap[metric] = sum;
  });

  // Normalize the data
  return data.map((project) => {
    const normalizedProject: Partial<OSOMetricsCSV> | any = {
      project_name: project.project_name,
      project_id: project.project_id,
    };

    metricKeys.forEach((metric) => {
      const value = project[metric] as number;
      const total = sumMap[metric] || 0;

      // Normalize value
      normalizedProject[metric] = total === 0 ? 0 : value / total;
    });

    return normalizedProject as OSOMetricsCSV;
  });
}
