import prisma from './config/database';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Running seed...');

  // Create demo company
  const company = await prisma.company.upsert({
    where: { name: 'MyERP Demo' },
    update: {},
    create: { name: 'MyERP Demo' },
  });

  // Create admin user
  const adminEmail = 'admin@myerp.local';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hashed = await bcrypt.hash('Test1234!', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashed,
        name: 'Admin Demo',
        role: 'ADMIN',
        companyId: company.id,
      },
    });
    console.log('Created admin user:', adminEmail);
  } else {
    console.log('Admin user already exists');
  }

  // Create default category
  const category = await prisma.category.upsert({
    where: { name_companyId: { name: 'General', companyId: company.id } },
    update: {},
    create: { name: 'General', companyId: company.id },
  });

  // Create sample product
  const sku = 'DEMO-001';
  await prisma.product.upsert({
    where: { sku_companyId: { sku, companyId: company.id } },
    update: {},
    create: {
      sku,
      name: 'Produto Demo',
      description: 'Produto de demonstração',
      costPrice: 10.0,
      salePrice: 15.0,
      minimumStock: 5,
      currentStock: 20,
      unit: 'UN',
      companyId: company.id,
      categoryId: category.id,
    },
  });

  console.log('Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
