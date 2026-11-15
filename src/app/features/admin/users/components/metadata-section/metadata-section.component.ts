import { Component, input } from "@angular/core";
import { User } from "../../models/users.interface";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-metadata-user-section',
    templateUrl: 'metadata-section.component.html',
    imports: [ DatePipe ]
})
export class MetadataSectionComponent {
    metadata = input.required<User>();
    dateNow = new Date();
};