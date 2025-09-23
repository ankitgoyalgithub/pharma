import { SourceType } from "./types";

// Image imports
import csvIcon from "@/assets/csv.png";
import hdfsIcon from "@/assets/hdfs.svg";
import s3Icon from "@/assets/s3.svg";
import snowflakeIcon from "@/assets/snowflake.svg";
import gdriveIcon from "@/assets/gdrive.png";

export const sourceTypeIcon: Record<SourceType, string> = {
  csv: csvIcon,
  hdfs: hdfsIcon,
  s3: s3Icon,
  snowflake: snowflakeIcon,
  gdrive: gdriveIcon,
  oracle: hdfsIcon, // placeholder
  salesforce: gdriveIcon, // placeholder
  sap: hdfsIcon, // placeholder
  upload_csv: csvIcon,
};