import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, RotateCcw, Sparkles, Trophy, BookOpen } from "lucide-react";

// Types
interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: string;
  type: string;
  question: string;
  correct: string;
  options: string[];
  shuffledOptions?: string[]; // Store shuffled options
}

interface Message {
  type: "bot" | "user";
  text: string;
  timestamp: number;
}

interface QuizState {
  active: boolean;
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  answered: number;
  mode: string | null;
  awaitingAnswer: boolean;
}

// Constants
const QUIZ_LENGTH = 10;
const ENCOURAGEMENTS = [
  "🎯 Correct! You're on fire!",
  "✅ Perfect! You know your crypto!",
  "🌟 Excellent! That's right!",
  "🎉 Nice work! Correct answer!",
  "💡 Brilliant! You got it!"
];

const FUN_FACTS: Record<string, string> = {
  "Satoshi Nakamoto": "Fun fact: To this day, Satoshi Nakamoto's true identity remains unknown. They disappeared from public view in 2010!",
  "21 million coins": "Interesting: The last Bitcoin won't be mined until approximately the year 2140!",
  "Mining": "Did you know: Bitcoin mining consumes about as much electricity as some small countries!",
  "Vitalik Buterin": "Fun fact: Vitalik was only 19 years old when he co-founded Ethereum!",
  "Blockchain": "Amazing fact: The first blockchain was conceptualized by Satoshi Nakamoto in 2008!"
};

const EXPLANATIONS: Record<string, string> = {
  "SHA-256": "SHA-256 is the cryptographic hash function that secures Bitcoin transactions. It's virtually impossible to reverse!",
  "Proof-of-Stake (PoS)": "Ethereum switched to PoS in 2022, making it much more energy-efficient than Proof-of-Work!",
  "The Merge": "The Merge reduced Ethereum's energy consumption by over 99%!"
};

