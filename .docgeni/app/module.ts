import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { myProviders } from './providers';

export default {
    imports: [FormsModule, ScrollingModule],
    providers: [...myProviders]
};
