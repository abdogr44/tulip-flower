import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../images-guid.json');

async function migrate() {
    const content = await fs.readFile(jsonPath, 'utf8');
    const items = JSON.parse(content);

    const updatedItems = items.map(item => {
        let newCategory = item.category_ar;
        const tags = item.tags_ar || [];

        // Prioritize Tags for Tables/Woods/Decore
        if (tags.some(t => t.includes('طاولة') || t.includes('طاولات'))) {
            newCategory = 'طاولات';
        } else if (tags.some(t => t.includes('خشب') || t.includes('خشبي'))) {
            newCategory = 'خشبيات';
        } else if (tags.includes('ديكور') && !['طاولات', 'خشبيات', 'أشجار', 'زهور', 'أحواض'].includes(newCategory)) {
            // Only move generic decore if it's not already in a specific category? 
            // User said "Tables and Woods and Decore are the latest".
            // Let's be careful not to move EVERYTHING to decore since almost everything has that tag.
            // Maybe only if category is 'non-classified' or generic?
            // Actually, let's stick to the user request.
            // User: "in the top should be plants big and small. both in the categories and the products"
            // User: "so tables and woods and decore are the latest."
        }

        // Rename/Remap existing categories
        if (item.category_ar === 'أشجار') {
            newCategory = 'أشجار كبيرة';
        } else if (item.category_ar === 'زهور' || item.category_ar === 'أحواض' || item.category_ar === 'أحواض/فازات') {
            // Keep 'أحواض' if it's just a pot? User said "Plants Small". 
            // Let's map Flowers -> Plants Small.
            // Pots -> Plants Small? Or keep Pots? 
            // Plan said: "Map Flowers/Pots to Plants Small".
            newCategory = 'نباتات صغيرة';
        }

        // Explicit tag overrides for Tables/Woods again to ensure they take precedence if they were trees/flowers (unlikely but possible)
        if (tags.some(t => t.includes('طاولة'))) {
            newCategory = 'طاولات';
        }

        return {
            ...item,
            category_ar: newCategory
        };
    });

    await fs.writeFile(jsonPath, JSON.stringify(updatedItems, null, 4), 'utf8');
    console.log('Migration complete.');
}

migrate().catch(console.error);
