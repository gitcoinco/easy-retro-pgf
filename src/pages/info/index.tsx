import { useAccount } from "wagmi";
import Image from "next/image";
import { RoundProgress } from "~/features/info/components/RoundProgress";
import { Layout } from "~/layouts/DefaultLayout";
import { Alert } from "~/components/ui/Alert";
import { Markdown } from "~/components/ui/Markdown";

export default function InfoPage() {
  const { address } = useAccount();

  return (
    <Layout>
      {address ? (
        <>
          <Markdown>{`### Timeline`}</Markdown>
          <RoundProgress />
          <div className="flex flex-col gap-4 pt-6">
            <h4 className="text-2xl font-medium">Application process</h4>
            <p>
              Applicants are mandated to self-report their impact through the
              submission process. In other words, there is no nomination process
              and projects must submit their applications themselves. Any group
              or individual who can demonstrate having a (positive!) impact on
              Pocket Network are welcome to apply.
            </p>
            <p>
              Applicants will be asked for the following:
              <ol className=" my-4 ml-4 flex list-disc flex-col gap-2">
                <li>Name or Alias</li>
                <li>Email</li>
                <li>Contribution/Project Details</li>
                <li>Primary Wallet Address</li>
                <li>wPOKT Wallet Address</li>
                <li>ARB (Arbitrum) Wallet Address</li>
                <li>OP (Optimism) Wallet Address</li>
                <li>
                  Links to relevant resources, such as repositories, product
                  demos, or user testimonials
                </li>
                <li>Previous funding</li>
              </ol>
              All applicants must follow the Applicants Guideline as each
              process will be assessed before voting and will be removed from
              the voting pool if it has violated the guideline.
            </p>
            <h4 className="pt-6 text-2xl font-medium">Application Guideline</h4>
            <p>
              Every type of developer and contributor is eligible for RetroPGF.
              It doesn’t matter if you’re building a consumer app, a key piece
              of infra that POKT pays for, or a free-to-use community tool that
              POKT love. If you’re providing impact, you are eligible for
              funding!
            </p>
            <p>
              <b>Note:</b> You are only evaluated based on the impact you
              already had. Do not mention or allude to your future work or
              future impact. This is retroactive public goods funding, not
              proactive funding!
            </p>
            <h5 className="pt-6 text-lg font-medium">Application rules</h5>
            <p>
              The applications will be assessed before entering the voting pool,
              violating any of the following rules may result in
              disqualification and removal. Also, during the voting process
              voters are able to report violation and if a violation is detected
              it may result the same outcome.
            </p>
            <ul className="my-4 ml-4 flex list-decimal flex-col gap-4">
              <li>
                <b>Promises of future impact</b> - promises of future
                deliverables or impact are not allowed.
              </li>
              <li>
                <b>False statements & deception</b> - false claims about your
                contributions, past impact or funding & grants are not allowed.
              </li>
              <li>
                <b>Hateful Content</b> - No racist, sexist, or otherwise hateful
                speech, no discrimination.
              </li>
              <li>
                <b>Deceiving Voters</b> - Malicious content that could cause
                harm or unintended consequences to users.
              </li>
              <li>
                <b>Fraud & Impersonation</b> - Claiming to be a brand or person
                you are not. The Grant owner must be directly affiliated with
                the project, the funds must go to the project.
              </li>
              <li>
                <b>Advertising</b> - Using RetroPGF application to showcase
                something you are selling like a token sale or NFT drop
              </li>
              <li>
                <b>Bribery</b> - Bribing voters or vote buying is strictly
                forbidden.
              </li>
              <li>
                <b>Contacting voters to promote your application</b> - Using
                private channels such as DMs to promote your applications to
                voters
              </li>
              <li>
                <b>All recipients are subject to KYC</b> - If you do not pass
                KYC, your grant will be returned to the RetroPGF treasury for
                future rounds
              </li>
              <li>
                <b>Outside of RetroPGF’s scope</b> - contributions that do not
                have a clear relationship to Optimism, applications that do not
                highlight a valid contribution* or contributions which are
                outside of the RetroPGF scope**.
                <p className="my-2 ml-4">
                  a. Contribution is defined as an activity which required a
                  minimum time commitment of 1 hour and which provided impact to
                  the Collective.
                </p>
                <p className="my-2 ml-4">
                  b. *Please note that user interactions (e.g., sending
                  transactions) with POKT or wPOKT and staking are not part of
                  the scope of this round{" "}
                </p>
              </li>
              <li>
                <b>Spam</b> - Applications containing spam, such as irrelevant
                answers, plagiarized content, broken or unrelated impact metrics
                and contribution links. Applications in languages other than
                English*.
                <p className="my-2 ml-4">
                  a. This will help simplify the process as this is the working
                  language of the majority of voters. Please ensure you
                  translate any content that’s part of the application.
                </p>
              </li>

              <li>
                <b>Duplicate applications</b> - Multiple applications from the
                same individual, project or group which apply for the same
                impact. An applicant can list multiple projects as its impact
                evidence but applying with different applications for the same
                impact results are not allowed.
              </li>
            </ul>
            <h4 className="pt-6 text-2xl font-medium">Voters</h4>
            <p>
              Voters for this retroactive funding round are:
              <ol className=" my-2 ml-4 flex list-disc flex-col gap-2">
                <li>
                  <a
                    href="https://gnosisscan.io/token/0x59f9e6e5e495f2fb259963dec5ba56cfbd5846e7"
                    target="_blank"
                    className="hover:text-primary-dark"
                  >
                    POKT DAO Voters
                  </a>
                </li>
              </ol>
            </p>
            <p>
              Plus DAO approved Retro PGF Badgeholders
              <ol className=" my-2 ml-4 flex list-disc flex-col gap-2">
                <li>b3nnn.eth (POKT Network Foundation)</li>
                <li>Adz (POKT Network Foundation)</li>
                <li>Jack (POKT Network Foundation)</li>
                <li>Jun (Arbitrum Delegate)</li>
                <li>LauNaMu (Optimism Retro PGF team)</li>
                <li>Sejal Rekhan (Gitcoin / Easy RetroPGF)</li>
                <li>TBC (FireEyes DAO)</li>
              </ol>
            </p>
            <p>
              All voters must follow the Voters Guideline and any violation
              detected might lead to removal of the voter from this round or
              future rounds.
            </p>
            <p>
              Voters should use 2x2 Matrix as a source of truth to detect and
              evaluate applicants impact. Although this rule book is not
              designed to limit the voters and voters are welcome to use their
              own methods of assessing impact.
            </p>
            <h4 className="pt-6 text-2xl font-medium">Voters Guideline</h4>
            <p>
              Voters in RetroPGF are expected to aligned with POKT DNA.
              Violation of this guideline or acting in violation of POKT DNA may
              result in removal of voting rights in this round or beyond. In
              RetroPGF, the Pocket NetworkFoundation will manage enforcement for
              all types of Citizens’ House violations.
            </p>
            <h5 className="pt-6 text-lg font-medium">Guidelines</h5>
            <ul className=" ml-4 flex list-decimal flex-col gap-4">
              <li>
                Voters must avoid conflicts of interest where possible and
                mitigate their impact when not possible. We recommend
                over-communicating and disclosing potential conflicts of
                interest even when they do not warrant abstaining from a vote.
                Any actual or reasonably anticipated conflicts of interest must
                be disclosed in writing and prominently displayed ahead of any
                voting. You can disclose your conflicts of interest here.
                Additionally, voters should not vote for organizations where
                they expect any portion of funds to flow to them or any projects
                from which they derive income.
              </li>
              <li>
                Voters must not use private voting to obscure self-dealing.
                After the RPGF round the foundation may randomly sample ballots
                to check for conflicts of interest. If a suspected self-dealing
                violation is filed, the Foundation may also review the ballot of
                the reported voter to check for conflicts of interest.
              </li>
              <li>
                Voters should refrain from promoting their own project to other
                voters in the voter discussions in Discord/Telegram, meetings &
                workshops, as well as direct messages.
              </li>
            </ul>
            <h5 className="pt-6 text-xl font-medium">2x2 Matrix</h5>
            <Image
              width={828}
              height={504}
              src="/matrix.png"
              alt="2x2 Matrix"
            />
            <h5 className="pt-6 text-lg font-medium">Axises</h5>
            <p>
              To map the evidences of impact to a measurable score we have
              defined three indicators:
              <ol className=" my-2 ml-4 flex list-disc flex-col gap-2">
                <li>Utilization (Breadth)</li>
                <li>Benefit (Depth)</li>
                <li>Significance (Multiplier)</li>
              </ol>
            </p>
            <p>
              Using these indicators in which significance indicator is an
              amplifier of other indicators you can position the projects on our
              impact matrix:
              <ol className=" my-2 ml-4 flex list-disc flex-col gap-2">
                <li>Utilization axis: Utilization * Significance</li>
                <li>Benefit axis: Benefit * Significance</li>
              </ol>
            </p>
            <h5 className="pt-6 text-lg font-medium">Utilization</h5>
            <p>
              How widely, easily and frequently is this used. How many people is
              this impacting and creating utility for.{" "}
              <ol className=" my-2 ml-4 flex list-disc flex-col gap-2">
                <li>How widely used is it? </li>
                <li>How easy is it to use? </li>
                <li>How frequent is this use? </li>
                <li>Do many different stakeholder groups benefit from it? </li>
                <li>
                  Does a very large proportion of any one stakeholder group use
                  this?{" "}
                </li>
                <li>Is use slowing or accelerating?</li>
              </ol>
              <b>
                Only give a very high score of 7+ out of 10 if demonstrably
                widely used across a very high proportion of one stakeholder
                group, or frequent use across many stakeholder groups
              </b>
            </p>
            <h5 className="pt-6 text-lg font-medium">Benefit</h5>
            <p>
              How deeply and impactfully is this benefiting users. How much does
              it delight its users.
              <ol className=" my-2 ml-4 flex list-disc flex-col gap-2">
                <li>What is the benefit to those using it? </li>
                <li>How deep is this impact?</li>
                <li>Any amazing testimonials? </li>
                <li>Is the benefit measurable in terms of $ or time saved?</li>
                <li>
                  Is this benefit likely to continue in the future, or is it
                  more temporary?
                </li>
                <li>
                  Does the good offer a significantly better solution for users
                  other than existing options?
                </li>
                <li>
                  Do users have to do a significant amount of work to
                  use/maintain it?
                </li>
              </ol>
              <b>
                Only give a very high score of 7+ out of 10 if there is clear
                evidence of a deep and long-term measurable benefit
              </b>
            </p>
            <h5 className="pt-6 text-lg font-medium">Significance</h5>
            <p>
              A multiplier on the above impacts for things that have changed the
              trajectory of the project in meaningful ways. Likely through
              outsized or second order impacts on the project.
              <ol className=" my-2 ml-4 flex list-disc flex-col gap-2">
                <li>Is this type of work a game changer or a nice to have? </li>
                <li>What would have happened if this good wasn't created? </li>
                <li>
                  If we could only fund 10 more projects ever, should this be
                  one of them?{" "}
                </li>
                <li>
                  Is there a reason we want to incentives this kind of work more
                  than any other type of work?
                </li>
              </ol>
              <b>
                Only give a very high score of 7+ out of 10 if this contribution
                is a genuine game changer, and much greater than an important
                nice to have
              </b>
            </p>
            <h4 className="text-2xl font-medium"> Assessment & Facilitation</h4>
            <p>
              Pocket Network Foundation on behalf of POKT DAO will be in charge
              of assessment of the projects before them entering the voting
              pool. Any project that violates the Applicants Guideline will be
              removed during the assessment procedure. The same will be applied
              for voters as well according to the Voters Guideline.
            </p>
            <p>
              Additionally, if any individual or group strongly believes that
              they have been wrongfully removed or excluded they are welcomed to
              complain in the POKT forum.
            </p>
          </div>
        </>
      ) : (
        <Alert variant="info" title="Connect your wallet to continue"></Alert>
      )}
    </Layout>
  );
}
