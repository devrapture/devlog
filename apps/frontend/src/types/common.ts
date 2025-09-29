import type { HtmlHTMLAttributes } from "react";
import { type PostType } from "./../hooks/query/use-posts";
export interface QueryParams {
  page: number;
  limit?: number;
  status?: PostType;
}

export type IconProps = HtmlHTMLAttributes<SVGElement>;