// dataManager.js

class DataManager {
    constructor() {
        this.stockData = { categories: [] };
        this.loadData();
    }

    // Load data from localStorage
    loadData() {
        try {
            const savedData = localStorage.getItem('stockData');
            if (savedData) {
                this.stockData = JSON.parse(savedData);
            }
            return this.stockData;
        } catch (error) {
            console.error('Error loading data:', error);
            return this.stockData;
        }
    }

    // Save data to localStorage
    saveData() {
        try {
            localStorage.setItem('stockData', JSON.stringify(this.stockData));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Get all categories
    getCategories() {
        return this.stockData.categories;
    }

    // Add new category
    addCategory(categoryData) {
        try {
            const newCategory = {
                id: Date.now(),
                name: categoryData.name,
                color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
                productTypes: categoryData.productTypes || []
            };

            this.stockData.categories.push(newCategory);
            this.saveData();
            return newCategory;
        } catch (error) {
            console.error('Error adding category:', error);
            return null;
        }
    }

    // Delete category
    deleteCategory(categoryId) {
        try {
            this.stockData.categories = this.stockData.categories.filter(
                cat => cat.id !== categoryId
            );
            this.saveData();
            return true;
        } catch (error) {
            console.error('Error deleting category:', error);
            return false;
        }
    }

    // Get category by ID
    getCategory(categoryId) {
        return this.stockData.categories.find(cat => cat.id === categoryId);
    }

    // Update category
    updateCategory(categoryId, updatedData) {
        try {
            const categoryIndex = this.stockData.categories.findIndex(
                cat => cat.id === categoryId
            );
            if (categoryIndex !== -1) {
                this.stockData.categories[categoryIndex] = {
                    ...this.stockData.categories[categoryIndex],
                    ...updatedData
                };
                this.saveData();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating category:', error);
            return false;
        }
    }

    // Check if product name exists in category
    isProductNameTaken(categoryId, productName) {
        const category = this.getCategory(categoryId);
        if (!category) return false;
        
        return category.productTypes.some(type => 
            type.name.toLowerCase() === productName.toLowerCase()
        );
    }

    // Add product type to category
    addProductType(categoryId, productTypeData) {
        try {
            const category = this.getCategory(categoryId);
            if (!category) return false;

            // Check for duplicate product name
            if (this.isProductNameTaken(categoryId, productTypeData.name)) {
                alert(`A product with the name "${productTypeData.name}" already exists in this category.`);
                return false;
            }

            if (!category.productTypes) {
                category.productTypes = [];
            }
            
            category.productTypes.push(productTypeData);
            this.saveData();
            return true;
        } catch (error) {
            console.error('Error adding product type:', error);
            return false;
        }
    }

    // Delete product type from category
    deleteProductType(categoryId, productTypeName) {
        try {
            const category = this.getCategory(categoryId);
            if (category && category.productTypes) {
                category.productTypes = category.productTypes.filter(
                    type => type.name !== productTypeName
                );
                this.saveData();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting product type:', error);
            return false;
        }
    }

    // Add company to product type
    addCompany(categoryId, productTypeName, companyData) {
        try {
            const category = this.getCategory(categoryId);
            if (category) {
                const productType = category.productTypes.find(
                    type => type.name === productTypeName
                );
                if (productType) {
                    if (!productType.companies) {
                        productType.companies = [];
                    }
                    productType.companies.push(companyData);
                    this.saveData();
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error adding company:', error);
            return false;
        }
    }

    // Delete company from product type
    deleteCompany(categoryId, productTypeName, companyName) {
        try {
            const category = this.getCategory(categoryId);
            if (category) {
                const productType = category.productTypes.find(
                    type => type.name === productTypeName
                );
                if (productType && productType.companies) {
                    productType.companies = productType.companies.filter(
                        company => company.name !== companyName
                    );
                    this.saveData();
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error deleting company:', error);
            return false;
        }
    }

    // Update company data
    updateCompany(categoryId, productTypeName, companyName, updatedData) {
        try {
            const category = this.getCategory(categoryId);
            if (category) {
                const productType = category.productTypes.find(
                    type => type.name === productTypeName
                );
                if (productType && productType.companies) {
                    const companyIndex = productType.companies.findIndex(
                        company => company.name === companyName
                    );
                    if (companyIndex !== -1) {
                        productType.companies[companyIndex] = {
                            ...productType.companies[companyIndex],
                            ...updatedData
                        };
                        this.saveData();
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            console.error('Error updating company:', error);
            return false;
        }
    }

    // Search categories
    searchCategories(searchTerm) {
        return this.stockData.categories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
}

// Create and export a single instance
const dataManager = new DataManager();
export default dataManager;