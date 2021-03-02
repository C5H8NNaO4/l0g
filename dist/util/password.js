const {
  STR_MASK_PASS
} = require("../consts");

const {
  Format
} = require("../symbols");

const Password = str => {
  const showClearText = options => !Password.isMasked() && Password.hasTransport(options);

  return {
    value: str,
    [Password.symbol]: options => showClearText(options) ? str : STR_MASK_PASS
  };
};

Password.hasTransport = ({
  transport
}) => {
  return [Password.transports].flat().filter(Boolean).some(cls => transport instanceof cls);
};

Password.isMasked = () => {
  return Password.envKeyShow && !process.env[Password.envKeyShow];
};

Password.symbol = Format;
Password.envKeyShow = 'LOG_PASS_SHOW';
module.exports = {
  Password
};