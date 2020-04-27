export default function (text, query) {
  if (!query) {
    return text;
  }
  const regex = new RegExp(query.trim(), 'ig');
  return text.replace(regex, found => `<span class='highlight'>${found}</span>`);
}
