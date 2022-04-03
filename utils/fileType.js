const { nanoid } = require("nanoid");

const regexExtFile = /(?:\.([^.]+))?$/;

const exceptFileType = [
  "application/x-msdownload",
  "application/x-exe",
  "application/x-dosexec",
  "application/octet-stream",
  "application/x-msdos-program",
];

module.exports.isDenyMimeType = (fileType) => {
  return exceptFileType.includes(fileType);
};

module.exports.randomFileName = (fileName) => {
  const execRegex = regexExtFile.exec(fileName);
  const originalFileName = fileName.substring(0, execRegex.index);
  return `${originalFileName}-${nanoid(10)}${execRegex[0]}`;
};
