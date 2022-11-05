import { Component } from './base-component.js';
import { IValidationText, isValidInput } from '../utils/validation.js';
import { autoBind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';


export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
