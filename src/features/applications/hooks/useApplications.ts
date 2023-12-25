import { api } from "~/utils/api";

export function useApplications() {
  return api.applications.list.useQuery({});
}
