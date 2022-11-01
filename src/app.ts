// Project Type
enum ProjectStatus {
  Active,
  Finished
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public peopleAmount: number,
    public status: ProjectStatus,
  ) {}
}

// Project state management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFunction: Listener<T>) {
    this.listeners.push(listenerFunction);
  }
}

class ProjectState extends State<Project> {
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
    this.listeners.forEach(listenerFunction => listenerFunction(this.projects.slice()));
  }
}
const projectState = ProjectState.getInstance();

// Validation
interface IValidationText {
  value: string;
  required?: boolean;
  minLength: number;
  maxLength: number;
}

function isValidInput(validationInput: IValidationText) {
  const inputLength = validationInput.value.trim().length;
  const { required, minLength, maxLength } = validationInput;

  if (!required) return true;
  if (!inputLength) return false;
  if (inputLength < minLength || inputLength > maxLength) return false;
  return true;
}

// decorators
function autoBind(
  _target: any,
  _methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFunction = originalMethod.bind(this);
      return boundFunction;
    }
  };
  return adjustedDescriptor;
};

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    isToInsertAtStart: boolean,
    newElementId?: string,
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
  
    this.renderDOM(isToInsertAtStart);
  }

  private renderDOM(isToInsertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      isToInsertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract configure():void;
  abstract renderDOMContent(): void;
}

//ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project;

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderDOMContent();
  }

  configure() {}
  renderDOMContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.project.peopleAmount.toString();
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

//ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement>{
  assignedProjects: Project[];

  constructor(private type: 'Active' | 'Finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];
  
    this.configure();
    this.renderDOMContent();
  }

  configure() {
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

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleAmountInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');
  
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleAmountInputElement = this.element.querySelector('#people') as HTMLInputElement;
  
    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }
  renderDOMContent() {}

  private gatherUserInput():[string, string, number] | void {
    const titleValue = this.titleInputElement.value;
    const descriptionValue = this.descriptionInputElement.value;
    const peopleAmountValue = Number(this.peopleAmountInputElement.value);

    const titleValidationRequirements: IValidationText = {
      value: titleValue,
      required: true,
      minLength: 5,
      maxLength: 50,
    };
    const descriptionValidationRequirements: IValidationText = {
      value: descriptionValue,
      required: true,
      minLength: 10,
      maxLength: 50,
    };

    if (
      !isValidInput(titleValidationRequirements) ||
      !isValidInput(descriptionValidationRequirements) ||
      peopleAmountValue < 1
    ) {
      alert('Please fill out all the inputs');
      return;
    } else {
      return [titleValue, descriptionValue, peopleAmountValue];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleAmountInputElement.value = '';
  }

  @autoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (userInput) {
      const [titleValue, descriptionValue, peopleAmountValue] = userInput;
      projectState.addProject(titleValue, descriptionValue, peopleAmountValue);
      this.clearInputs();
    }
  }
}
  
new ProjectInput();
new ProjectList('Active');
new ProjectList('Finished');