// Quiz data
const quizData: QuizQuestion[] = [
  { id: "BTC-001", topic: "Bitcoin Basics", difficulty: "Easy", type: "Multiple Choice", question: "Who is the pseudonymous creator of Bitcoin?", correct: "Satoshi Nakamoto", options: ["Vitalik Buterin", "Hal Finney", "Nick Szabo"] },
  { id: "BTC-002", topic: "Bitcoin Basics", difficulty: "Easy", type: "Multiple Choice", question: "What is the total maximum supply of Bitcoin?", correct: "21 million coins", options: ["Unlimited", "100 million coins", "42 million coins"] },
  { id: "BTC-003", topic: "Bitcoin Tech", difficulty: "Easy", type: "True/False", question: "Bitcoin's initial consensus mechanism is Proof-of-Stake (PoS).", correct: "False", options: ["True"] },
  { id: "BTC-004", topic: "Bitcoin Tech", difficulty: "Easy", type: "Multiple Choice", question: "The process of creating new bitcoins and validating transactions is called:", correct: "Mining", options: ["Staking", "Forging", "Burning"] },
  { id: "BTC-005", topic: "Bitcoin Tech", difficulty: "Easy", type: "Fill-in-Blank", question: "The smallest unit of Bitcoin is called a _.", correct: "Satoshi", options: ["Wei", "Finney", "Gwei"] },
  { id: "BTC-006", topic: "Bitcoin Basics", difficulty: "Easy", type: "Multiple Choice", question: "In what year was the Bitcoin Whitepaper published?", correct: "2008", options: ["2009", "2013", "2005"] },
  { id: "BTC-007", topic: "Bitcoin Tech", difficulty: "Medium", type: "Multiple Choice", question: "Bitcoin transactions are secured using which cryptographic hash function?", correct: "SHA-256", options: ["Keccak-256", "Scrypt", "Ethash"] },
  { id: "BTC-008", topic: "Bitcoin Concept", difficulty: "Medium", type: "Multiple Choice", question: "What is the primary purpose of Bitcoin?", correct: "Store of value and digital currency", options: ["Platform for smart contracts", "Enabling DeFi lending", "Creating NFTs"] },
  { id: "BTC-009", topic: "Bitcoin Tech", difficulty: "Medium", type: "Multiple Choice", question: "Approximately how often is a new block typically added to the Bitcoin blockchain?", correct: "Every 10 minutes", options: ["Every 12 seconds", "Every 1 minute", "Every 30 minutes"] },
  { id: "BTC-010", topic: "Bitcoin Concept", difficulty: "Medium", type: "True/False", question: "Bitcoin is controlled by a central bank or financial authority.", correct: "False", options: ["True"] },
  { id: "ETH-016", topic: "Ethereum Basics", difficulty: "Easy", type: "Multiple Choice", question: "Who is a co-founder of the Ethereum network?", correct: "Vitalik Buterin", options: ["Satoshi Nakamoto", "Jamie Dimon", "Charlie Lee"] },
  { id: "ETH-017", topic: "Ethereum Basics", difficulty: "Easy", type: "Multiple Choice", question: "What is the native cryptocurrency used on the Ethereum network?", correct: "Ether (ETH)", options: ["Ethereum Coin (EC)", "Gas", "Bitcoin"] },
  { id: "ETH-018", topic: "Ethereum Tech", difficulty: "Easy", type: "Multiple Choice", question: "What is the name of the software that executes code on the Ethereum network?", correct: "Ethereum Virtual Machine (EVM)", options: ["EV-Node", "Ether Processor", "Crypto-OS"] },
  { id: "ETH-022", topic: "Ethereum Tech", difficulty: "Medium", type: "Multiple Choice", question: "What consensus mechanism does Ethereum use after its 2022 major upgrade?", correct: "Proof-of-Stake (PoS)", options: ["Proof-of-Work (PoW)", "Delegated Proof-of-Stake", "Proof-of-Authority"] },
  { id: "ETH-023", topic: "Ethereum Tech", difficulty: "Medium", type: "Multiple Choice", question: "What was the name of the 2022 event where Ethereum switched its consensus mechanism?", correct: "The Merge", options: ["The Shard", "The Fork", "The Upgrade"] },
  { id: "COMP-031", topic: "Comparison", difficulty: "Easy", type: "Multiple Choice", question: "Which of the two is often referred to as 'Digital Gold'?", correct: "Bitcoin", options: ["Ethereum"] },
  { id: "COMP-032", topic: "Comparison", difficulty: "Easy", type: "Multiple Choice", question: "Which cryptocurrency is the largest by market capitalization (historically)?", correct: "Bitcoin", options: ["Ethereum"] },
  { id: "TECH-037", topic: "General Tech", difficulty: "Easy", type: "Multiple Choice", question: "What is a digital ledger of transactions duplicated and distributed across the entire network of computer systems?", correct: "Blockchain", options: ["Bitcoin", "Hard Wallet", "Exchange"] },
  { id: "TECH-038", topic: "General Tech", difficulty: "Easy", type: "Multiple Choice", question: "What is the secret code that gives you ownership of your cryptocurrency?", correct: "Private Key", options: ["Public Key", "Wallet Address", "Username"] },
  { id: "TECH-040", topic: "General Tech", difficulty: "Medium", type: "Multiple Choice", question: "What concept means that once data is recorded on the blockchain, it cannot be altered?", correct: "Immutability", options: ["Decentralization", "Transparency", "Tokenization"] },
];

// Helper functions
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const normalizeAnswer = (answer: string): string => 
  answer.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');

