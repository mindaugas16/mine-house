export default function join(values, limit) {
  const items = [...values];
  if (items.length > limit) {
    return items.splice(0, limit).join(', ').concat('...');
  }
  return items.join(', ');
}
