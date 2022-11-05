import { Project, ProjectStatus } from '../models/project.js';

type Listener<T> = (items: T[]) => void;
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFunction: Listener<T>) {
    this.listeners.push(listenerFunction);
  }
}

export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) return this.instance;
  
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, peopleAmount: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      peopleAmount,
      ProjectStatus.Active,
    );

    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((project) => project.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    this.listeners.forEach(listenerFunction => listenerFunction(this.projects.slice()));
  }
}
export const projectState = ProjectState.getInstance();
