import { Handlers } from "$fresh/server.ts";
import { State } from "./_middleware.ts";
import { parse, type XmlNode } from "@melvdouc/xml-parser";
import { createJwt } from "@popov/jwt";
import { setCookie } from "$std/http/cookie.ts";


const SERVICE = "https://localhost/login";
const CAS = "https://ident.univ-amu.fr/cas";


function getTag(tag: XmlNode): [string, string] {
  return [
    tag.tagName.replace("cas:", ""),
    tag.children[0].value
  ];
}


async function createUserJWT(casResponse: XmlNode): Promise<string> {
  const nodes = casResponse.children[1].children.map(getTag);
  const fullUserInfos = {};

  nodes.forEach(([key, value]) => {
    if (fullUserInfos[key] && Array.isArray(fullUserInfos[key])) {
      fullUserInfos[key].push(value);
    }
    else if (fullUserInfos[key]) {
      fullUserInfos[key] = [fullUserInfos[key], value];
    }
    else {
      fullUserInfos[key] = value;
    }
  });

  const now = Math.floor(Date.now() / 1000);
  const oneHour = 60 * 60;

  const payload = {
    iss: "PolyMPR",
    iat: now,
    exp: now + oneHour,
    aud: "PolyMPR",
    user: fullUserInfos
  };

  const key = "NEED TO CHANGE THIS KEY FURTHER IN DEV";
  return createJwt(payload, key);
}


export const handler: Handlers<any, State> = {
  async GET(request, context) {
    const url = new URL(request.url);
    const ticket = url.searchParams.get("ticket");

    if (ticket) {
      const response = await fetch(`${CAS}/serviceValidate?service=${SERVICE}&ticket=${ticket}`);
      const body = parse(await response.text(), "application/xml");
      const casResponse = body[0].children[0];

      if (casResponse.tagName != "cas:authenticationSuccess") {
        return new Response(null, {
          status: 302,
          headers: {
            Location: `${CAS}/login?service=${SERVICE}`
          }
        });
      }

      const headers = new Headers();

      setCookie(headers, {
        name: "sessionToken",
        value: await createUserJWT(casResponse)
      });
      headers.set("Location", "/apps");

      return new Response(null, {
        status: 302,
        headers
      });
    }

    if (context.state.isAuthenticated) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/apps"
        }
      });
    }
    else {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `${CAS}/login?service=${SERVICE}`
        }
      });
    }
  }
};