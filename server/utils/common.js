const snakeToCamelCase = (str) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );

const capitalizeString = (string) => {
  if (typeof string !== "string" || !string.length) return "";

  return string[0].toUpperCase() + string.slice(1);
};

const getModalOverflow = () => {
  const isScrollBarPresent =
    document.body.clientWidth < window.visualViewport.width;

  return isScrollBarPresent ? "overflow-y-scroll" : "overflow-y-auto";
};

module.exports = {
  snakeToCamelCase,
  capitalizeString,
  getModalOverflow,
};
