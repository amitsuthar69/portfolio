const Skills = ({ skills }: any) => {
  return (
    <div>
      <p className="text-xl">Technical Skills</p>
      <div className="underLine" />
      <div className="pl-4">
        <div className="flex flex-wrap items-center gap-3 font-bold">
          {Object.keys(skills)[0]}:
          {skills.languages.map((language: string | undefined) => (
            <div className="flex gap-3 text-sm font-normal">{language}</div>
          ))}
        </div>
        <div className="flex items-center gap-3 font-bold">
          {Object.keys(skills)[1]}:
          {skills.frameworks.map((language: string | undefined) => (
            <div className="flex gap-3 text-sm font-normal">{language}</div>
          ))}
        </div>
        <div className="flex items-center gap-3 font-bold">
          {Object.keys(skills)[3]}:
          {skills.tools.map((tool: string | undefined) => (
            <div className="flex gap-3 text-sm font-normal">{tool}</div>
          ))}
        </div>
        <div className="flex items-center gap-3 font-bold">
          {Object.keys(skills)[2]}:
          {skills.databases.map((db: string | undefined) => (
            <div className="flex gap-3 text-sm font-normal">{db}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
