export type V2TaskStatus =
  | "pending"
  | "in_progress"
  | "submitted"
  | "done"
  | "skipped";

export interface V2Task {
  id: string;
  short: string;
  title: string;
  desc: string;
  time: number;
  prio: number;
  icon: string;
  cta: string;
  parts?: string[];
  logos?: [string, string][];
  kv?: [string, string];
  /** real-backend fields; absent in the demo kit */
  status?: V2TaskStatus;
  skippable?: boolean;
  actionReady?: boolean;
}

export interface V2UnlockItem {
  label: string;
  icon: string;
}

export interface V2AssetFile {
  name: string;
  size: number;
  url?: string;
  /** still uploading - render muted */
  pending?: boolean;
}

export interface V2Profile {
  name: string;
  site: string;
  logo: V2AssetFile | null;
  assets: {
    images: V2AssetFile[];
    video: V2AssetFile[];
    fonts: V2AssetFile[];
    colors: Record<string, string>;
  };
}

export interface V2Note {
  id: number;
  type: "mention" | "system";
  icon: string;
  title: string;
  sub: string;
  t: string;
}
