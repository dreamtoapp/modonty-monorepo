export interface GTMSettings {
  containerId: string | null;
  enabled: boolean;
}

export async function getGTMSettings(): Promise<GTMSettings> {
  const containerId = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID || null;
  return {
    containerId,
    enabled: !!containerId,
  };
}
