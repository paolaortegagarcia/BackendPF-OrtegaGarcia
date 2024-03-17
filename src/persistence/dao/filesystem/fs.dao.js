import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export default class FSDao {
    constructor(path) {
        this.path = path;
        this.createFile();
    }

    async getAll() {
        try {
            if (fs.existsSync(this.path)) {
                const items = await this.getFile();
                console.log("Number of items:", items.length);
                return items;
            } else {
                console.log("No item list found");
                return [];
            }
        } catch (error) {
            console.log("Error getting the items:", error);
            return [];
        }
    }

    async getById(id) {
        try {
            const items = await this.getAll();
            const itemId = items.find((item) => item.id === id);
            if (itemId) {
                console.log("Requested ID details:", itemId);
                return itemId;
            } else {
                console.error("Item with that ID not found");
            }
        } catch (error) {
            console.error("Error getting the item by ID:", error);
        }
    }

    async create(obj) {
        try {
            const item = {
                id: uuidv4(),
                status: "true",
                ...obj,
            };
            this.items.push(item);
            await this.saveFile(this.items);
            console.log("New item added, details:", item);
            return item;
        } catch (error) {
            console.log("Error adding the item:", error);
        }
    }

    async update(obj, id) {
        try {
            if (!id) {
                console.log("The 'ID' field is required");
                return;
            }

            const items = await this.getFile();
            const itemIndex = items.findIndex((item) => item.id === id);

            if (itemIndex === -1) {
                console.log("Item with that ID not found");
                return;
            }

            items[itemIndex] = {
                ...items[itemIndex],
                ...obj,
            };

            await this.updateFile(items);
            console.log("Product updated successfully:", items[itemIndex]);
            return items[itemIndex];
        } catch (error) {
            console.error("Error updating the item:", error);
        }
    }

    async delete(id) {
        try {
            if (!id) {
                console.log("The 'ID' field is required");
                return;
            }

            const items = await this.getFile();
            const itemIndex = items.findIndex((item) => item.id === id);

            if (itemIndex === -1) {
                console.log("Item with that ID not found");
                return;
            }

            items.splice(itemIndex, 1);

            await this.updateFile(items);
            console.log("Item deleted successfully");
        } catch (error) {
            console.error("Error deleting the item:", error);
        }
    }

    /* ------------------------------- Archivo JSON ------------------------------ */

    async createFile() {
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, JSON.stringify([]));
            }
        } catch (error) {
            console.error("Error creating the file:", error);
        }
    }

    async getFile() {
        try {
            const items = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(items);
        } catch (error) {
            console.error("Error reading the file:", error);
            return [];
        }
    }

    async saveFile(items) {
        try {
            if (fs.existsSync(this.path)) {
                const existingItems = await this.getFile();
                existingItems.push(...items);
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(existingItems)
                );
            } else {
                await fs.promises.writeFile(this.path, JSON.stringify(items));
            }
        } catch (error) {
            console.error("Error saving the file:", error);
        }
    }

    async updateFile(items) {
        try {
            if (fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, JSON.stringify(items));
            } else {
                await fs.promises.writeFile(this.path, JSON.stringify(items));
            }
        } catch (error) {
            console.error("Error updating the file:", error);
        }
    }
}
