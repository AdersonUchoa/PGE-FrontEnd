import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primeuix/themes/aura';
import "./index.css"
import { ConfirmationService, ConfirmDialog, Toast } from 'primevue';
import { Form } from 'vform';
import Paginator from 'primevue/paginator';


window.Form = Form

const app = createApp(App)
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService)
app.use(ConfirmationService)
app.component('ConfirmDialog', ConfirmDialog);
app.component("Toast", Toast)
app.mount('#app')
