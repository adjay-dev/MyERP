import prisma from '../src/config/database';
import { hashPassword } from '../src/utils/password';

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Create a test company
    const company = await prisma.company.create({
      data: {
        name: 'Demo Company',
      },
    });

    console.log('✅ Company created:', company.name);

    // Create a test user (admin)
    const hashedPassword = await hashPassword('Admin@123');
    const user = await prisma.user.create({
      data: {
        email: 'admin@demo.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        companyId: company.id,
      },
    });

    console.log('✅ User created:', user.email);

    // Create test categories
    const electronics = await prisma.category.create({
      data: {
        name: 'Eletrônicos',
      },
    });

    const furniture = await prisma.category.create({
      data: {
        name: 'Móveis',
      },
    });

    console.log('✅ Categories created');

    // Create test products
    const product1 = await prisma.product.create({
      data: {
        sku: 'PROD-001',
        name: 'Laptop Dell XPS 13',
        description: 'Laptop de alta performance',
        barcode: '123456789',
        costPrice: 800,
        salePrice: 1200,
        minimumStock: 5,
        currentStock: 10,
        unit: 'UN',
        status: 'ACTIVE',
        categoryId: electronics.id,
        companyId: company.id,
      },
    });

    const product2 = await prisma.product.create({
      data: {
        sku: 'PROD-002',
        name: 'Mesa de Escritório',
        description: 'Mesa para escritório',
        barcode: '987654321',
        costPrice: 100,
        salePrice: 250,
        minimumStock: 3,
        currentStock: 8,
        unit: 'UN',
        status: 'ACTIVE',
        categoryId: furniture.id,
        companyId: company.id,
      },
    });

    console.log('✅ Products created');

    // Create test customers
    const customer1 = await prisma.customer.create({
      data: {
        name: 'João Silva',
        company: 'Empresa A',
        email: 'joao@empresa.com',
        phone: '+244923123456',
        address: 'Rua Principal, 123',
        city: 'Luanda',
        country: 'Angola',
        companyId: company.id,
      },
    });

    const customer2 = await prisma.customer.create({
      data: {
        name: 'Maria Santos',
        company: 'Empresa B',
        email: 'maria@empresa.com',
        phone: '+244923654321',
        address: 'Rua Secundária, 456',
        city: 'Luanda',
        country: 'Angola',
        companyId: company.id,
      },
    });

    console.log('✅ Customers created');

    // Create test supplier
    const supplier = await prisma.supplier.create({
      data: {
        name: 'Distribuidor ABC',
        company: 'ABC Distribuidora',
        email: 'contato@abc.com',
        phone: '+244912345678',
        address: 'Rua do Comércio, 789',
        companyId: company.id,
      },
    });

    console.log('✅ Supplier created');

    console.log('\n✨ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
