import * as React from "react";
import * as ReactDOM from "react-dom";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { QuestionInputStack } from "./Components/QuestionInputStack";

export class QuestionInputControl
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _container: HTMLDivElement;
  private _webAPI: ComponentFramework.WebApi;
  private _questions: any[] = [];

  constructor() {
    this._container = document.createElement("div");
  }

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._container = container;
    this._webAPI = context.webAPI;

    this.fetchAndRenderDynamicQuestions(context)
      .then(() => {
        document.body.appendChild(this._container);
      })
      .catch((error) => {
        console.error("An error occurred during initialization:", error);
      });
  }

  private async fetchAndRenderDynamicQuestions(
    context: ComponentFramework.Context<IInputs>
  ): Promise<void> {
    try {
      const fetchXml = `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
                <entity name="lfs_question">
                    <attribute name="isinputrequired" />
                    <attribute name="questiondatatype" />
                    <attribute name="name" />
                </entity>
            </fetch>`;

      const response = await this._webAPI.retrieveMultipleRecords(
        "lfs_question",
        `?fetchXml=${encodeURIComponent(fetchXml)}`
      );

      if (response && response.entities) {
        this._questions = response.entities;
        console.log(response);
        this.renderDynamicQuestions(context);
      } else {
        console.error("Failed to fetch dynamic questions.");
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching dynamic questions:",
        error
      );
    }
  }

  private renderDynamicQuestions(
    context: ComponentFramework.Context<IInputs>
  ): void {
    ReactDOM.render(
      React.createElement(QuestionInputStack, {
        questions: this._questions,
        context,
        title: "Your Title",
      }),
      this._container
    );
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    // Add code to update control view
  }

  public getOutputs(): IOutputs {
    const response: any = {};
    const inputElements = this._container.querySelectorAll("input, select");

    inputElements.forEach((input) => {
      const questionIndex = input.getAttribute("data-question-index");
      if (
        questionIndex !== null &&
        input.tagName === "INPUT" &&
        (input as HTMLInputElement).type !== "checkbox"
      ) {
        response[`Question${Number(questionIndex)}`] = (
          input as HTMLInputElement
        ).value;
      } else if (
        questionIndex !== null &&
        input.tagName === "INPUT" &&
        (input as HTMLInputElement).type === "checkbox"
      ) {
        response[`Question${Number(questionIndex)}`] = (
          input as HTMLInputElement
        ).checked;
      } else if (questionIndex !== null && input.tagName === "SELECT") {
        response[`Question${Number(questionIndex)}`] = (
          input as HTMLSelectElement
        ).value;
      }
    });

    return response;
  }

  public destroy(): void {}
}
