import { Feedback, FeedbackPosition, FeedbackType } from "nativescript-feedback";
import { Color } from "tns-core-modules/color";

export class FeedbackHelper {
  private feedback: Feedback;

  constructor() {
    this.feedback = new Feedback();
  }

  showSuccess(title, message): void {
    this.feedback.success({
      title: title,
      message: message,
      duration: 5000,
      // type: FeedbackType.Success, // no need to specify when using 'success' instead of 'show'
      onTap: () => {
        console.log("showSuccess tapped");
      }
    });
  }

  showSuccessAltColors(title, message): void {
    this.feedback.show({
      title: title,
      titleColor: new Color("black"),
      message: message,
      messageColor: new Color("#e5f5f8"),
      duration: 5000,
      type: FeedbackType.Success,
      backgroundColor: new Color("lightskyblue"),
      onTap: () => {
        console.log("showSuccessAltColor tapped");
      }
    });
  }

  showInfo(title, message): void {
    this.feedback.show({
      title: title,
      message: message,
      duration: 7500,
      type: FeedbackType.Info,
      onTap: () => {
        console.log("showInfo tapped");
      }
    });
  }

  showWarning(title, message): void {
    this.feedback.show({
      // title: "The warning title",
      message: message,
      duration: 4000,
      position: FeedbackPosition.Top,
      type: FeedbackType.Warning,
      onTap: () => {
        console.log("showWarning tapped");
      }
    });
  }

  showTitleOnly(title): void {
    this.feedback.show({
      title: title,
      duration: 2000,
      onTap: () => {
        console.log("showMessageOnly tapped");
      }
    });
  }

  showCustomIcon(title, message): void {
    this.feedback.show({
      title: title,
      message: message,
      duration: 6000,
      backgroundColor: new Color("yellowgreen"),
      icon: "thumbsup", // in App_Resources/platform folders
      onTap: () => {
        console.log("showCustomIcon tapped");
      }
    });
  }

  showError(title, message): void {
    this.feedback.show({
      title: title,
      message: message,
      duration: 5000,
      type: FeedbackType.Error,
      onTap: () => {
        console.log("showError tapped");
      }
    });
  }

  showErrorBottom(title, message): void {
    this.feedback.show({
      title: title,
      message: message,
      duration: 5000,
      position: FeedbackPosition.Bottom,
      type: FeedbackType.Error,
      onTap: () => {
        console.log("showErrorBottom tapped");
      }
    });
  }

  dismiss(): void {
    this.feedback.hide();
  }
}