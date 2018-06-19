import { ToastService } from "../services/toast.service";

export class ToastHelper {

  constructor(private toastService: ToastService) {
  }

  showShort(message): void {
    this.toastService.show(message);
  }

  showLong(message): void {
    this.toastService.show(message, true);
  }
}