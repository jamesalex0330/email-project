const generateConfig = (url, accessToken) => {
  return {
    method: "get",
    url: url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  };
};

const postGenerateConfig = (url, accessToken, method = "post") => {
  return {
    url: url,
    method: "post",
    data: { "removeLabelIds": ["UNREAD"] },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    }
  };
}
module.exports = { generateConfig, postGenerateConfig };