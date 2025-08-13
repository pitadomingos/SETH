import {redirect} from '@/navigation';
import {defaultLocale} from '../../i18n';
 
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
