import { FormsModule } from '@angular/forms';
import { myProviders } from './providers';

export default {
    imports: [FormsModule],
    providers: [...myProviders],
};
