export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionType: 'Multiple Choice' | 'True/False' | 'Fill-in-Blank';
  question: string;
  correctAnswer: string;
  incorrectOption1?: string;
  incorrectOption2?: string;
  incorrectOption3?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "BTC-001",
    topic: "Bitcoin Basics",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "Who is the pseudonymous creator of Bitcoin?",
    correctAnswer: "Satoshi Nakamoto",
    incorrectOption1: "Vitalik Buterin",
    incorrectOption2: "Hal Finney",
    incorrectOption3: "Nick Szabo"
  },
  {
    id: "BTC-002",
    topic: "Bitcoin Basics",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "What is the total maximum supply of Bitcoin?",
    correctAnswer: "21 million coins",
    incorrectOption1: "Unlimited",
    incorrectOption2: "100 million coins",
    incorrectOption3: "42 million coins"
  },
  {
    id: "BTC-003",
    topic: "Bitcoin Tech",
    difficulty: "Easy",
    questionType: "True/False",
    question: "Bitcoin's initial consensus mechanism is Proof-of-Stake (PoS).",
    correctAnswer: "False (It is Proof-of-Work)"
  },
  {
    id: "BTC-004",
    topic: "Bitcoin Tech",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "The process of creating new bitcoins and validating transactions is called:",
    correctAnswer: "Mining",
    incorrectOption1: "Staking",
    incorrectOption2: "Forging",
    incorrectOption3: "Burning"
  },
  {
    id: "BTC-005",
    topic: "Bitcoin Tech",
    difficulty: "Easy",
    questionType: "Fill-in-Blank",
    question: "The smallest unit of Bitcoin is called a _.",
    correctAnswer: "Satoshi",
    incorrectOption1: "Wei",
    incorrectOption2: "Finney",
    incorrectOption3: "Gwei"
  },
  {
    id: "BTC-006",
    topic: "Bitcoin Basics",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "In what year was the Bitcoin Whitepaper published?",
    correctAnswer: "2008",
    incorrectOption1: "2009",
    incorrectOption2: "2013",
    incorrectOption3: "2005"
  },
  {
    id: "BTC-007",
    topic: "Bitcoin Tech",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "Bitcoin transactions are secured using which cryptographic hash function?",
    correctAnswer: "SHA-256",
    incorrectOption1: "Keccak-256",
    incorrectOption2: "Scrypt",
    incorrectOption3: "Ethash"
  },
  {
    id: "BTC-008",
    topic: "Bitcoin Concept",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "What is the primary purpose of Bitcoin?",
    correctAnswer: "Store of value and digital currency",
    incorrectOption1: "Platform for smart contracts",
    incorrectOption2: "Enabling DeFi lending",
    incorrectOption3: "Creating NFTs"
  },
  {
    id: "BTC-009",
    topic: "Bitcoin Tech",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "Approximately how often is a new block typically added to the Bitcoin blockchain?",
    correctAnswer: "Every 10 minutes",
    incorrectOption1: "Every 12 seconds",
    incorrectOption2: "Every 1 minute",
    incorrectOption3: "Every 30 minutes"
  },
  {
    id: "BTC-010",
    topic: "Bitcoin Concept",
    difficulty: "Medium",
    questionType: "True/False",
    question: "Bitcoin is controlled by a central bank or financial authority.",
    correctAnswer: "False"
  },
  {
    id: "BTC-011",
    topic: "Bitcoin Tech",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "The scheduled reduction in the reward for mining new blocks is called a:",
    correctAnswer: "Halving",
    incorrectOption1: "Merge",
    incorrectOption2: "Fork",
    incorrectOption3: "Split"
  },
  {
    id: "BTC-012",
    topic: "Bitcoin Tech",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "What is the very first block of the Bitcoin blockchain called?",
    correctAnswer: "Genesis Block",
    incorrectOption1: "Alpha Block",
    incorrectOption2: "First Block",
    incorrectOption3: "Root Block"
  },
  {
    id: "BTC-013",
    topic: "Bitcoin Concept",
    difficulty: "Hard",
    questionType: "Multiple Choice",
    question: "Which scaling solution aims to enable faster and cheaper Bitcoin transactions off-chain?",
    correctAnswer: "Lightning Network",
    incorrectOption1: "Polkadot",
    incorrectOption2: "Arbitrum",
    incorrectOption3: "Polygon"
  },
  {
    id: "BTC-014",
    topic: "Bitcoin Tech",
    difficulty: "Hard",
    questionType: "Multiple Choice",
    question: "What does UTXO stand for in the context of Bitcoin?",
    correctAnswer: "Unspent Transaction Output",
    incorrectOption1: "Universal Transaction Object",
    incorrectOption2: "User Trade Exchange Option",
    incorrectOption3: "Unconfirmed Token Exchange"
  },
  {
    id: "BTC-015",
    topic: "Bitcoin Concept",
    difficulty: "Hard",
    questionType: "Multiple Choice",
    question: "Which event caused a permanent split (hard fork) in Bitcoin, leading to the creation of Bitcoin Cash (BCH)?",
    correctAnswer: "The Block Size Debate",
    incorrectOption1: "The DAO Hack",
    incorrectOption2: "The Merge",
    incorrectOption3: "The Halving of 2020"
  },
  {
    id: "ETH-016",
    topic: "Ethereum Basics",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "Who is a co-founder of the Ethereum network?",
    correctAnswer: "Vitalik Buterin",
    incorrectOption1: "Satoshi Nakamoto",
    incorrectOption2: "Jamie Dimon",
    incorrectOption3: "Charlie Lee"
  },
  {
    id: "ETH-017",
    topic: "Ethereum Basics",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "What is the native cryptocurrency used on the Ethereum network?",
    correctAnswer: "Ether (ETH)",
    incorrectOption1: "Ethereum Coin (EC)",
    incorrectOption2: "Gas",
    incorrectOption3: "Bitcoin"
  },
  {
    id: "ETH-018",
    topic: "Ethereum Tech",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "What is the name of the software that executes code on the Ethereum network?",
    correctAnswer: "Ethereum Virtual Machine (EVM)",
    incorrectOption1: "EV-Node",
    incorrectOption2: "Ether Processor",
    incorrectOption3: "Crypto-OS"
  },
  {
    id: "ETH-019",
    topic: "Ethereum Tech",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "What is a self-executing agreement with terms written directly into code, central to Ethereum?",
    correctAnswer: "Smart Contract",
    incorrectOption1: "DApp",
    incorrectOption2: "Whitepaper",
    incorrectOption3: "Oracle"
  },
  {
    id: "ETH-020",
    topic: "Ethereum Tech",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "What is the fee paid to execute transactions or smart contracts on the Ethereum network called?",
    correctAnswer: "Gas",
    incorrectOption1: "Fuel",
    incorrectOption2: "Transaction Fee",
    incorrectOption3: "Mining Reward"
  },
  {
    id: "ETH-021",
    topic: "Ethereum Basics",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "The unit of gas price, often used for setting transaction fees, is measured in:",
    correctAnswer: "Gwei",
    incorrectOption1: "Satoshi",
    incorrectOption2: "ETH",
    incorrectOption3: "Dollar"
  },
  {
    id: "ETH-022",
    topic: "Ethereum Tech",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "What consensus mechanism does Ethereum use after its 2022 major upgrade?",
    correctAnswer: "Proof-of-Stake (PoS)",
    incorrectOption1: "Proof-of-Work (PoW)",
    incorrectOption2: "Delegated Proof-of-Stake",
    incorrectOption3: "Proof-of-Authority"
  },
  {
    id: "ETH-023",
    topic: "Ethereum Tech",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "What was the name of the 2022 event where Ethereum switched its consensus mechanism?",
    correctAnswer: "The Merge",
    incorrectOption1: "The Shard",
    incorrectOption2: "The Fork",
    incorrectOption3: "The Upgrade"
  },
  {
    id: "ETH-024",
    topic: "Ethereum Tech",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "ERC-20 is a technical standard used for what on the Ethereum network?",
    correctAnswer: "Fungible tokens",
    incorrectOption1: "Non-Fungible Tokens (NFTs)",
    incorrectOption2: "Mining hardware",
    incorrectOption3: "Validator staking"
  },
  {
    id: "ETH-025",
    topic: "Ethereum Concept",
    difficulty: "Medium",
    questionType: "True/False",
    question: "Ethereum's blockchain supports Decentralized Applications (dApps).",
    correctAnswer: "True"
  },
  {
    id: "ETH-026",
    topic: "Ethereum Tech",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "What is the term for a blockchain-based organization governed by code and community voting?",
    correctAnswer: "DAO (Decentralized Autonomous Organization)",
    incorrectOption1: "dApp",
    incorrectOption2: "NFT",
    incorrectOption3: "PoS"
  },
  {
    id: "ETH-027",
    topic: "Ethereum Tech",
    difficulty: "Hard",
    questionType: "Multiple Choice",
    question: "What is the term for the future upgrade designed to improve Ethereum's scalability by splitting the blockchain into multiple chains?",
    correctAnswer: "Sharding",
    incorrectOption1: "Merging",
    incorrectOption2: "Splitting",
    incorrectOption3: "Halving"
  },
  {
    id: "ETH-028",
    topic: "Ethereum Tech",
    difficulty: "Hard",
    questionType: "Multiple Choice",
    question: "The burning of a base transaction fee on Ethereum, introduced by EIP-1559, is meant to:",
    correctAnswer: "Reduce supply and stabilize gas prices",
    incorrectOption1: "Increase the mining reward",
    incorrectOption2: "Speed up block time",
    incorrectOption3: "Increase block size"
  },
  {
    id: "ETH-029",
    topic: "Ethereum Basics",
    difficulty: "Hard",
    questionType: "Multiple Choice",
    question: "What is the name of the test environment (testnet) commonly used by Ethereum developers?",
    correctAnswer: "Goerli (or Sepolia)",
    incorrectOption1: "Mainnet",
    incorrectOption2: "Satoshi Test",
    incorrectOption3: "Bitcoin Testnet"
  },
  {
    id: "ETH-030",
    topic: "Ethereum Tech",
    difficulty: "Hard",
    questionType: "True/False",
    question: "Ethereum has a hard, fixed maximum supply cap of 21 million ETH.",
    correctAnswer: "False (Supply is often considered elastic/deflationary, not fixed cap)"
  },
  {
    id: "COMP-031",
    topic: "Comparison",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "Which of the two is often referred to as \"Digital Gold\"?",
    correctAnswer: "Bitcoin",
    incorrectOption1: "Ethereum"
  },
  {
    id: "COMP-032",
    topic: "Comparison",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "Which cryptocurrency is the largest by market capitalization (historically)?",
    correctAnswer: "Bitcoin",
    incorrectOption1: "Ethereum"
  },
  {
    id: "COMP-033",
    topic: "Comparison",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "The key difference in their primary functions is:",
    correctAnswer: "BTC is money; ETH is a programmable platform",
    incorrectOption1: "BTC uses PoS; ETH uses PoW",
    incorrectOption2: "BTC has smart contracts; ETH does not",
    incorrectOption3: "BTC is centralized; ETH is decentralized"
  },
  {
    id: "COMP-034",
    topic: "Comparison",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "Which network typically has faster transaction confirmation times (seconds vs. minutes)?",
    correctAnswer: "Ethereum",
    incorrectOption1: "Bitcoin"
  },
  {
    id: "COMP-035",
    topic: "Comparison",
    difficulty: "Medium",
    questionType: "True/False",
    question: "Both Bitcoin and Ethereum are decentralized.",
    correctAnswer: "True"
  },
  {
    id: "COMP-036",
    topic: "Comparison",
    difficulty: "Hard",
    questionType: "Multiple Choice",
    question: "The initial design of Bitcoin's code is often described as being:",
    correctAnswer: "Not Turing Complete",
    incorrectOption1: "Turing Complete",
    incorrectOption2: "PoS Ready",
    incorrectOption3: "Sharded"
  },
  {
    id: "TECH-037",
    topic: "General Tech",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "What is a digital ledger of transactions duplicated and distributed across the entire network of computer systems?",
    correctAnswer: "Blockchain",
    incorrectOption1: "Bitcoin",
    incorrectOption2: "Hard Wallet",
    incorrectOption3: "Exchange"
  },
  {
    id: "TECH-038",
    topic: "General Tech",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "What is the secret code that gives you ownership of your cryptocurrency?",
    correctAnswer: "Private Key",
    incorrectOption1: "Public Key",
    incorrectOption2: "Wallet Address",
    incorrectOption3: "Username"
  },
  {
    id: "TECH-039",
    topic: "General Tech",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "A wallet that is connected to the internet is generally referred to as a:",
    correctAnswer: "Hot Wallet",
    incorrectOption1: "Cold Wallet",
    incorrectOption2: "Hardware Wallet",
    incorrectOption3: "Paper Wallet"
  },
  {
    id: "TECH-040",
    topic: "General Tech",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "What concept means that once data is recorded on the blockchain, it cannot be altered?",
    correctAnswer: "Immutability",
    incorrectOption1: "Decentralization",
    incorrectOption2: "Transparency",
    incorrectOption3: "Tokenization"
  },
  {
    id: "TECH-041",
    topic: "General Tech",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "Which type of wallet is considered the most secure for long-term storage of large amounts of crypto?",
    correctAnswer: "Cold Storage (Hardware Wallet)",
    incorrectOption1: "Exchange Wallet",
    incorrectOption2: "Mobile Wallet",
    incorrectOption3: "Hot Wallet"
  },
  {
    id: "TECH-042",
    topic: "General Tech",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "What is the term for a chronological log file that contains all recorded transactions?",
    correctAnswer: "Ledger",
    incorrectOption1: "Block",
    incorrectOption2: "Key",
    incorrectOption3: "Hash"
  },
  {
    id: "TECH-043",
    topic: "General Tech",
    difficulty: "Hard",
    questionType: "Multiple Choice",
    question: "What is the goal of a 51% attack on a Proof-of-Work network?",
    correctAnswer: "To reverse completed transactions",
    incorrectOption1: "To steal a private key",
    incorrectOption2: "To increase the block reward",
    incorrectOption3: "To make a network switch to PoS"
  },
  {
    id: "TECH-044",
    topic: "General Tech",
    difficulty: "Hard",
    questionType: "Multiple Choice",
    question: "A situation where two versions of the blockchain exist simultaneously due to a change in protocol is called a:",
    correctAnswer: "Fork",
    incorrectOption1: "Merge",
    incorrectOption2: "Split",
    incorrectOption3: "Halving"
  },
  {
    id: "ETH-045",
    topic: "Ethereum Tech",
    difficulty: "Hard",
    questionType: "Multiple Choice",
    question: "What is the standard for Non-Fungible Tokens (NFTs) on Ethereum?",
    correctAnswer: "ERC-721",
    incorrectOption1: "ERC-20",
    incorrectOption2: "ERC-1155",
    incorrectOption3: "ERC-1337"
  },
  {
    id: "BTC-046",
    topic: "Bitcoin Concept",
    difficulty: "Medium",
    questionType: "True/False",
    question: "Bitcoin is designed to be highly inflationary to encourage spending.",
    correctAnswer: "False (It is designed to be deflationary/disinflationary)"
  },
  {
    id: "ETH-047",
    topic: "Ethereum Basics",
    difficulty: "Medium",
    questionType: "Multiple Choice",
    question: "When did the Ethereum network officially launch?",
    correctAnswer: "2015",
    incorrectOption1: "2009",
    incorrectOption2: "2013",
    incorrectOption3: "2018"
  },
  {
    id: "TECH-048",
    topic: "General Tech",
    difficulty: "Easy",
    questionType: "Multiple Choice",
    question: "What does P2P stand for in the context of cryptocurrency networks?",
    correctAnswer: "Peer-to-Peer",
    incorrectOption1: "Private-to-Public",
    incorrectOption2: "Processor-to-Processor",
    incorrectOption3: "Payment-to-Protocol"
  },
  {
    id: "COMP-049",
    topic: "Comparison",
    difficulty: "Hard",
    questionType: "Multiple Choice",
    question: "Post-Merge, who are the individuals responsible for validating new blocks on Ethereum?",
    correctAnswer: "Validators",
    incorrectOption1: "Miners",
    incorrectOption2: "Halvers",
    incorrectOption3: "Stakers"
  },
  {
    id: "COMP-050",
    topic: "Comparison",
    difficulty: "Hard",
    questionType: "Multiple Choice",
    question: "Which term is uniquely associated with Ethereum's transactional model, but not with Bitcoin's?",
    correctAnswer: "Account Abstraction",
    incorrectOption1: "Proof-of-Work",
    incorrectOption2: "Public Key",
    incorrectOption3: "Block Reward"
  }
];

export const getQuestionsByTopic = (topic: string) => {
  const topicMap: { [key: string]: string[] } = {
    'Bitcoin': ['Bitcoin Basics', 'Bitcoin Tech', 'Bitcoin Concept'],
    'Ethereum': ['Ethereum Basics', 'Ethereum Tech', 'Ethereum Concept'],
    'Comparison': ['Comparison'],
    'General Tech': ['General Tech']
  };
  
  const topics = topicMap[topic] || [];
  return quizQuestions.filter(q => topics.includes(q.topic));
};

export const getQuestionsByDifficulty = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
  return quizQuestions.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (count: number = 10) => {
  const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};