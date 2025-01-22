import { FreshContext, Handlers } from "$fresh/server.ts";
import { State } from "$root/defaults/interfaces.ts";
import { parse, type RegularTagNode } from "@melvdouc/xml-parser";
import {
  CasContent,
  CasResponse,
  CasTagNode,
  LoginJWT,
} from "$root/defaults/interfaces.ts";
import { createJwt } from "@popov/jwt";
import { setCookie } from "$std/http/cookie.ts";
import { getKey } from "$root/routes/_middleware.ts";

const CAS = "https://ident.univ-amu.fr/cas";

/**
 * Get the tag node value without "cas:" prefix in name.
 * @param tag The CAS tag node.
 * @returns The `[name, value]` pair.
 */
function getTag(tag: CasTagNode): [name: string, value: string] {
  return [
    tag.tagName.replace("cas:", ""),
    tag.children[0].value,
  ];
}

/**
 * Gets the user JWT token with a validity period of one hour.
 * @param casResponse The CAS reponse parsed from XML.
 * @returns The user JWT session token.
 */
function createUserJWT(casResponse: CasResponse): Promise<string> {
  const nodes = casResponse.children[1].children.map(getTag);
  const fullUserInfos: Record<string, string | string[]> = {};

  nodes.forEach(([key, value]: [string, string]) => {
    if (typeof fullUserInfos[key] == "string") {
      fullUserInfos[key] = [fullUserInfos[key]];
    }
    if (Array.isArray(fullUserInfos[key])) {
      fullUserInfos[key].push(value);
    } else {
      fullUserInfos[key] = value;
    }
  });

  const now = Math.floor(Date.now() / 1000);
  const payload: LoginJWT = {
    iss: "PolyMPR",
    iat: now,
    exp: now + 0xe10,
    aud: "PolyMPR",
    user: fullUserInfos as unknown as CasContent,
  };

  const key = getKey(fullUserInfos.uid as string);
  return createJwt(payload, key);
}

export const handler: Handlers<null, State> = {
  /**
   * Handles all CAS protocol requests.
   * @param request The incomming HTTP request.
   * @param context The Fresh context with `State`.
   * @returns The redirect corresponding to each step of the CAS protocol.
   */
  async GET(
    request: Request,
    context: FreshContext<State, null>,
  ): Promise<Response> {
    const url = new URL(request.url);
    const ticket = url.searchParams.get("ticket");
    const service = `${context.url.origin}/login`;

    if (!ticket) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: context.state.isAuthenticated
            ? "/apps"
            : `${CAS}/login?service=${service}`,
        },
      });
    }

    const response = await fetch(
      `${CAS}/serviceValidate?service=${service}&ticket=${ticket}`,
    );
    const body = parse(await response.text()) as [RegularTagNode];
    const casResponse = body[0].children[0] as CasResponse;

    if (casResponse.tagName != "cas:authenticationSuccess") {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${CAS}/login?service=${service}`,
        },
      });
    }

    const headers = new Headers();

    setCookie(headers, {
      name: "sessionToken",
      value: await createUserJWT(casResponse),
    });
    headers.set("Location", "/apps");

    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
