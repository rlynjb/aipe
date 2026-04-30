import { listTemplates } from "../lib/templates.js";
export async function runList() {
    const items = listTemplates();
    const width = Math.max(...items.map((i) => i.type.length));
    console.log('\nAvailable spec types:\n');
    for (const item of items) {
        console.log(`  ${item.type.padEnd(width)}  ${item.description}`);
    }
    console.log(`\nUsage: aipe generate <type> "<intent>"\n`);
}
//# sourceMappingURL=list.js.map