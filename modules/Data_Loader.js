// Import necessary functions from other modules
import { renderSidebar, renderContentSections } from './UI_Renderer.js';
import { setupEventListeners } from './UI_Interactions.js';
import { fetchWithRetry } from './Utils.js';

// Function to load all resources JSON files dynamically
export function loadResourcesData() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');

    loadingEl.classList.remove('hidden');
    errorEl.classList.add('hidden');

    // Fetch the list of JSON files from the 'categories-list.json'
    fetchWithRetry('resources/categories-list.json')
        .then(response => response.json())
        .then(data => {
            if (data.files && data.files.length > 0) {
                // Dynamically fetch all JSON files listed by the 'categories-list.json'
                const promises = data.files.map(file => fetchWithRetry(`resources/categories/${file}`).then(res => res.json()));

                Promise.all(promises)
                    .then(responses => {
                        loadingEl.classList.add('hidden');
                        const mergedData = { categories: [] };

                        // Merge data from all JSON files
                        responses.forEach(response => {
                            mergedData.categories.push(...response.categories);
                        });

                        // Render the page with loaded data
                        renderSidebar(mergedData);
                        renderContentSections(mergedData);
                        setupEventListeners(mergedData);
                    })
                    .catch(error => {
                        console.error('Error loading JSON files:', error);
                        loadingEl.classList.add('hidden');
                        errorEl.classList.remove('hidden');
                    });
            } else {
                console.error('No JSON files found');
                loadingEl.classList.add('hidden');
                errorEl.classList.remove('hidden');
            }
        })
        .catch(error => {
            console.error('Error fetching file list:', error);
            loadingEl.classList.add('hidden');
            errorEl.classList.remove('hidden');
        });
}