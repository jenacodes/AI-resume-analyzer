export {};

declare global {
  interface FeedbackItem {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation?: string }[];
  }

  interface Resume {
    id: string;
    companyName: string;
    jobTitle: string;
    imagePath: string;
    resumePath: string;
    dateUploaded: string;
    feedback: {
      overallScore: number;
      ATS: FeedbackItem;
      toneAndStyle: FeedbackItem;
      content: FeedbackItem;
      structure: FeedbackItem;
      skills: FeedbackItem;
    };
  }
}
