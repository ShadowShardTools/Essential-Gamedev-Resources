// Global variable to track the current selected item
let currentSelected = null;

// Function to render sidebar categories
function renderSidebar(data) {
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
function renderContentSections(data) {
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

function toggleCategory(el) {
  // Collapse all others
  document.querySelectorAll('#sidebar-categories > div').forEach(div => {
    if (div !== el.parentElement) {
      const subList = div.querySelector('div.pl-6');
      const arrow = div.querySelector('.arrow');
      if (subList && arrow) {
        subList.classList.add('hidden');
        subList.classList.remove('block');
        arrow.textContent = '▼';
        arrow.style.transform = '';
      }
    }
  });

  // Toggle current
  const list = el.nextElementSibling;
  const isVisible = list.classList.contains('block');

  list.classList.toggle('hidden', isVisible);
  list.classList.toggle('block', !isVisible);

  const arrow = el.querySelector('.arrow');
  arrow.textContent = isVisible ? '▼' : '▲';
  arrow.style.transform = isVisible ? '' : 'rotate(180deg)';
}


// Function to set active selection state
function setActiveLink(element) {
  // Remove active state from previous selection
  if (currentSelected) {
    currentSelected.classList.remove('bg-[#3a3a3a]', 'text-white');
  }

  // Add active state to current selection
  if (element && element !== document.getElementById('home-link')) {
    element.classList.add('bg-[#3a3a3a]', 'text-white');
  }

  // Update current selection
  currentSelected = element;
}

// Function to show a specific section
function showSection(id) {
  // Hide all
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.add('hidden');
  });

  // Show current
  const section = document.getElementById(id);
  if (section) {
    section.classList.remove('hidden');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Function to load all resources JSON files dynamically
function loadResourcesData() {
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
function loadLatestUpdates() {
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

// Function to set up the quick links on the home page
function setupEventListeners(data) {
  // Add event listeners for subcategory links
  document.querySelectorAll('[data-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      showSection(target);
      setActiveLink(link);
    });
  });

  // Set up home link handler
  const homeLink = document.getElementById('home-link');
  homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('home');
    setActiveLink(homeLink);
  });

  // Show home section by default
  showSection('home');
  setActiveLink(homeLink);

  // Setup search functionality
  setupSearch(data);
}

function setupSearch(data) {
  const searchBox = document.getElementById('search-box');
  if (!searchBox) return;

  searchBox.addEventListener('input', () => {
    const query = searchBox.value.toLowerCase().trim();
    const contentContainer = document.getElementById('content-sections');

    // Hide all regular sections
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.add('hidden');
    });

    if (query === '') {
      // If search box is empty, show home section
      showSection('home');
      return;
    }

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
            });
          }
        });
      });
    });

    // Render search results
    contentContainer.innerHTML = '';

    const resultSection = document.createElement('section');
    resultSection.className = 'content-section';
    resultSection.id = 'search-results';

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
          <p class="text-slate-500 text-xs mt-1">${result.category} > ${result.subcategory}</p>
        `;


        resultList.appendChild(item);
      });
    }

    resultSection.appendChild(heading);
    resultSection.appendChild(resultList);
    contentContainer.appendChild(resultSection);
  });
}

function highlight(text, keyword) {
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-300 text-black">$1</mark>');
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  loadResourcesData();
  loadLatestUpdates();

  const hash = window.location.hash.substring(1);
  if (hash) {
    const target = document.querySelector(`[data-target="${hash}"]`);
    if (target) {
      target.click(); // Simulate click to load section
    }
  }
});

function fetchWithRetry(url, retries = 3) {
  return fetch(url).catch(err => {
    if (retries > 0) return fetchWithRetry(url, retries - 1);
    throw err;
  });
}
