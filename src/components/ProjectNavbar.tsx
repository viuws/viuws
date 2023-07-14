interface ProjectMenuProps {
  projectName: string;
  onProjectNameChange: (projectName: string) => void;
}

function ProjectNavbar(props: ProjectMenuProps) {
  return (
    <div className="navbar space-x-2">
      <div className="navbar-start">
        <input
          className="input input-ghost font-bold"
          value={props.projectName}
          onChange={(e) => props.onProjectNameChange(e.target.value)}
        />
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-end"></div>
    </div>
  );
}

export default ProjectNavbar;
