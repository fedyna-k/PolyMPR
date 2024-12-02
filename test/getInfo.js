const token = Deno.env.get("CAS_TOKEN");

async function main() {
  const response = await fetch("https://ident.univ-amu.fr/login?service=http://localhost", {
    "Cookie": `TGC=${token}`
  });
  console.log(response.headers);


  const responseText = await response.text();

  console.log(responseText);
}

main();