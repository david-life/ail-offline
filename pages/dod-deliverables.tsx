import { useEffect, useState } from "react";
import styles from "../styles/DoDDeliverables.module.css";
import Footer from "./Footer";
import Image from "next/image";
import Header from "./header"; // Correct for default export

  
export default function Records() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const sortRecords = () => {
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortAscending) {
      return a.title.localeCompare(b.title); // Sort alphabetically
    } else {
      return b.title.localeCompare(a.title); // Sort reverse-alphabetically
    }
  });
  setFilteredRecords(sortedRecords);
  setSortAscending(!sortAscending); // Toggle the sort order
};


  const toggleViewMode = () => {
  setViewMode(viewMode === "grid" ? "list" : "grid");
};

  const [showModal, setShowModal] = useState(false);
  const openCardInNewWindow = (recordId) => {
    const selectedRecord = records.find(record => record.id === recordId);
    const recordDetailsUrl = `/record-details/${recordId}`; // Replace with actual path
    window.open(recordDetailsUrl, '_blank');
  };

  const clearFilters = () => {
  setSelectedFilters([]);
  setFilteredRecords(records); // Reset to original records
};

  
  const [expandedCard, setExpandedCard] = useState(null);

  // Define parent and child categories
  const categories = [
    {
      name: "Technical Documentation and Manuals",
      value: "Technical Documentation",
      subcategories: [
        { name: "Technical Orders (TOs)", value: "TOs" },
        { name: "Data Modules (DMs)", value: "DMs" },
        { name: "Weapon Systems Technical Manuals (WSTMs)", value: "WSTMs" },
        { name: "Depot Maintenance Work Requirements (DMWRs)", value: "DMWRs" },
        { name: "Logistics Support Analysis (LSA)", value: "LSA" },
        { name: "Configuration Management Documents (CMD)", value: "CMD" },
        { name: "Fielding Plans & New Equipment Training (NET)", value: "NET" },
      ],
    },
    {
      name: "Wiki",
      value: "Wiki",
      subcategories: [], // Subcategories can be added here if needed
    },
    {
      name: "View All",
      value: "All",
      subcategories: [],
    },
  ];

  const handleFilterChange = (filterValue, isChecked) => {
    setSelectedFilters((prevFilters) =>
      isChecked ? [...prevFilters, filterValue] : prevFilters.filter((f) => f !== filterValue)
    );
  };

  const toggleCategoryExpansion = (categoryValue) => {
    const newExpandedCategories = new Set(expandedCategories);
    if (newExpandedCategories.has(categoryValue)) {
      newExpandedCategories.delete(categoryValue);
    } else {
      newExpandedCategories.add(categoryValue);
    }
    setExpandedCategories(newExpandedCategories);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/records");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setRecords(data.length === 0 ? getPlaceholderRecords() : data);
        setFilteredRecords(data);
      } catch (err) {
        console.error("Error fetching records:", err);
        setError("Failed to load records. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let updatedRecords = records;

    // Apply selected filters
    if (selectedFilters.length > 0) {
      updatedRecords = updatedRecords.filter((record) =>
        selectedFilters.includes(record.category)
      );
    }

    setFilteredRecords(updatedRecords);
  }, [records, selectedFilters]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/semantic-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const searchResults = await response.json();
      setFilteredRecords(searchResults);
    } catch (error) {
      console.error("Error performing semantic search:", error);
      setError("Search failed. Please try again.");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleExpand = (recordId) => {
    setExpandedCard(expandedCard === recordId ? null : recordId);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingWheel}></div>
        <p className={styles.loadingText}>Generating Records...</p>
      </div>
    );
  }

  if (error) {
    return <p className={styles.errorText}>{error}</p>;
  }

  return (
    <div className={styles.container}>
      {/* Banner */}
      <div className="cui-banner">
        APPROVED FOR IL4 - CONTROLLED UNCLASSIFIED INFORMATION (CUI)
      </div>


      <div>
  <Header /> {/* Floating header */}
  <div className={styles.header}>
    {/* All other page content goes here */}
  </div>
</div>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search records..."
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          <img src="/logo.png" alt="Search" className={styles.searchIcon} />
        </button>
      </div>

{/* Toolbar */}
<div className={styles.toolbar}>
  <button className={styles.toolbarButton} onClick={sortRecords}>
    <img src="/images/sort-icon.jpg" alt="Sort" className={styles.icon} /> Sort
  </button>
  <button className={styles.toolbarButton} onClick={toggleViewMode}>
    <img src="/images/view-icon.jpg" alt="Toggle View" className={styles.icon} /> Toggle View
  </button>
  <button className={styles.toolbarButton} onClick={clearFilters}>
    <img src="/images/clear-icon.jpg" alt="Clear Filters" className={styles.icon} /> Clear Filters
  </button>
</div>

      
      <div
        className={`${styles.content} ${
          isSidebarVisible ? styles.sidebarVisible : styles.sidebarHidden
        }`}
      >
        {/* Sidebar */}
        <aside
          className={`${styles.sidebar} ${
            isSidebarVisible ? styles.visibleSidebar : styles.hiddenSidebar
          }`}
        >
          {isSidebarVisible && (
            <>
              <h3>Categories</h3>
              <ul className={styles.nestedList}>
                {categories.map((category) => (
                  <li key={category.value}>
                    <button
                      onClick={() => toggleCategoryExpansion(category.value)}
                      className={styles.expandButton}
                      aria-expanded={expandedCategories.has(category.value)}
                    >
                      {expandedCategories.has(category.value) ? "-" : "+"}
                    </button>
                    <label>
                      <input
                        type="checkbox"
                        value={category.value}
                        onChange={(e) =>
                          handleFilterChange(e.target.value, e.target.checked)
                        }
                      />
                      {category.name}
                    </label>

                    {/* Expand Subcategories */}
                    {expandedCategories.has(category.value) && category.subcategories.length > 0 && (
                      <ul className={styles.subList}>
                        {category.subcategories.map((subcat) => (
                          <li key={subcat.value}>
                            <label>
                              <input
                                type="checkbox"
                                value={subcat.value}
                                onChange={(e) =>
                                  handleFilterChange(e.target.value, e.target.checked)
                                }
                              />
                              {subcat.name}
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>

        {/* Sidebar Toggle Button */}
        <button className={styles.toggleButton} onClick={toggleSidebar}>
          {isSidebarVisible ? "-" : "+"}
        </button>

        {/* Grid Container */}
        <main className={viewMode === "grid" ? styles.gridContainer : styles.listContainer}>
  {/* Records rendering here */}
          <div className={styles.recordsCounter}>
            <p>{filteredRecords.length} RECORD(S)</p>
          </div>

          {filteredRecords.map((record) => (
            <div key={record.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{record.title}</h3>
                <button
                  className={styles.collapseArrow}
                  onClick={() => toggleExpand(record.id)}
                  aria-label="Expand or collapse"
                  aria-expanded={expandedCard === record.id}
                >
                  {expandedCard === record.id ? "-" : "+"}
                </button>
              </div>
              <p>Category: {record.category}</p>
              <p>Date: {new Date(record.Date).toLocaleDateString()}</p>
            <div> 
              
{/* Card Component */}
  <div className="card">
    <h2>{record.title || "Card Title"}</h2>
    <p>{record.description || "This is the card description."}</p>
    <img
      src={record.image || "/${record.url}.jpg"}
      alt="Card Image"
      onClick={() => setShowModal(true)} // Open modal on click
      className="clickable-image"
    />
    <p>
      Export:{" "}
      <a
        href={`/documents/${record.export}.pdf`} // Dynamic URL based on record.export
        target="_blank"
        rel="noopener noreferrer"
      >
        Open PDF Document
      </a>
    </p>
  </div>
</div>

{/* Modal for Expanded View */}
    {showModal && (
      <div
        className="modal-overlay"
        onClick={() => setShowModal(false)} // Close modal on overlay click
      >
        <div className="modal-content">
          <img
            src={record.image || "/${record.url}.jpg"}
            alt="Expanded View"
            className="magnified-image"
          />
          <button
            onClick={() => setShowModal(false)} // Close modal button
            className="close-modal-button"
          >
            Close
          </button>
        </div>
      </div>
    )}
              
{/* Expanded Card Functionality */}
              {expandedCard === record.id && (
                <div className={styles.documentViewer}>
                  <Image
                     src={record.url || "/fallback-image.png"}
          alt={`Cover Page for ${record.title}`}
          width={300}
          height={200}
          className={styles.cardImage}
                    
                  />
                  <p>{record.content}</p>
                  
                </div>
              )}
            </div>
          ))}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function getPlaceholderRecords() {
  return Array.from({ length: 10 }, (_, index) => ({
    id: `placeholder-${index + 1}`,
    title: `Placeholder Document ${index + 1}`,
    category: [
      "Technical Documentation",
      "Wiki",
      "TOs",
      "DMs",
      "WSTMs",
      "DMWRs",
      "LSA",
      "CMD",
      "NET",
    ][index % 9], // Randomly assign a category
    date: "2025-01-01",
    url: "/fallback-image.png",
    content: "Placeholder content",
  }));
}
