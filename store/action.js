const action = (small) => {
  // console.log(small, 'action called ');
  return {
    type: 'PULL_VIDEOS',
    data: small,
  };
};
