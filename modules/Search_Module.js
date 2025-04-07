import { showSection, setActiveLink, toggleCategory } from './UI_Interactions.js';

// Functions for search functionality

export function setupSearch(data) {
    const searchBox = document.getElementById('search-box');
    if (!searchBox) return;

    searchBox.addEventListener('input', () => {
        const query = searchBox.value.toLowerCase().trim();

        if (query === '') {
            // If search box is empty, show home section and restore normal navigation
            showSection('home');
            setActiveLink(document.getElementById('home-link'));
            return;
        }

        // Hide all regular sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });

        const searchResults = [];

        data.categories.forEach(category => {
            category.subcategories.forEach(subcategory => {
                subcategory.resources.forEach(resource => {
                    const titleMatch = resource.title.toLowerCase().includes(query);
                    const descMatch = (resource.description || '').toLowerCase().includes(query);

                    if (titleMatch || descMatch) {
                        searchResults.push({
                            ...resource,
                            category: category.name,
                            subcategory: subcategory.name,
                            subcategoryId: subcategory.id
                        });
                    }
                });
            });
        });

        // Create or update search results section
        let resultSection = document.getElementById('search-results');
        if (!resultSection) {
            resultSection = document.createElement('section');
            resultSection.className = 'content-section';
            resultSection.id = 'search-results';
            document.getElementById('content-sections').appendChild(resultSection);
        }

        resultSection.innerHTML = ''; // Clear previous results

        const heading = document.createElement('h2');
        heading.className = 'text-2xl text-white mb-4';
        heading.textContent = `Search Results for "${query}"`;

        const resultList = document.createElement('ul');
        resultList.className = 'space-y-3';

        if (searchResults.length === 0) {
            const noResults = document.createElement('li');
            noResults.textContent = 'No matching resources found.';
            noResults.className = 'text-slate-400';
            resultList.appendChild(noResults);
        } else {
            searchResults.forEach(result => {
                const item = document.createElement('li');
                item.className = 'bg-[#121212] p-4 rounded-lg';

                item.innerHTML = `
            <a href="${result.url}" target="_blank" class="text-[#00ccff] hover:underline text-lg font-medium">
              ${highlight(result.title, query)}
            </a>
            <p class="text-slate-400 text-sm">${highlight(result.description || 'No description', query)}</p>
            <div class="flex justify-between mt-1">
              <p class="text-slate-500 text-xs">${result.category} > ${result.subcategory}</p>
              <a href="#" class="text-xs text-[#00ccff] navigate-to-section" data-section="${result.subcategoryId}">
                Go to section
              </a>
            </div>
          `;

                resultList.appendChild(item);
            });
        }

        resultSection.appendChild(heading);
        resultSection.appendChild(resultList);

        // Show the search results section
        resultSection.classList.remove('hidden');

        // Add event listeners to "Go to section" links
        resultSection.querySelectorAll('.navigate-to-section').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');

                // Clear search box
                searchBox.value = '';

                // Find and trigger click on the corresponding sidebar link
                const sidebarLink = document.querySelector(`[data-target="${sectionId}"]`);
                if (sidebarLink) {
                    // Expand the parent category if needed
                    const categoryDiv = sidebarLink.closest('.pl-6');
                    if (categoryDiv && categoryDiv.classList.contains('hidden')) {
                        const categoryTitle = categoryDiv.previousElementSibling;
                        toggleCategory(categoryTitle);
                    }

                    sidebarLink.click();
                }
            });
        });
    });

    // Add a clear button for the search box
    const searchContainer = searchBox.parentElement;
    const clearButton = document.createElement('button');
    clearButton.className = 'absolute right-2 top-2 text-slate-500 hover:text-white';
    clearButton.innerHTML = '✕';
    clearButton.style.display = 'none';
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(clearButton);

    searchBox.addEventListener('input', () => {
        clearButton.style.display = searchBox.value ? 'block' : 'none';
    });

    clearButton.addEventListener('click', () => {
        searchBox.value = '';
        clearButton.style.display = 'none';
        showSection('home');
        setActiveLink(document.getElementById('home-link'));
    });
}

// Highlight search matches
function highlight(text, keyword) {
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-300 text-black">$1</mark>');
}