import React, { useState, useRef, useEffect } from "react";
import { categories } from "../../utils/adminProductCategories";
import { RiSearchLine, RiArrowDownSLine } from "react-icons/ri";

// Organize categories by room
const categoryGroups = [
  { name: "Living Room", categories: categories.slice(0, 7) },
  { name: "Bedroom", categories: categories.slice(7, 13) },
  { name: "Dining Room", categories: categories.slice(13, 18) },
  { name: "Office", categories: categories.slice(18, 23) },
  { name: "Outdoor", categories: categories.slice(23, 28) },
  { name: "Children's", categories: categories.slice(28, 33) },
  { name: "Storage & Organization", categories: categories.slice(33, 38) },
  { name: "Accent Furniture", categories: categories.slice(38, 42) },
  { name: "Bathroom", categories: categories.slice(42, 45) },
  { name: "Lighting", categories: categories.slice(45) },
];

const CategorySelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Find the currently selected category name
  const selectedCategory = categories.find(c => c.id.toString() === value?.toString());

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter categories based on search term
  const filteredGroups = searchTerm
    ? categoryGroups.map(group => ({
        ...group,
        categories: group.categories.filter(cat => 
          cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(group => group.categories.length > 0)
    : categoryGroups;

  const handleCategorySelect = (categoryId) => {
    onChange?.({
      target: {
        name: "category",
        value: categoryId.toString()
      }
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected category display */}
      <div 
        className="input input-bordered w-full rounded-none focus:border-primary flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedCategory ? "text-neutral" : "text-neutral/50"}>
          {selectedCategory ? selectedCategory.name : "Select Category"}
        </span>
        <RiArrowDownSLine className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-base-300 shadow-lg max-h-96 overflow-auto">
          {/* Search input */}
          <div className="sticky top-0 bg-white p-2 border-b border-base-200">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/50" />
              <input
                ref={inputRef}
                type="text"
                className="input input-sm input-bordered w-full pl-9 rounded-sm"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category groups */}
          {filteredGroups.map((group) => (
            <div key={group.name} className="category-group">
              <div className="bg-base-100 px-3 py-2 text-sm font-medium text-neutral/70 sticky top-[52px]">
                {group.name}
              </div>
              {group.categories.map((category) => (
                <div
                  key={category.id}
                  className={`px-4 py-2 hover:bg-primary/5 cursor-pointer ${
                    category.id.toString() === value?.toString() ? "bg-primary/10 text-primary" : ""
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {category.name}
                </div>
              ))}
            </div>
          ))}

          {filteredGroups.length === 0 && (
            <div className="p-4 text-center text-neutral/50">
              No categories match your search
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
