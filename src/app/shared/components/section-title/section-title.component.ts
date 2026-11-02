import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-section-title',
    templateUrl: 'section-title.component.html',
    imports: [RouterLink],
})
export class SectionTitleComponent {
    title   = input.required<string>();
    eyebrow = input<string>();
    action  = input<string>();
};