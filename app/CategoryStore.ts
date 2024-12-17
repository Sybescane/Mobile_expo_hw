import { makeAutoObservable, observable } from "mobx";
import { Category } from "./Category";
import axios from "axios";

class CategoryStore {
    @observable 
    categories: Category[] = []; // Сделаем categories observable
    
    constructor() {
        makeAutoObservable(this);
        this.loadCategories(); // Загружаем категории при инициализации
    }

    async loadCategories() {
        try {
            const res = await axios.get("http://10.0.2.2:4000/Category/GetList");
            this.categories = res.data;
        } catch (error) {
            console.error("Error loading categories", error);
        }
    }

    async addCategory(name: string) {
        try {
            const res = await axios.post("http://10.0.2.2:4000/Category/Create", { name });
            const newCategory: Category = { id: res.data, name };
            this.categories.push(newCategory);
        } catch (error) {
            console.error("Error adding category", error);
        }
    }

    async updateCategory(categ : Category) {
        try {
            const res = await axios.put("http://10.0.2.2:4000/Category/Update", { id : categ.id, name: categ.name });
            this.categories = this.categories.map(cat => 
                cat.id === categ.id ? { ...cat, name: categ.name } : cat
            );
        } catch (error) {
            console.error("Error updating category", error);
        }
    }

    async removeCategory(id: string) {
        try {
            await axios.delete(`http://10.0.2.2:4000/Category/Delete?id=${id}`);
            this.categories = this.categories.filter(c => c.id !== id);
        } catch (error) {
            console.error("Error deleting category", error);
        }
    }
}

const categoryStore = new CategoryStore();
export default categoryStore;
