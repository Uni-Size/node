import { PrismaClient, Role } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const admin = await db.user.upsert({ where: { email: "admin@unisize.local" }, update: {}, create: { name: "관리자", email: "admin@unisize.local", role: Role.ADMIN } });
  const school = await db.school.upsert({ where: { name_year: { name: "서울중학교", year: 2027 } }, update: {}, create: { name: "서울중학교", year: 2027 } });
  const student = await db.student.findFirst({ where: { name: "김민준", schoolId: school.id } })
    ?? await db.student.create({ data: { name: "김민준", birthDate: new Date("2014-05-12"), gender: "남", admissionYear: 2027, admissionGrade: 1, guardianPhone: "010-1234-5678", schoolId: school.id } });
  const skus = [];
  for (const [name, size, stock] of [["동복 재킷", "100", 5], ["동복 셔츠", "95", 12], ["동복 바지", "76", 2]] as const) {
    const code = `SEOUL-${name}-${size}`;
    const existingSku = await db.sku.findUnique({ where: { code }, include: { product: true } });
    const product = existingSku?.product ?? await db.product.create({ data: { category: "학생복", itemType: name.split(" ")[1], basePattern: "기본", name } });
    const sku = existingSku ?? await db.sku.create({ data: { productId: product.id, code, size } });
    await db.inventory.upsert({ where: { skuId: sku.id }, update: {}, create: { skuId: sku.id, onHand: stock } });
    await db.schoolProduct.upsert({ where: { schoolId_productId: { schoolId: school.id, productId: product.id } }, update: {}, create: { schoolId: school.id, productId: product.id, price: 70000, isRequired: true } });
    skus.push(sku);
  }
  const order = await db.order.upsert({
    where: { orderNumber: "UN-20261104-001" },
    update: {},
    create: { orderNumber: "UN-20261104-001", studentId: student.id, status: "PREPARING", approvedAt: new Date() },
  });
  for (const [index, sku] of skus.entries()) {
    await db.orderItem.upsert({
      where: { orderId_skuId_fulfillment: { orderId: order.id, skuId: sku.id, fulfillment: "PICKUP" } },
      update: {},
      create: {
        orderId: order.id, skuId: sku.id, quantity: 1, unitPrice: 70000,
        allocation: "ALLOCATED",
        alteration: index === 2 ? "IN_PROGRESS" : "NOT_REQUIRED",
        preparedQty: index === 1 ? 1 : 0,
      },
    });
  }
  await db.auditLog.create({ data: { userId: admin.id, action: "SEED_CREATED", entityType: "School", entityId: school.id } });
  console.log(`Seeded ${student.name}`);
}
main().finally(() => db.$disconnect());
