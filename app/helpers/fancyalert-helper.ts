import { alert } from "tns-core-modules/ui/dialogs";
import { TNSFancyAlert, TNSFancyAlertButton } from "nativescript-fancyalert";
import { TitleCasePipe } from "@angular/common";

export class FancyalertHelper {

  constructor() {
  }

  showSuccess(title, message): void {
    TNSFancyAlert.showSuccess(title, message, "OK");
  }

  showInfo(title, message): void {
    TNSFancyAlert.showInfo(title, message, "OK");
  }

  showNotice(title, message): void {
    TNSFancyAlert.showNotice(title, message, "OK");
  }

  showWarning(title, message): void {
    TNSFancyAlert.showError(title, message, "OK");
  }

  showError(title, message): void {
    TNSFancyAlert.showError(title, message, "OK");
  }

  showWaiting(title, message): void {
    TNSFancyAlert.showWaiting(title, message, "ok", 5);
  }

  showTimer(): void {
    TNSFancyAlert.showCustomButtonTimer(0, true, undefined, undefined, 'Mission Impossible', `This will self-destruct in 5 seconds.`, 'Ok');
  }

  showTextField(): void {
    let initialValue = null;
    TNSFancyAlert.showTextField('Enter your name', initialValue, new TNSFancyAlertButton({
      label: "Done",
      action: (value: any) => {
        alert({
          title: "User entered:",
          message: value,
          okButtonText: "Correct ;)"
        });
      }
    }), undefined, undefined, "What's you name", ".. if you have one", "Dismiss");
  }

  showSwitch(): void {
    TNSFancyAlert.showSwitch("Don't ask me again", '#58B136', new TNSFancyAlertButton({
      label: "Save",
      action: (isSelected: boolean) => {
        console.log(`Don't ask again was selected? ${isSelected}`);
      }
    }), 'switch.png', '#B3714F', 'Need a switch?', `It can be useful.`, 'Got it.');
  }
}