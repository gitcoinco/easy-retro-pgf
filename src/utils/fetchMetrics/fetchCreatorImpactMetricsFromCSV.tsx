import fs from "fs";
import path from "path";
import Papa from "papaparse";
import type { CreatorOSOMetricsCSV, MetricId, OSOMetricsCSV } from "~/types/metrics";

export type FetchImpactMetricsParams = {
  projectIds?: string[];
  metricIds?: MetricId[];
};

const CSV_FILENAME = "creatormetrics.csv";
const FILE_PATH = path.join(process.cwd(), "public", CSV_FILENAME);

export async function fetchCreatorImpactMetricsFromCSV(
  filters?: FetchImpactMetricsParams,
): Promise<CreatorOSOMetricsCSV[]> {
  if (!fs.existsSync(FILE_PATH)) {
    throw new Error(`CSV file ${CSV_FILENAME} does not exist.`);
  }

  const fileContent = fs.readFileSync(FILE_PATH, "utf-8");

  const { projectIds } = filters ?? {};

  const isFilterByProjectId = projectIds && projectIds.length > 0;

  return new Promise((resolve, reject) => {
    const projectsMetricsArray: CreatorOSOMetricsCSV[] = [];

    Papa.parse<CreatorOSOMetricsCSV>(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      step: (results) => {
        // filtering out rows based on the projectIds array and project_id column        
        const row = results.data;
        const applicationIdList = row.application_id_list ? row.application_id_list : []; 
        const idIncluded = projectIds?.some(id => applicationIdList.includes(id));
      
        if (!isFilterByProjectId || idIncluded || applicationIdList.length === 0) {

          // our parser parses them character by character into an array lol
          const appIDArray = new String(row.application_id_list).substring(1, applicationIdList.length - 1).split(",");
          const cleanAppid = appIDArray.map((appID) => {
            return appID.trim().split("\"").join('').split("\'").join('');
          });

          const builtRow = {
            recipient: row.recipient,
            name: row.name,
            minting_wallet: row.minting_wallet,
            num_drops: row.num_drops,
            num_unique_minters: row.num_unique_minters,
            num_transactions: row.num_transactions,
            usd_value_of_transactions: row.usd_value_of_transactions,
            num_farcaster_minters: row.num_farcaster_minters,
            num_farcaster_transactions: row.num_farcaster_transactions,
            application_id_list: cleanAppid,
            metrics_type: 1
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
