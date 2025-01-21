import { type RegularTagNode, type TextNode } from "@melvdouc/xml-parser";
import { AsyncRoute } from "$fresh/src/server/types.ts";

export interface State {
  isAuthenticated: boolean;
  session: CasContent;
}

export interface AppProperties {
  name: string;
  icon: string;
  pages: Record<string, string>;
  adminOnly: string[];
  hint: string;
}

export interface CasTagNode extends RegularTagNode {
  children: [TextNode];
}

export interface CasGroupNode extends RegularTagNode {
  children: CasTagNode[];
}

export interface CasResponse extends RegularTagNode {
  children: [TextNode, CasGroupNode];
}

export interface CasContent {
  amuCampus: string;
  amuComposante: string;
  amuDateValidation: string;
  coGroup: string;
  eduPersonPrimaryAffiliation: string;
  eduPersonPrincipalName: string;
  mail: string;
  displayName: string;
  givenName: string;
  memberOf: string[];
  sn: string;
  supannCivilite: string;
  supannEntiteAffectation: string;
  supannEtuAnneeInscription: string;
  supannEtuEtape: string;
  uid: string;
}

export interface LoginJWT {
  iss: "PolyMPR";
  iat: number;
  exp: number;
  aud: "PolyMPR";
  user: CasContent;
}

export type EmptyObject = Record<string | number | symbol, never>;

// deno-lint-ignore no-explicit-any
export type Route = AsyncRoute<any, State>;