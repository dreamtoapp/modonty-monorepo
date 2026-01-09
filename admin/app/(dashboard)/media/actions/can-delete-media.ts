"use server";

import { getMediaUsage } from "./get-media-usage";

export async function canDeleteMedia(id: string, clientId?: string) {
  try {
    const usageResult = await getMediaUsage(id, clientId);
    if (!usageResult.success) {
      return { canDelete: false, reason: usageResult.error };
    }

    const { usage } = usageResult;
    if (!usage) {
      return { canDelete: false, reason: "Failed to get usage information" };
    }

    // Check for published articles usage
    const publishedUsage = usage.featuredIn.filter((a) => a.status === "PUBLISHED");
    if (publishedUsage.length > 0) {
      return {
        canDelete: false,
        reason: `This media is used in ${publishedUsage.length} published article(s). Please remove it from articles first.`,
        usage: publishedUsage,
      };
    }

    // Check for Client media relations
    const { clientUsage } = usage;
    if (clientUsage?.logoClient) {
      return {
        canDelete: false,
        reason: `This media is used as logo for client '${clientUsage.logoClient.name}'. Please change the client's media settings first.`,
        usage: { clientUsage },
      };
    }

    if (clientUsage?.ogImageClient) {
      return {
        canDelete: false,
        reason: `This media is used as OG image for client '${clientUsage.ogImageClient.name}'. Please change the client's media settings first.`,
        usage: { clientUsage },
      };
    }

    if (clientUsage?.twitterImageClient) {
      return {
        canDelete: false,
        reason: `This media is used as Twitter image for client '${clientUsage.twitterImageClient.name}'. Please change the client's media settings first.`,
        usage: { clientUsage },
      };
    }

    return { canDelete: true, usage };
  } catch (error) {
    return { canDelete: false, reason: "Failed to check media usage" };
  }
}
