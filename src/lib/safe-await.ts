export default function SafeAwait(promise: Promise<any>) {
  return promise.then(data => {
      return [undefined, data];
  })
  .catch(err => [err]);
}