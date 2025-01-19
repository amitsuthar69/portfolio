import { FaGithub } from "react-icons/fa";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

const Projects = ({ projectInfo }: any) => {
  return (
    <div className="pb-2">
      <p className="text-xl">Projects</p>
      <div className="underLine" />
      <div className="flex flex-col gap-2">
        {projectInfo.map((project: any) =>
          <div className="pl-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-3 font-bold">
                <a>
                  {project.projectName}
                </a>
                <a href={project.links[0]} target="_blank">
                  <FaGithub />
                </a>
                <a href={project.links[1]} target="_blank">
                  <BsArrowUpRightCircleFill />
                </a>
              </div>
              <div>
                {project.time}
              </div>
            </div>
            <div>
              {project.projectStack.map((tech: string | undefined, i: number) =>
                <span className="text-sm">
                  {tech}
                  {i === project.projectStack.length - 1 ? "" : " | "}
                </span>
              )}
            </div>
            {project.points.map((point: any) =>
              <ul className="pl-4">
                {
                  <li className="text-sm list-disc">
                    {point}
                  </li>
                }
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
