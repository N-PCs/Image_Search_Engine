const accessKey = "5Gi8tsYRZwZGBV0abS8O5qisNlQW1Uw4IDFhXlj3bwYqDigNCr5xKJpu";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");

let keyword = "";
let page = 1;

async function searchImages() {
    keyword = searchBox.value.trim();
    
    // Don't search if keyword is empty
    if (!keyword) {
        alert("Please enter a search term");
        return;
    }

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;
    
    try {
        const response = await fetch(url);
        
        // Check if response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (page === 1) {
            searchResult.innerHTML = "";
            showMoreBtn.style.display = "none"; // Hide button on new search
        }

        const results = data.results;

        // Check if there are no results
        if (results.length === 0) {
            searchResult.innerHTML = "<p>No results found. Try a different search term.</p>";
            showMoreBtn.style.display = "none";
            return;
        }

        results.forEach((result) => {
            const imageContainer = document.createElement("div");
            imageContainer.className = "image-container";
            
            const image = document.createElement("img");
            image.src = result.urls.small;
            image.alt = result.alt_description || keyword + " image";
            
            const imageLink = document.createElement("a");
            imageLink.href = result.links.html;
            imageLink.target = "_blank";
            imageLink.rel = "noopener noreferrer";
            imageLink.appendChild(image);
            
            imageContainer.appendChild(imageLink);
            searchResult.appendChild(imageContainer);
        });

        if (data.total_pages > page) {
            showMoreBtn.style.display = "block";
        } else {
            showMoreBtn.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching images:", error);
        searchResult.innerHTML = "<p>Failed to load images. Please try again later.</p>";
        showMoreBtn.style.display = "none";
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    page = 1;
    searchImages();
});

showMoreBtn.addEventListener("click", () => {
    page++;
    searchImages();
});

// Initialize by hiding the show more button
showMoreBtn.style.display = "none";
