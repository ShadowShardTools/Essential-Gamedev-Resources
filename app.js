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
        description.textContent = resource.description || 'No description available';
        
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
  const list = el.nextElementSibling;
  const isVisible = list.classList.contains('block');
  
  // Toggle visibility
  if (isVisible) {
    list.classList.remove('block');
    list.classList.add('hidden');
  } else {
    list.classList.remove('hidden');
    list.classList.add('block');
  }
  
  // Toggle arrow
  const arrow = el.querySelector('.arrow');
  arrow.textContent = isVisible ? '▼' : '▲';
  
  // Toggle transform for animation
  if (isVisible) {
    arrow.style.transform = '';
  } else {
    arrow.style.transform = 'rotate(180deg)';
  }
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
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.add('hidden');
  });

  // Show requested section
  const section = document.getElementById(id);
  if (section) {
    section.classList.remove('hidden');
  }
}

// Load data from external file
function loadResourcesData() {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error-message');
  
  loadingEl.classList.remove('hidden');
  errorEl.classList.add('hidden');
  
  fetch('resources.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      loadingEl.classList.add('hidden');
      
      // Render the page with loaded data
      renderSidebar(data);
      renderContentSections(data);
      
      // Set up click handlers for subcategory links
      document.querySelectorAll('[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = link.getAttribute('data-target');
          showSection(target);
          setActiveLink(link);
        });
      });
      
      // Setup home link handler
      const homeLink = document.getElementById('home-link');
      homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home');
        setActiveLink(homeLink);
      });
      
      // Setup quick links in the home page
      setupQuickLinks(data);
      
      // Show home section by default
      showSection('home');
      setActiveLink(homeLink);
    })
    .catch(error => {
      console.error('Error loading resources data:', error);
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

  fetch('updates.json')
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
function setupQuickLinks(data) {
  // These are example link IDs that might exist in your data
  // You should update these to match actual IDs in your data
  
  const quickLinks = [
    { id: 'beginner-link', targetId: 'unity-basics' },
    { id: 'tutorials-link', targetId: 'tutorials' },
    { id: 'tools-link', targetId: 'essential-tools' }
  ];
  
  quickLinks.forEach(link => {
    const element = document.getElementById(link.id);
    if (element) {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Find the corresponding sidebar link to highlight
        const sidebarLink = document.querySelector(`[data-target="${link.targetId}"]`);
        
        if (sidebarLink) {
          // Find parent category and open it
          const parentCategory = sidebarLink.closest('.mb-2').querySelector('.flex');
          if (parentCategory) {
            const list = parentCategory.nextElementSibling;
            if (list.classList.contains('hidden')) {
              toggleCategory(parentCategory);
            }
          }
          
          // Show the section and highlight the link
          showSection(link.targetId);
          setActiveLink(sidebarLink);
        } else {
          // Fallback to home if target doesn't exist
          showSection('home');
        }
      });
    }
  });
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  loadResourcesData();
  loadLatestUpdates();
});