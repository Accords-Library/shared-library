import type { Collections } from "./constants";

export type AfterOperationWebHookMessage = {
  collection: Collections;
  id?: string;
  addedDependantIds: string[];
  urls: string[];
};
