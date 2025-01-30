import { useState } from 'react';

export const FAQ = () => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenIndexes((prevState) =>
      prevState.includes(index)
        ? prevState.filter((item) => item !== index)
        : [...prevState, index]
    );
  };

  const faqs = [
    {
      question: 'What is the Obol RAF?', answer: "The Obol RAF (Retroactive Fund) is a funding model which rewards projects strengthening and promotes the Obol Collective’s Decentralized Operator Ecosystem and its ability to scale decentralized infrastructure networks like Ethereum. The funding is designed to reward tangible impact while creating strong incentives for sustained innovation and collaboration by the community."
    },
    { question: 'Who can apply in the RAF?', answer: "Any project that meets the RAF round’s criteria can make an application through the RAF portal. For more information, please read the application guide on community.obol.org." },
    { question: 'What criteria are used to evaluate projects for RAF funding?', answer: "The Obol Collective has implemented impact metrics-based evaluation to ensure more informed decision-making during funding rounds. These metrics aim to provide delegates with objective data to assess the impact of each project, enabling them to allocate their votes effectively and in alignment with the Collective’s mission." },
    { question: 'When will the applications close?', answer: 'Application and voting dates are defined for each RAF round, with specific start and end dates provided per round. Please visit blog.obol.org for information about the latest round.' },
    { question: 'Who is eligible to vote?', answer: 'Voting is conducted by OBOL token delegates who have delegated voting power. Only addresses with sufficient delegation can vote, and contributors with conflicts of interest are restricted from voting on projects in which they have a direct stake. For more information, please read the delegate guide on community.obol.org.'},
    { question: 'When are the rewards paid out?', answer: 'Rewards are disbursed after the voting round concludes, based on the votes by delegates. The distribution uses a quadratic funding mechanism, ensuring compliance with legal standards and may require KYC completion by grant recipients.' },
    { question: 'Can I submit feedback after participating in the RAF?', answer: 'Yes, participants are encouraged to provide feedback at the end of each RAF round. This feedback helps refine future rounds and strengthens the RAF governance process.' },
    { question: 'What is the role of the Obol Association in RAF funding?', answer: 'The Obol Association oversees administrative tasks like moderating proposals, managing vote accuracy, and ensuring compliance for funding disbursement, including KYC verification as necessary.' },

  ];

  return (
    <div className="max-w-2xl mx-auto my-24">
      <div className="text-black text-4xl leading-10 mb-10 text-center">FAQs</div>
      {faqs.map((faq, index) => (
        <div key={index} className="border-b last:border-none">
          <div
            className="py-4 cursor-pointer flex items-center justify-between"
            onClick={() => toggleFAQ(index)}
          >
            <div className="text-black text-lg font-semibold leading-7">{faq.question}</div>
            <div className="text-xl">
              {openIndexes.includes(index) ? 'x' : '+'}
            </div>
          </div>
          {openIndexes.includes(index) && (
            <div className="text-[#2d4d53] text-base font-normal whitespace-pre-line pb-4">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
