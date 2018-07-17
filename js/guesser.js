export default (difficulty, list) => {
  if (list.length === 0) return null;

  const createGroupedArray = function(arr, chunkSize) {
    let groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
  }

  const chunkSize = Math.ceil(list.length / 3);

  const random = (arr) => (arr)[Math.floor(Math.random() * arr.length)];
  const groupedArray = createGroupedArray(list, chunkSize)[difficulty];
  return random(groupedArray);
};
