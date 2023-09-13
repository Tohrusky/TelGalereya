export function shuffleArray(arr: Array<any>) {
  let i = arr.length
  while (--i) {
    let j = Math.floor(Math.random() * i)
    ;[arr[j], arr[i]] = [arr[i], arr[j]]
  }
}
