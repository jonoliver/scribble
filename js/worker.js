let words;

onmessage = (e) => {
  const { type } = e.data;
  if (type === "init"){
    words = e.data.words;
    return;
  }
  if (type === "calc"){
    const data = calculate(e.data.combo);
    postMessage(data);
    return;
  }
}

const isWord = w => words.includes(w);

const postIsWord = w => {
  const isaWord = isWord(w);
  if (isaWord) postMessage({ match: w });
  return isaWord;
}

function heapPermuations(arr)
{
  const permutations = [];

  function swap(a, b)
  {
    var tmp = arr[a];
    arr[a] = arr[b];
    arr[b] = tmp;
  }

  function generate(n) {
    if (n == 1) {
      permutations.push(arr.join(''));
    } else {
      for (var i = 0; i != n; ++i) {
        generate(n - 1);
        swap(n % 2 ? 0 : i, n - 1);
      }
    }
  }

  generate(arr.length);
  return permutations;
}

const unique = (value, index, self) => self.indexOf(value) === index;

const mapAlphabetic = (arr) => arr.reduce((obj, w) => {
  const key = w[0];
  if (!obj[key]){ obj[key] = []};
  obj[key].push(w);
  return obj;
} , {});

function allPerms(letters){
  const perms = heapPermuations(letters);
  let allPerms = []
  for (var i = 0; i < 6; i++) {
    const myPerms = perms.map(perm => perm.slice(0, perm.length - i))
    allPerms = allPerms.concat(myPerms)
  }
  return allPerms;
}


function calculate(letters){
  const alphaWords = mapAlphabetic(words);
  const perms = allPerms(letters).filter(unique);
  const alphaPerms = mapAlphabetic(perms);
  const keys = Object.keys(alphaPerms);
  return keys.reduce((arr, key) => {
    const thesePerms = alphaWords[key];
    const theseWords = alphaPerms[key];
    arr = arr.concat(thesePerms.filter(w => {
      const isMatch = theseWords.includes(w);
      if (isMatch) postMessage({ match: w });
      return isMatch;
    }));

    return arr;
  }, []);
}
