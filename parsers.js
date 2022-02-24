module.exports = {
  autocomplete: (value, getVal) => {
    if (!value) {
      return undefined;
    }
    if (typeof (value) === "object") {
      return (getVal ? value.value : value.id) || value;
    }
    return value;
  },
  string: (value) => {
    if (!value) {
      return undefined;
    }
    if (typeof (value) === "string") {
      return value.trim();
    }
    throw new Error(`Value ${value} is not a valid string`);
  },
};
