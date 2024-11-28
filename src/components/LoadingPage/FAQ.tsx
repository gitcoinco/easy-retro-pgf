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
      question: 'What is the Obol Contributions Program?', answer: `As described in our blog post, the Obol Contributions Program is an opportunity for every staker to participate in and get recognised for scaling and decentralising Ethereum by staking on Obol distributed validators (DVs).\n` +
        `\n• Stake deployed on Obol DVs will contribute 1% of staking rewards to the Obol Collective’s retroactive funding mechanism.\n` +
        `\n• Those contributions will be tracked and recognised, serving as the basis for future governance and ownership in the Obol Collective.`
    },
    { question: 'How do I participate in the Obol Contributions Program?', answer: 'Stake on DVs via partner products Stakely, Chorus One Vault for Stakewise, or Mellow Vault for Lido, or deploy a distributed validator cluster yourself via the Launchpad, for example by using a DappNode.' },
    { question: 'How can I track my contributions?', answer: 'If you’re staking through a partner product, their dashboard will display your contributions. If you’re running your own DV, your contributions will be displayed on the DV Launchpad.' },
    { question: 'What benefits do I get from contributing?', answer: 'Contributions will serve as the basis for future ownership and governance of the Obol Collective’s retroactive funding mechanism.' },
    { question: 'How are contributions calculated?', answer: 'Contributions are based on 1% of validator rewards, which are contributed to the Obol Collective’s “1% for Decentralization” retroactive fund. (retroactivefunding.obol.eth) Contributions are calculated daily and tracked off-chain. See our docs for a more detailed explanation.' },
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
