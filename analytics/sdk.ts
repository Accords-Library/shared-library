import type { TrackRequestParams } from "./types";

type AnalyticsBody = Record<string, unknown> & {
  type: "event" | "request";
  timestamp: number;
};

export class AnalyticsSDK {
  constructor(private readonly apiURL: string) {}

  trackRequest(request: Request, { clientAddress, locale, responseStatus }: TrackRequestParams) {
    const userAgent = request.headers.get("User-Agent");
    const acceptLanguage = request.headers.get("Accept-Language");
    const { method, url: stringUrl, referrer } = request;
    const url = new URL(stringUrl);

    this.track({
      type: "request",
      timestamp: Date.now(),
      payload: {
        user: {
          address: clientAddress,
          attributes: {
            locale,
          },
        },
        request: {
          method,
          pathname: url.pathname,
          referrer,
          ...(acceptLanguage ? { acceptLanguage } : {}),
          ...(userAgent ? { userAgent } : {}),
        },
        response: {
          status: responseStatus,
        },
      },
    });
  }

  trackEvent(eventName: string) {
    this.track({
      type: "event",
      timestamp: Date.now(),
      eventName,
    });
  }

  private async track(body: AnalyticsBody) {
    try {
      await fetch(this.apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.warn("Couldn't send analytics", e);
    }
  }
}
