// Function to get or create a seed and store it in localStorage
function getOrCreateSeed(): number {
    const seedKey = "shuffleSeed";
    const storedSeed = localStorage.getItem(seedKey);
  
    if (storedSeed) {
      return parseInt(storedSeed, 10);
    }
  
    const newSeed = Math.floor(Math.random() * 1000000); // Generate a random seed
    localStorage.setItem(seedKey, newSeed.toString()); // Store the seed in localStorage
    return newSeed;
  }
  
  // Function to create a seeded random number generator
  function seededRandom(seed: number): () => number {
    return function () {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
  }
  
  // Function to shuffle an array using the seeded random number generator
  export function shuffleProjects<T>(array: T[]): T[] {
    const seed = getOrCreateSeed();
    const random = seededRandom(seed);
  
    return array
      .map((item) => ({ item, sortKey: random() }))
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ item }) => item);
  }