const Experience = ({ expInfo }: any) => {
  return (
    <div className="pb-2">
      <p className="text-xl">Experience</p>
      <div className="underLine" />
      <div className="flex flex-col gap-2">
        {expInfo.map((edu: any) =>
          <div className="pl-4">
            <div className="flex flex-wrap justify-between">
              <div className="font-bold">
                {edu.position}
              </div>
              <div>
                {edu.time}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm">
                {edu.companyName}
              </div>
              <div className="text-sm">
                {edu.type}
              </div>
            </div>
            {edu.points.map((point: any) =>
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

export default Experience;
