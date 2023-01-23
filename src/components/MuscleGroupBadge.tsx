const MuscleGroup = ({
  id,
  name,
  isActive,
  toggleActive,
}: {
  id: string;
  name: string;
  isActive: boolean;
  toggleActive?: (id: string) => void;
}) => {
  return (
    <div
      {...(toggleActive && {
        onClick: () => toggleActive(id),
      })}
      className={`
      flex items-center justify-center rounded-full border  px-4 py-1 text-xs ${
        isActive ? "bg-gray-800 text-white" : "border-gray-800"
      }
      `}
    >
      {name}
    </div>
  );
};

export default MuscleGroup;
