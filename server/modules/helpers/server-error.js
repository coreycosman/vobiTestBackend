module.exports = (res, id) => {
  return res.status(500).json({
    serverErrMessage: "server error: please try again later"
  });
};