export const CryptoQuizBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      type: "bot", 
      text: "Hey there! 👋 Welcome to CryptoQuiz! Ready to test your crypto knowledge? I've got questions on Bitcoin, Ethereum, and blockchain tech.",
      timestamp: Date.now()
    },
    {
      type: "bot",
      text: "What would you like to do?\n\nA) Random 10-question quiz (Mixed difficulty)\nB) Practice by topic\nC) Choose difficulty level",
      timestamp: Date.now() + 1
    }
  ]);
  const [input, setInput] = useState("");
  const [quizState, setQuizState] = useState<QuizState>({
    active: false,
    questions: [],
    currentIndex: 0,
    score: 0,
    answered: 0,
    mode: null,
    awaitingAnswer: false
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addMessage = useCallback((type: "bot" | "user", text: string) => {
    setMessages(prev => [...prev, { type, text, timestamp: Date.now() }]);
  }, []);

  const getQuestionMessage = useCallback((question: QuizQuestion, index: number, score: number): string => {
    const allOptions = [question.correct, ...question.options];
    const shuffledOptions = shuffleArray(allOptions);
    
    // Store shuffled options in question for later answer checking
    question.shuffledOptions = shuffledOptions;
    
    let optionsText = "";
    if (question.type === "Multiple Choice") {
      optionsText = shuffledOptions.map((opt, i) => 
        `${String.fromCharCode(65 + i)}) ${opt}`
      ).join("\n");
    } else if (question.type === "True/False") {
      optionsText = "A) True\nB) False";
    } else {
      optionsText = "Type your answer below:";
    }

    return `**Question ${index + 1} of 10** | Score: ${score}/${index}\n\n${question.question}\n\n${optionsText}\n\nWhat's your answer?`;
  }, []);

  const checkAnswer = useCallback((userAnswer: string, question: QuizQuestion): boolean => {
    const normalizedAnswer = normalizeAnswer(userAnswer);
    const correctAnswer = normalizeAnswer(question.correct);
    
    // Check various answer formats
    if (question.type === "Multiple Choice") {
      const shuffledOptions = question.shuffledOptions || [question.correct, ...question.options];
      
      // Check if it's a letter choice (A, B, C, D)
      if (/^[a-d]$/i.test(normalizedAnswer)) {
        const index = normalizedAnswer.charCodeAt(0) - 97;
        const selectedAnswer = normalizeAnswer(shuffledOptions[index] || "");
        return selectedAnswer === correctAnswer;
      }
      
      // Check direct text match
      return normalizedAnswer === correctAnswer || 
             normalizedAnswer.includes(correctAnswer) ||
             correctAnswer.includes(normalizedAnswer);
    }
    
    if (question.type === "True/False") {
      if (/^[ab]$/i.test(normalizedAnswer)) {
        const boolAnswer = normalizedAnswer === 'a' ? 'true' : 'false';
        return correctAnswer.includes(boolAnswer);
      }
      return correctAnswer.includes(normalizedAnswer);
    }
    
    // Fill-in-blank
    return normalizedAnswer === correctAnswer || correctAnswer.includes(normalizedAnswer);
  }, []);

  const startQuiz = useCallback((mode: string, difficulty: string | null = null, topic: string | null = null) => {
    let selectedQuestions = [...quizData];
    
    if (difficulty) {
      selectedQuestions = selectedQuestions.filter(q => q.difficulty === difficulty);
    }
    
    if (topic) {
      selectedQuestions = selectedQuestions.filter(q => q.topic.includes(topic));
    }

    const shuffled = shuffleArray(selectedQuestions).slice(0, QUIZ_LENGTH);
    
    setQuizState({
      active: true,
      questions: shuffled,
      currentIndex: 0,
      score: 0,
      answered: 0,
      mode,
      awaitingAnswer: true
    });

    setTimeout(() => {
      addMessage("bot", `Awesome! Let's dive in! 🚀\n\n${getQuestionMessage(shuffled[0], 0, 0)}`);
    }, 500);
  }, [addMessage, getQuestionMessage]);

  const moveToNextQuestion = useCallback((newScore: number, newAnswered: number) => {
    setTimeout(() => {
      if (newAnswered < quizState.questions.length) {
        const nextQ = quizState.questions[quizState.currentIndex + 1];
        addMessage("bot", getQuestionMessage(nextQ, newAnswered, newScore));
        setQuizState(prev => ({
          ...prev,
          currentIndex: prev.currentIndex + 1,
          score: newScore,
          answered: newAnswered,
          awaitingAnswer: true
        }));
      } else {
        // Quiz complete
        const percentage = (newScore / quizState.questions.length) * 100;
        let performance = "";
        let emoji = "";
        
        if (percentage >= 90) {
          performance = "Crypto Expert";
          emoji = "🏆";
        } else if (percentage >= 70) {
          performance = "Blockchain Scholar";
          emoji = "📚";
        } else if (percentage >= 50) {
          performance = "Getting There";
          emoji = "💪";
        } else {
          performance = "Keep Learning";
          emoji = "🌱";
        }

        addMessage("bot", `🎊 Quiz Complete!\n\nFinal Score: ${newScore}/${quizState.questions.length} (${percentage.toFixed(0)}%)\n\n${emoji} ${performance}!\n\nWant to try again? Type 'restart' or 'new quiz'!`);
        
        setQuizState(prev => ({
          ...prev,
          active: false,
          awaitingAnswer: false,
          score: newScore,
          answered: newAnswered
        }));
      }
    }, 2000);
  }, [quizState.questions, quizState.currentIndex, addMessage, getQuestionMessage]);

  const processAnswer = useCallback((userAnswer: string) => {
    const currentQ = quizState.questions[quizState.currentIndex];
    const isCorrect = checkAnswer(userAnswer, currentQ);
    const newScore = isCorrect ? quizState.score + 1 : quizState.score;
    const newAnswered = quizState.answered + 1;

    if (isCorrect) {
      const encouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      addMessage("bot", encouragement);
      
      const fact = FUN_FACTS[currentQ.correct];
      if (fact) {
        setTimeout(() => addMessage("bot", fact), 800);
      }
    } else {
      addMessage("bot", `❌ Not quite! The correct answer is: **${currentQ.correct}**`);
      
      const explanation = EXPLANATIONS[currentQ.correct];
      if (explanation) {
        setTimeout(() => addMessage("bot", `💡 ${explanation}`), 800);
      }
    }

    setQuizState(prev => ({
      ...prev,
      score: newScore,
      answered: newAnswered,
      awaitingAnswer: false
    }));

    moveToNextQuestion(newScore, newAnswered);
  }, [quizState, checkAnswer, addMessage, moveToNextQuestion]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    addMessage("user", input);
    const userInput = input.toLowerCase().trim();
    setInput("");

    // Handle quiz restart
    if ((userInput.includes("restart") || userInput.includes("new") || userInput.includes("again")) && !quizState.active) {
      setTimeout(() => {
        addMessage("bot", "Great! What would you like to do?\n\nA) Random 10-question quiz (Mixed difficulty)\nB) Practice by topic\nC) Choose difficulty level");
      }, 500);
      return;
    }

    // If quiz is active and awaiting answer
    if (quizState.active && quizState.awaitingAnswer) {
      processAnswer(input);
      return;
    }

    // Handle initial menu choices
    if (!quizState.active) {
      if (userInput === 'a' || userInput.includes("random") || userInput.includes("mixed")) {
        addMessage("bot", "Perfect! Starting a random mixed difficulty quiz! 🎲");
        startQuiz("random");
      } else if (userInput === 'b' || userInput.includes("topic")) {
        addMessage("bot", "Choose a topic:\n\nA) Bitcoin\nB) Ethereum\nC) Comparison\nD) General Blockchain Tech");
        setQuizState(prev => ({ ...prev, mode: "topic-select" }));
      } else if (userInput === 'c' || userInput.includes("difficulty")) {
        addMessage("bot", "Choose difficulty:\n\nA) Easy\nB) Medium\nC) Hard");
        setQuizState(prev => ({ ...prev, mode: "difficulty-select" }));
      } else if (quizState.mode === "topic-select") {
        const topics: Record<string, string> = {
          'a': 'Bitcoin',
          'b': 'Ethereum',
          'c': 'Comparison',
          'd': 'General'
        };
        const topic = topics[userInput] || userInput;
        addMessage("bot", `Great choice! Starting ${topic} quiz! 📖`);
        startQuiz("topic", null, topic);
      } else if (quizState.mode === "difficulty-select") {
        const difficulties: Record<string, string> = {
          'a': 'Easy',
          'b': 'Medium',
          'c': 'Hard'
        };
        const difficulty = difficulties[userInput] || userInput;
        addMessage("bot", `Alright! Starting ${difficulty} difficulty quiz! 💪`);
        startQuiz("difficulty", difficulty);
      } else {
        addMessage("bot", "I didn't quite get that! Please choose A, B, or C from the menu above. 😊");
      }
    }
  }, [input, addMessage, quizState, processAnswer, startQuiz]);

  const handleReset = useCallback(() => {
    setMessages([
      { 
        type: "bot", 
        text: "Hey there! 👋 Welcome to CryptoQuiz! Ready to test your crypto knowledge?",
        timestamp: Date.now()
      },
      {
        type: "bot",
        text: "What would you like to do?\n\nA) Random 10-question quiz (Mixed difficulty)\nB) Practice by topic\nC) Choose difficulty level",
        timestamp: Date.now() + 1
      }
    ]);
    setQuizState({
      active: false,
      questions: [],
      currentIndex: 0,
      score: 0,
      answered: 0,
      mode: null,
      awaitingAnswer: false
    });
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  }, [handleSend]);

  return (
    <Card className="glass border-primary/30 max-w-4xl mx-auto">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">CryptoQuiz AI Bot</h3>
              <p className="text-sm text-muted-foreground font-normal">Test your crypto knowledge</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={`${msg.timestamp}-${idx}`}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.type === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer..."
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Footer */}
        {quizState.active && (
          <div className="border-t border-white/10 px-6 py-3 bg-muted/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Question {quizState.answered + 1} of {quizState.questions.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gold" />
                <span>Score: {quizState.score}/{quizState.answered}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoQuizBot;