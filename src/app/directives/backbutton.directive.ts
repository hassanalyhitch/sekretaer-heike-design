import { Directive, HostListener } from '@angular/core'
import { BackNavigationService } from '../services/back-navigation.service'

@Directive({
  selector: '[backButton]',
})
export class BackButtonDirective {
  constructor(private navigation: BackNavigationService) {}

  @HostListener('click')
  onClick(): void {
    // console.log("back directive called");
    this.navigation.back();
  }
}