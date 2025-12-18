"use client";
import React, { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import '@/app/styles/scss/main.scss';
import Innerbanner from "@/app/components/common/Innerbanner";
import academicBanner from '@/app/assets/images/academic-calendar-innerbanner.jpg';

const faqData = [
 {
    id: 1,
    question: "Lorem ipsum dolor sit amet consectetur?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  },
  {
    id: 2,
    question: "Consectetur adipiscing elit sed do eiusmod?",
    answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    id: 3,
    question: "Quis nostrud exercitation ullamco laboris?",
    answer: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
  },
  {
    id: 4,
    question: "Ut enim ad minim veniam tempor?",
    answer: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet."
  },
  {
    id: 5,
    question: "Excepteur sint occaecat cupidatat non proident?",
    answer: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa."
  }
];

// Accordion Item Component
const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="accordion-item">
      <button
        onClick={onClick}
        className="accordion-header"
        aria-expanded={isOpen}
      >
        <span className="accordion-question">{question}</span>
        <svg
          className={`accordion-icon ${isOpen ? 'rotate' : ''}`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className="accordion-answer">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header />
      <Innerbanner title="FAQ" image={academicBanner} />

      <div className="sectionPadding">
        <div className="container">
          <div className="faq-section">
            {/* Section Header */}
            <div className="faq-header">
              <h1>Frequently Asked Questions</h1>
              <p>Find answers to common questions about APCPHC</p>
            </div>

            {/* Accordion Container */}
            <div className="accordion-container">
              {faqData.map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onClick={() => handleToggle(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      
    </>
  );
}