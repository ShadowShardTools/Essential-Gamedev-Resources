import { toggleCategory } from './UI_Interactions.js';

// Function to render sidebar categories
export function renderSidebar(data) {
    const sidebarContainer = document.getElementById('sidebar-categories');
    sidebarContainer.innerHTML = ''; // Clear loading message

    data.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'mb-2';

        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'flex items-center justify-between cursor-pointer p-2 bg-[#1e1e1e] rounded hover:bg-[#2a2a2a] font-medium text-sm';
        categoryTitle.innerHTML = `
        <span class="flex items-center"><span class="w-4 h-4 mr-2 inline-block bg-gradient-to-br from-teal-400 via-pink-500 to-yellow-300 rounded"></span>${category.name}</span>
        <span class="arrow transition-transform duration-200">▼</span>
      `;

        const subcategoryList = document.createElement('div');
        subcategoryList.className = 'hidden pl-6 mt-1';

        category.subcategories.forEach(subcategory => {
            const link = document.createElement('a');
            link.href = `#${subcategory.id}`;
            link.textContent = subcategory.name;
            link.setAttribute('data-target', subcategory.id);
            link.className = 'block py-1 text-sm text-slate-400 hover:text-white transition-colors rounded px-2';
            subcategoryList.appendChild(link);
        });

        categoryDiv.appendChild(categoryTitle);
        categoryDiv.appendChild(subcategoryList);
        sidebarContainer.appendChild(categoryDiv);

        // Add event listener
        categoryTitle.addEventListener('click', () => {
            toggleCategory(categoryTitle);
        });
    });
}

// Function to render content sections
export function renderContentSections(data) {
    const contentContainer = document.getElementById('content-sections');
    contentContainer.innerHTML = ''; // Clear any existing content

    data.categories.forEach(category => {
        category.subcategories.forEach(subcategory => {
            const section = document.createElement('section');
            section.id = subcategory.id;
            section.className = 'content-section hidden';

            const heading = document.createElement('h2');
            heading.textContent = `${category.name} > ${subcategory.name}`;
            heading.className = 'text-2xl text-white mb-2';

            const description = document.createElement('p');
            description.textContent = subcategory.description || `Resources for ${subcategory.name}`;
            description.className = 'text-slate-400 mb-6';

            const list = document.createElement('ul');
            list.className = 'space-y-3';

            subcategory.resources.forEach(resource => {
                const listItem = document.createElement('li');
                listItem.className = 'bg-[#121212] p-4 rounded-lg';

                const link = document.createElement('a');
                link.href = resource.url;
                link.className = 'text-[#00ccff] hover:underline text-lg font-medium';
                link.textContent = resource.title;
                link.target = "_blank"; // Open in new tab

                const description = document.createElement('p');
                description.className = 'text-slate-400 mt-1';
                description.textContent = resource.description || '';

                listItem.appendChild(link);
                listItem.appendChild(description);
                list.appendChild(listItem);
            });

            section.appendChild(heading);
            section.appendChild(description);
            section.appendChild(list);
            contentContainer.appendChild(section);
        });
    });
}