/// <reference path="base-component.ts" />

namespace App {
  export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
    private project: Project;
    
    get personsText() {
      if (this.project.peopleAmount === 1) {
        return '1 person';
      } else {
        return `${this.project.peopleAmount} persons`;
      }
    }
    
    constructor(hostId: string, project: Project) {
      super('single-project', hostId, false, project.id);
      this.project = project;
    
      this.configure();
      this.renderDOMContent();
    }
    
    @autoBind
    dragStartHandler(event: DragEvent): void {
      event.dataTransfer!.setData('text/plain', this.project.id);
      event.dataTransfer!.effectAllowed = 'move';
    }
    
    dragEndHandler(_: DragEvent): void {}
    
    configure() {
      this.element.addEventListener('dragstart', this.dragStartHandler);
      this.element.addEventListener('dragend', this.dragEndHandler);
    }
    
    renderDOMContent() {
      this.element.querySelector('h2')!.textContent = this.project.title;
      this.element.querySelector('h3')!.textContent = this.personsText + ' assigned';
      this.element.querySelector('p')!.textContent = this.project.description;
    }
  }
}