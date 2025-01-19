import { FaGithubSquare, FaLinkedin, FaTwitterSquare } from "react-icons/fa";
const SocialHome = () => {
  return (
    <div className="flex gap-5 py-2">
      <a href="https://github.com/amitsuthar69" aria-label="twitter">
        <FaGithubSquare size={30} className="cursor-pointer" />
      </a>
      <a href="https://linkedin.com/in/amitsuthar69/" aria-label="linkedin">
        <FaLinkedin size={30} className="cursor-pointer" />
      </a>
      <a href="https://twitter.com/notamitsuthar" aria-label="github">
        <FaTwitterSquare size={30} className="cursor-pointer" />
      </a>
    </div>
  );
};

export default SocialHome;
