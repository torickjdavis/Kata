export const rootRoute = (req, res) => {
  res.json({
    name: 'Unix Epoch',
    timestamp: new Date(0),
    symbol: '⌚',
  });
};
