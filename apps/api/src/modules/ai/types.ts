import type { ConvertToProjectInput, GenerateBriefInput, MilestoneScopeItem } from "./schema";

export type { ConvertToProjectInput, GenerateBriefInput, MilestoneScopeItem };

export type GeneratedBriefResponse = {
  clientName: string;
  proposal: string;
  scopeOfWork: MilestoneScopeItem[];
  summary: string;
  title: string;
};
