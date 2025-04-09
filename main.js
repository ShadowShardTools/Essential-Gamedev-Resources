// Import all the modular JavaScript files
import  {loadResourcesData} from './modules/Data_Loader.js';
import './modules/UI_Renderer.js';
import './modules/UI_Interactions.js';
import './modules/Search_Module.js';

// Main entry point
document.addEventListener("DOMContentLoaded", () => {
    loadResourcesData();

    const hash = window.location.hash.substring(1);
    if (hash) {
        const target = document.querySelector(`[data-target="${hash}"]`);
        if (target) {
            target.click(); // Simulate click to load section
        }
    }
});