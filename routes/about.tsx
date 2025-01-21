import { FreshContext } from "$fresh/server.ts";

// deno-lint-ignore require-await
export default async function About(_request: Request, _context: FreshContext) {
  return (
    <>
      <h2>About PolyMPR</h2>
      <p>
        PolyMPR is born from the will to enhance Polytech INFO department's HR
        infrastructure.
      </p>
      <h2>Terms of Use</h2>
      <p>
        <em>
          Last updated: 21<sup>th</sup> Jan. 2025
        </em>
      </p>
      <p>
        By accessing and using this website through the Aix-Marseille University
        (AMU) Single Sign-On (SSO) authentication system, you agree to comply
        with these Terms and Conditions. Please read them carefully before
        proceeding.
      </p>
      <h3>1. Acceptance of Terms</h3>
      <p>By logging in with your AMU SSO credentials, you confirm that:</p>
      <ul>
        <li>
          You are an authorized user of Aix-Marseille University's SSO system.
        </li>
        <li>
          You agree to be bound by these Terms and Conditions, as well as any
          additional rules, policies, or guidelines applicable to the use of
          this website.
        </li>
      </ul>
      <p>
        If you do not agree with these terms, you are not authorized to access
        or use this website.
      </p>
      <h3>2. Eligibility</h3>
      <p>
        Access to this website is restricted to authorized individuals
        affiliated with Aix-Marseille University, such as students, faculty,
        staff, or others explicitly granted access. Unauthorized use is strictly
        prohibited and may result in suspension or termination of access.
      </p>
      <h3>3. Authentication Through AMU SSO</h3>
      <ul>
        <li>
          Authentication through AMU's SSO system is required to access this
          website.
        </li>
        <li>
          You are responsible for safeguarding your AMU SSO login credentials
          and ensuring they are not shared with others.
        </li>
        <li>
          If you suspect unauthorized use of your AMU SSO credentials, you must
          immediately notify Aix-Marseille University's IT services at{" "}
          <a href="https://dirnum.univ-amu.fr/fr">
            https://dirnum.univ-amu.fr/fr
          </a>.
        </li>
      </ul>
      <h3>4. Permitted Use</h3>
      <p>By accessing the website, you agree to:</p>
      <ul>
        <li>
          Use the website only for its intended academic, administrative, or
          research purposes.
        </li>
        <li>
          Refrain from engaging in any of the following prohibited activities:
        </li>
        <ul>
          <li>
            Sharing your access credentials with unauthorized individuals.
          </li>
          <li>
            Misusing, modifying, or attempting to exploit the website's
            services.
          </li>
          <li>
            Uploading or distributing malware, offensive content, or any
            material that violates university policies or applicable laws.
          </li>
        </ul>
      </ul>
      <h3>5. Privacy and Data Protection</h3>
      <p>By using this website:</p>
      <ul>
        <li>
          You acknowledge that your personal data, including your AMU SSO login
          and activity on the website, may be collected, processed, and stored
          in accordance with Aix-Marseille University’s privacy policy and
          applicable data protection laws (e.g., GDPR).
        </li>
        <li>
          This data is used for authentication, and improving the website's
          services.
        </li>
      </ul>
      <h3>6. Intellectual Property</h3>
      <ul>
        <li>
          All content and materials provided on this website are the
          intellectual property of Aix-Marseille University or its licensors.
        </li>
        <li>
          You are granted a limited, non-transferable license to use the content
          for personal, academic, or research purposes. Any unauthorized use,
          reproduction, or distribution is strictly prohibited.
        </li>
      </ul>
      <h3>7. Termination of Access</h3>
      <ul>
        <li>
          Aix-Marseille University reserves the right to suspend or terminate
          your access without notice if:
        </li>
        <ul>
          <li>
            You violate these Terms and Conditions or university policies.
          </li>
          <li>
            Your AMU affiliation is revoked or your SSO account is deactivated.
          </li>
        </ul>
        <li>
          Unauthorized access attempts may be reported to the appropriate
          authorities.
        </li>
      </ul>
      <h3>8. Disclaimers and Limitations of Liability</h3>
      <ul>
        <li>
          The website and its content are provided "as is" and "as available"
          without any warranties, express or implied.
        </li>
        <li>
          Aix-Marseille University and the website administrators are not liable
          for:
        </li>
        <ul>
          <li>Interruptions in service, data loss, or technical issues.</li>
          <li>
            Any unauthorized use of your AMU SSO credentials resulting from your
            negligence.
          </li>
        </ul>
      </ul>
      <h3>9. Modifications to the Terms</h3>
      <ul>
        <li>
          Aix-Marseille University may update these Terms and Conditions
          periodically to reflect changes in laws, policies, or services.
        </li>
        <li>
          Your continued use of the website following any changes constitutes
          your acceptance of the updated terms.
        </li>
      </ul>
      <h3>10. Governing Law</h3>
      <p>
        These Terms and Conditions are governed by and construed in accordance
        with the laws of France and applicable EU regulations.
      </p>
      <h3>11. Contact Information</h3>
      <p>
        For questions or support, please contact:{" "}
        <a href="https://dirnum.univ-amu.fr/fr">
          Aix-Marseille University IT Services
        </a>.
      </p>
    </>
  );
}
