import type { ResourceItem } from "../projects/types";

export type { ResourceItem };

export type ResourceListResponse = {
  resources: ResourceItem[];
};

export type UploadUrlResponse = {
  fileUrl: string;
  key: string;
  uploadUrl: string;
};
