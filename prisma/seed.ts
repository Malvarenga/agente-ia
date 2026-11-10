import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { sku: 'LAP-DELL-001', name: 'Dell Inspiron 14', brand: 'Dell', category: 'laptop', price: 650.00, stock: 3, description: 'Laptop ideal para desarrollo' },
      { sku: 'LAP-MAC-001', name: 'MacBook Pro M3', brand: 'Apple', category: 'laptop', price: 1599.00, stock: 0, description: 'Potencia extrema, agotada por ahora' },
      { sku: 'MON-DELL-001', name: 'Monitor Dell 27" 4K', brand: 'Dell', category: 'monitor', price: 320.00, stock: 5, description: 'Monitor curvo' },
      { sku: 'ACC-LOG-001', name: 'Mouse Logitech MX Master 3', brand: 'Logitech', category: 'accesorio', price: 99.00, stock: 12, description: 'Mouse ergonómico' }
    ],
    skipDuplicates: true,
  });
  console.log('✅ Base de datos poblada con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });