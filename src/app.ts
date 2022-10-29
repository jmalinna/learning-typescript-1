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

// ProjectInput Class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    formElement: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleAmountInputElement: HTMLInputElement;
  
    constructor() {
      this.templateElement = document.getElementById(
        'project-input'
      )! as HTMLTemplateElement;
      this.hostElement = document.getElementById('app')! as HTMLDivElement;
  
      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      this.formElement = importedNode.firstElementChild as HTMLFormElement;
      this.formElement.id = 'user-input';

      this.titleInputElement = this.formElement.querySelector('#title') as HTMLInputElement;
      this.descriptionInputElement = this.formElement.querySelector('#description') as HTMLInputElement;
      this.peopleAmountInputElement = this.formElement.querySelector('#people') as HTMLInputElement;

      this.configure();
      this.attach();
    }
  
    @autoBind
    private submitHandler(event: Event) {
      event.preventDefault();
      console.log(this.titleInputElement.value);
    }
  
    private configure() {
      this.formElement.addEventListener('submit', this.submitHandler);
    }
  
    private attach() {
      this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
    }
  }
  
new ProjectInput();
