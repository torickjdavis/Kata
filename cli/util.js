function fileTimestamp() {
  const now = new Date();
  now.setMilliseconds(0);
  return now.toISOString().replace('.000Z', '').replace(/[T:]/g, '_');
}

module.exports = { fileTimestamp };
