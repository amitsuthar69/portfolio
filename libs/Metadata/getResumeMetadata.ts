import fs from "fs";

const getResumeMetadata = () => {
  return fs.readFileSync("content/resume.json", "utf8");
};

export default getResumeMetadata;
