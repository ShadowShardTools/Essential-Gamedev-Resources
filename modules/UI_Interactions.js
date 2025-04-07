import { setupSearch } from './Search_Module.js';

// Global variable to track the current selected item
let currentSelected = null;

// Function to toggle category visibility
export function toggleCategory(el) {
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
export function setActiveLink(element) {
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
export function showSection(id) {
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

// Function to set up event listeners
export function setupEventListeners(data) {
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