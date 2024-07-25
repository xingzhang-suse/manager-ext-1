export interface VulnerabilitiesQueryData {
  query_token: string;
  summary: VulnerabilitiesQuerySummary;
  total_matched_records: number;
  total_records: number;
}

export interface VulnerabilitiesQuerySummary {
  count_distribution: VulnerabilitiesQuerySummaryDistribution;
  top_images: VulnerabilitiesQuerySummaryTopAsset[];
  top_nodes: VulnerabilitiesQuerySummaryTopAsset[];
}

export interface VulnerabilitiesQuerySummaryTopAsset {
  index: number;
  display_name: string;
  high: number;
  medium: number;
  low: number;
}

export interface VulnerabilitiesQuerySummaryDistribution {
  high: number;
  medium: number;
  low: number;
  container: number;
  image: number;
  node: number;
  platform: number;
}
