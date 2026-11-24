import { PrismaClient, RoleType, SellerStatus, BusinessType, ListingModerationStatus, ServiceDeliveryMode } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma Database Seeding for MAHILO...');

  const defaultPasswordHash = await bcrypt.hash('mahilo123', 10);

  // 1. Roles & Permissions
  const roleCustomer = await prisma.role.upsert({
    where: { name: RoleType.CUSTOMER },
    update: {},
    create: {
      name: RoleType.CUSTOMER,
      description: 'Browses, purchases physical products, and books services',
    },
  });

  const roleSeller = await prisma.role.upsert({
    where: { name: RoleType.SELLER },
    update: {},
    create: {
      name: RoleType.SELLER,
      description: 'Lists and manages products, services, inventory, and settlements',
    },
  });

  const roleAdmin = await prisma.role.upsert({
    where: { name: RoleType.ADMIN },
    update: {},
    create: {
      name: RoleType.ADMIN,
      description: 'Moderates listings, approves sellers, and sets commission rules',
    },
  });

  const roleSuperAdmin = await prisma.role.upsert({
    where: { name: RoleType.SUPER_ADMIN },
    update: {},
    create: {
      name: RoleType.SUPER_ADMIN,
      description: 'Full administrative access and platform configurations',
    },
  });

  // 2. Sample Users
  const userCustomer = await prisma.user.upsert({
    where: { phone: '9876543210' },
    update: {},
    create: {
      fullName: 'Ananya Sharma',
      phone: '9876543210',
      email: 'ananya@example.com',
      passwordHash: defaultPasswordHash,
      isActive: true,
      isPhoneVerified: true,
      isEmailVerified: true,
      userRoles: {
        create: [{ roleId: roleCustomer.id }],
      },
    },
  });

  const userSeller1 = await prisma.user.upsert({
    where: { phone: '9876543211' },
    update: {},
    create: {
      fullName: 'Priya Patel',
      phone: '9876543211',
      email: 'priya@example.com',
      passwordHash: defaultPasswordHash,
      isActive: true,
      isPhoneVerified: true,
      isEmailVerified: true,
      userRoles: {
        create: [{ roleId: roleCustomer.id }, { roleId: roleSeller.id }],
      },
    },
  });

  const userSeller2 = await prisma.user.upsert({
    where: { phone: '9876543212' },
    update: {},
    create: {
      fullName: 'Sunita Roy',
      phone: '9876543212',
      email: 'sunita@example.com',
      passwordHash: defaultPasswordHash,
      isActive: true,
      isPhoneVerified: true,
      isEmailVerified: true,
      userRoles: {
        create: [{ roleId: roleCustomer.id }, { roleId: roleSeller.id }],
      },
    },
  });

  const userAdmin = await prisma.user.upsert({
    where: { phone: '9876543200' },
    update: {},
    create: {
      fullName: 'Rajeshwari Iyer',
      phone: '9876543200',
      email: 'admin@mahilo.in',
      passwordHash: defaultPasswordHash,
      isActive: true,
      isPhoneVerified: true,
      isEmailVerified: true,
      userRoles: {
        create: [{ roleId: roleAdmin.id }, { roleId: roleSuperAdmin.id }],
      },
    },
  });

  // 3. Product Categories
  const catTerracotta = await prisma.productCategory.upsert({
    where: { slug: 'handicrafts-art' },
    update: {},
    create: {
      name: 'Handicrafts & Art',
      slug: 'handicrafts-art',
      description: 'Handmade terracotta, clay pottery, home decors',
    },
  });

  const catFashion = await prisma.productCategory.upsert({
    where: { slug: 'fashion-apparel' },
    update: {},
    create: {
      name: 'Fashion & Apparel',
      slug: 'fashion-apparel',
      description: 'Handloom sarees, kurtas, dupattas by women weavers',
    },
  });

  const catBeauty = await prisma.productCategory.upsert({
    where: { slug: 'beauty-personal-care' },
    update: {},
    create: {
      name: 'Beauty & Personal Care',
      slug: 'beauty-personal-care',
      description: 'Cold-pressed Ayurvedic face oils and herbal skincare',
    },
  });

  // 4. Service Categories
  const catSalon = await prisma.serviceCategory.upsert({
    where: { slug: 'beauty-salon' },
    update: {},
    create: {
      name: 'Beauty & Salon',
      slug: 'beauty-salon',
      description: 'Herbal facials, hair spa, and relaxing massages',
    },
  });

  const catBridal = await prisma.serviceCategory.upsert({
    where: { slug: 'makeup-bridal' },
    update: {},
    create: {
      name: 'Makeup & Bridal',
      slug: 'makeup-bridal',
      description: 'High-definition bridal makeup and bespoke saree draping',
    },
  });

  // 5. Commission Rules
  await prisma.commissionRule.createMany({
    data: [
      { vertical: 'PRODUCT', type: 'PERCENTAGE', value: 8.00, isActive: true },
      { vertical: 'SERVICE', type: 'PERCENTAGE', value: 10.00, isActive: true },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
