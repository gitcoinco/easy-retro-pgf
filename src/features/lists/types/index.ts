export type ListMetadata = {
  listDescription: string;
  impactEvaluationLink: string;
  impactEvaluationDescription: string;
  impactCategory: string[];
  listContent: {
    projectId: string;
    amount: number;
    // RPGF3_Application_UID: string;
    // OPAmount: number;
  }[];
};
