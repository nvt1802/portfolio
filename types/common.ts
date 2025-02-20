export interface IPath {
  name: string;
  path: string;
}

export interface IExperience {
  icon: string;
  name: string;
}

export interface IProject {
  name: string;
  thumbnail: string;
}

export interface IProjectExperience {
  icon?: string;
  projectName: string;
  date: string;
  description: string;
}
