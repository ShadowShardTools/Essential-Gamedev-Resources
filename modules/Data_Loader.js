// Import necessary functions from other modules
import { renderSidebar, renderContentSections } from './UI_Renderer.js';
import { setupEventListeners } from './UI_Interactions.js';

// Helper function for fetch with retry capability
function fetchWithRetry(url, retries = 3) {
    return fetch(url).catch(err => {
        if (retries > 0) return fetchWithRetry(url, retries - 1);
        throw err;
    });
}

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

// Function to load and display latest updates
export function loadLatestUpdates() {
    const updatesList = document.getElementById('updates-list');
    if (!updatesList) {
        console.error("Updates list not found");
        return;
    }

    updatesList.innerHTML = '';

    // Show loading state
    const loadingItem = document.createElement('li');
    loadingItem.className = 'text-slate-400';
    loadingItem.textContent = 'Loading updates...';
    updatesList.appendChild(loadingItem);

    fetchWithRetry('updates.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load updates');
            return response.json();
        })
        .then(data => {
            updatesList.innerHTML = '';

            if (!data.updates || !Array.isArray(data.updates) || data.updates.length === 0) {
                const noUpdatesItem = document.createElement('li');
                noUpdatesItem.className = 'text-slate-400';
                noUpdatesItem.textContent = 'No updates available';
                updatesList.appendChild(noUpdatesItem);
                return;
            }

            data.updates.forEach(update => {
                const updateItem = document.createElement('li');
                updateItem.className = 'flex items-start';
                updateItem.innerHTML = `
            <span class="text-green-400 mr-2">✦</span>
            <div>
              <span class="font-medium">${update.title}</span>
              <p class="text-sm text-slate-400">${update.description}</p>
            </div>
          `;
                updatesList.appendChild(updateItem);
            });
        })
        .catch(error => {
            console.error('Error loading updates:', error);
            updatesList.innerHTML = '';
            const errorItem = document.createElement('li');
            errorItem.className = 'text-red-400';
            errorItem.textContent = 'Failed to load updates. Please try again later.';
            updatesList.appendChild(errorItem);
        });
}