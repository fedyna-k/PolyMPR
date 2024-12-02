async function main() {
  const initResponse = await fetch("https://ident.univ-amu.fr/cas/login");
  const initHTML = await initResponse.text();
  const execution = initHTML.match(/(?<=name="execution" value=").*?(?=")/)[0];

  const data = new URLSearchParams();
  data.append("username", process.env.CAS_USERNAME);
  data.append("password", process.env.CAS_PASSWORD);
  data.append("_eventId", "submit");
  data.append("execution", execution);

  const response = await fetch("https://ident.univ-amu.fr/cas/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: data.toString()
  });
  console.log(response.status)
  console.log(response.headers);

  const content = await response.text();
  console.log(content);
}

main()

