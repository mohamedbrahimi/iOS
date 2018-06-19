import { alert } from "tns-core-modules/ui/dialogs";
import * as LocalNotifications from "nativescript-local-notifications";

export class LocalNotificationsHelper {

  constructor() {
  }

  showWithSound(myTitle: string, myMessage: string): void {
    LocalNotifications.schedule([{
      id: 1,
      title: myTitle as string,
      body: myMessage as string,
      badge: 1,
      at: new Date(new Date().getTime() + (1 * 1000)) // 1 seconds from now
    }]);

    // adding a handler, so we can do something with the received notification.. in this case an alert
    LocalNotifications.addOnMessageReceivedCallback(data => {
      alert({
        title: "Notification reçue",
        message: `id: '${data.id}', title: '${data.title}'.`,
        okButtonText: "Ok"
      });
    });
  }

  continuous(): void {
    LocalNotifications.schedule([{
      id: 2,
      title: 'Cancel me, quickly!',
      body: 'Who thought this would be a good idea!?',
      interval: 'minute',
      sound: null,
      at: new Date(new Date().getTime() + (5 * 1000)), // 5 seconds from now
    }]);
  }

  cancelAll(): void {
    LocalNotifications.cancelAll();
  }
}
