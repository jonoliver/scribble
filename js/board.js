const letters = {
  "A": { "points":  1, "tiles":  9 },
  "B": { "points":  3, "tiles":  2 },
  "C": { "points":  3, "tiles":  2 },
  "D": { "points":  2, "tiles":  4 },
  "E": { "points":  1, "tiles": 12 },
  "F": { "points":  4, "tiles":  2 },
  "G": { "points":  2, "tiles":  3 },
  "H": { "points":  4, "tiles":  2 },
  "I": { "points":  1, "tiles":  9 },
  "J": { "points":  8, "tiles":  1 },
  "K": { "points":  5, "tiles":  1 },
  "L": { "points":  1, "tiles":  4 },
  "M": { "points":  3, "tiles":  2 },
  "N": { "points":  1, "tiles":  6 },
  "O": { "points":  1, "tiles":  8 },
  "P": { "points":  3, "tiles":  2 },
  "Q": { "points": 10, "tiles":  1 },
  "R": { "points":  1, "tiles":  6 },
  "S": { "points":  1, "tiles":  4 },
  "T": { "points":  1, "tiles":  6 },
  "U": { "points":  1, "tiles":  4 },
  "V": { "points":  4, "tiles":  2 },
  "W": { "points":  4, "tiles":  2 },
  "X": { "points":  8, "tiles":  1 },
  "Y": { "points":  4, "tiles":  2 },
  "Z": { "points": 10, "tiles":  1 },
  // "blank": { "tiles": 2}
}

const random = (arr) => (arr)[Math.floor(Math.random() * arr.length)];

const tiles = Object.keys(letters)
.reduce((output, letter) => output.concat(
  new Array(letters[letter].tiles
  ).fill(letter)), [])

  const score = (word) => word.split('')
  .reduce((sum, letter) => sum + letters[letter].points, 0);

  // {letter: "X", points: 1}
  const getRandomLetters = () => new Array(7).fill('')
  .map((_, i) => {
    const key = random(tiles);
    const points = letters[key].points;
    return {
      id: i,
      letter: key.toUpperCase(),
      points,
    }
  })

  export {
    score,
    getRandomLetters,
  }

  // const letterWeightSum = Object.entries(letters)
  //   .map(l => l[1])
  //   .map(l => l.tiles)
  //   .reduce((sum, l) => sum + l, 0);
  //
  // const randomInt = (max) => Math.floor(Math.random() * Math.floor(max));
  //
  // const randomWeightedLetter = () => {
  //   // const keys = Object.keys(letters);
  //   let target = randomInt(letterWeightSum);
  //   // return keys.forEach(() => {})
  //   for (letter in letters) {
  //     const weight = letters[letter].tiles;
  //     if (target <= weight) { return letter; break; }
  //     target -= weight;
  //   }
  // }

  // console.log(new Array(7).fill('').map(randomWeightedLetter).map(l => l))
