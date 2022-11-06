import { DragTarget } from '../models/drag-drop';
import { Component } from './base-component';
import { autoBind } from '../decorators/autobind';
import { Project, ProjectStatus } from '../models/project';
import { projectState } from '../state/project-state';
import { ProjectItem } from './project-item';

export class ProjectList extends Component<HTMLDivElement, HTMLElement>
implements DragTarget {
  assignedProjects: Project[];
  
  constructor(private type: 'Active' | 'Finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];
  
    this.configure();
    this.renderDOMContent();
  }
  
  @autoBind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
    }
    const listElement = this.element.querySelector('ul')!;
    listElement.classList.add('droppable');
  }
  
  @autoBind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      projectId,
      this.type === 'Active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }
  
  @autoBind
  dragLeaveHandler(_: DragEvent): void {
    const listElement = this.element.querySelector('ul')!;
    listElement.classList.remove('droppable');
  }
  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);
  
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        if (this.type === 'Active') return project.status === ProjectStatus.Active;
        return project.status === ProjectStatus.Finished;
      });
  
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }
  
  renderDOMContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type + ' projects';
  }
  
  private renderProjects() {
    const listElement = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
    listElement.innerHTML = '';
  
    this.assignedProjects.forEach((project) => {
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    });
  }
}