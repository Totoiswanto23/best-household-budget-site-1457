// NusaBudget — boot: pasang router hash, render halaman pertama.
import { route } from './views.js';

window.addEventListener('hashchange', route);
route();
