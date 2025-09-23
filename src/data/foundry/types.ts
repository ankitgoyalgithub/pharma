// Shared types for Foundry module

export type SourceType =
  | "csv"
  | "hdfs"
  | "s3"
  | "snowflake"
  | "gdrive"
  | "oracle"
  | "salesforce"
  | "sap"
  | "upload_csv";

export type EntityType = "master" | "timeseries" | "featurestore";

export interface EntityModule {
  title: string;
  description: string;
  origin: "csv" | "third-party";
  route: string;
  recordCount: number;
  lastSync: string; // ISO string
  sourceType: SourceType;
}

export interface TableColumn {
  accessorKey: string;
  header: string;
}

export interface EntityPreviewData {
  title: string;
  description: string;
  columns: TableColumn[];
  rows: Record<string, any>[];
  stats: {
    totalRecords: number;
    lastSync: string;
    source: string;
  };
}

export type EntityPreviewMap = Record<string, EntityPreviewData>;