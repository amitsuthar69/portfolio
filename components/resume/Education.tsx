const Education = ({ eduInfo }: any) => {
  return (
    <div className="pb-2">
      <p className="text-xl">Education</p>
      <div className="underLine" />
      <div className="flex flex-col gap-2">
        {eduInfo.map((edu: any) =>
          <div className="pl-4">
            <div className="flex justify-between">
              <div className="font-bold">
                {edu.institueName}
              </div>
              <div>
                {edu.score}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm">
                {edu.courseName}
              </div>
              <div className="text-sm">
                {edu.time}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Education;
