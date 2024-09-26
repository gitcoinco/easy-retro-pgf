import fs from "fs";
import path from "path";
import Papa from "papaparse";
import type { BatchedOSOMetricsCSV, MetricId, OSOMetricsCSV } from "~/types/metrics";

export type FetchImpactMetricsParams = {
  projectIds?: string[];
  metricIds?: MetricId[];
};

const CSV_FILENAME = "metrics.csv";
const FILE_PATH = path.join(process.cwd(), "public", CSV_FILENAME);

export async function fetchBatchedImpactMetricsFromCSV(
  filters?: FetchImpactMetricsParams,
): Promise<BatchedOSOMetricsCSV[]> {
  if (!fs.existsSync(FILE_PATH)) {
    throw new Error(`CSV file ${CSV_FILENAME} does not exist.`);
  }

  const fileContent = fs.readFileSync(FILE_PATH, "utf-8");

  const { projectIds, metricIds } = filters ?? {};

  const isFilterByProjectId = projectIds && projectIds.length > 0;

  return new Promise((resolve, reject) => {
    const projectsMetricsArray: BatchedOSOMetricsCSV[] = [];

    Papa.parse<BatchedOSOMetricsCSV>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      step: (results) => {
        // filtering out rows based on the projectIds array and project_id column
        const row = results.data;
        const idIncluded = projectIds?.some(id => row.application_id_list.includes(id));
        if (!isFilterByProjectId || idIncluded) {

          // our parser parses them character by character into an array lol
          const appIDArray = new String(row.application_id_list).substring(1, row.application_id_list.length - 1).split(",");
          const cleanAppid = appIDArray.map((appID) => {
            return appID.trim().split("\"").join('').split("\'").join('');
          });

          // our parser parses them character by character into an array lol
          const uuidArray = new String(row.uuid_list).substring(1, row.uuid_list.length - 1).split(",");
          const cleanUuid = uuidArray.map((uuid) => {
            return uuid.trim().split("\"").join('').split("\'").join('');
          });

          const builtRow = {
            recipient: row.recipient,
            name: row.name,
            transactions_90D: row.transactions_90D,
            transactions_180D: row.transactions_180D,
            active_addresses_90D: row.active_addresses_90D,
            active_addresses_180D: row.active_addresses_180D,
            farcaster_users_90D: row.farcaster_users_90D,
            farcaster_users_180D: row.farcaster_users_180D,
            daily_active_addresses_90D: row.daily_active_addresses_90D,
            daily_active_addresses_180D: row.daily_active_addresses_180D,
            uuid_list: cleanUuid,
            application_id_list: cleanAppid,
          }
          projectsMetricsArray.push(builtRow);
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
