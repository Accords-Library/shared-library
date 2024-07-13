import { MeiliDocument, SearchRequest, SearchResponse } from "./types";

export class MeilisearchSDK {
  constructor(
    private readonly apiURL: string,
    private readonly bearer: string
  ) {}

  async search({
    q,
    page,
    types,
  }: SearchRequest): Promise<SearchResponse<MeiliDocument>> {
    const filter: string[] = [];

    if (types) {
      if (typeof types === "string") {
        filter.push(`type = ${types}`);
      } else {
        filter.push(`type IN [${types.join(", ")}]`);
      }
    }

    const body = {
      q,
      page,
      hitsPerPage: 25,
      filter,
      sort: ["updatedAt:desc"],
    };

    const result = await fetch(`${this.apiURL}/indexes/DOCUMENT/search`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.bearer}`,
      },
    });
    return await result.json();
  }
}
