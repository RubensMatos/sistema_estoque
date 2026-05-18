"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, clearSession, requireUser } from "@/lib/auth";
import { parseMoneyInput } from "@/lib/currency";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerUserAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return;

  const { name, email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });
  await createSession(user.id);
  redirect("/");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return;

  await createSession(user.id);
  redirect("/");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

export async function createClientAction(formData: FormData) {
  await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!name || !email || !phone) return;

  await prisma.client.create({ data: { name, email, phone } });
  revalidatePath("/clientes");
  revalidatePath("/vendas");
}

export async function updateClientAction(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!id || !name || !email || !phone) return;

  await prisma.client.update({
    where: { id },
    data: { name, email, phone },
  });

  revalidatePath("/clientes");
  revalidatePath("/vendas");
}

export async function createProductAction(formData: FormData) {
  await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "0").trim();
  const price = parseMoneyInput(priceRaw);
  if (!name || !Number.isFinite(price) || price <= 0) return;

  await prisma.product.create({
    data: {
      name,
      price,
      stockItem: {
        create: { quantity: 0 },
      },
    },
  });
  revalidatePath("/produtos");
  revalidatePath("/estoque");
  revalidatePath("/vendas");
}

export async function updateProductAction(formData: FormData) {
  await requireUser();
  const id = Number(formData.get("id") ?? 0);
  const name = String(formData.get("name") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "0").trim();
  const price = parseMoneyInput(priceRaw);
  if (!id || !name || !Number.isFinite(price) || price <= 0) return;

  await prisma.product.update({
    where: { id },
    data: { name, price },
  });

  revalidatePath("/produtos");
  revalidatePath("/estoque");
  revalidatePath("/vendas");
}

export async function adjustStockAction(formData: FormData) {
  await requireUser();
  const productId = Number(formData.get("productId") ?? 0);
  const quantity = Number(formData.get("quantity") ?? 0);
  if (!productId || !Number.isInteger(quantity) || quantity < 0) return;

  await prisma.stockItem.upsert({
    where: { productId },
    update: { quantity },
    create: { productId, quantity },
  });

  revalidatePath("/estoque");
  revalidatePath("/vendas");
}

export async function createSaleAction(formData: FormData) {
  const user = await requireUser();
  const clientId = Number(formData.get("clientId") ?? 0);
  if (!clientId) return;

  const products = await prisma.product.findMany({
    include: { stockItem: true },
    orderBy: { name: "asc" },
  });

  const submittedProductIds = formData.getAll("productId").map((v) => Number(v));
  const submittedQuantities = formData.getAll("quantity").map((v) => Number(v));

  let selected = [] as Array<{ product: (typeof products)[number]; qty: number }>;

  if (submittedProductIds.length > 0 && submittedProductIds.length === submittedQuantities.length) {
    selected = submittedProductIds
      .map((id, index) => {
        const product = products.find((p) => p.id === id);
        const qty = submittedQuantities[index];
        return product ? { product, qty } : null;
      })
      .filter((row): row is { product: (typeof products)[number]; qty: number } => !!row)
      .filter((row) => Number.isInteger(row.qty) && row.qty > 0);
  } else {
    selected = products
      .map((product) => {
        const raw = formData.get(`qty_${product.id}`);
        const qty = Number(raw ?? 0);
        return { product, qty };
      })
      .filter((row) => Number.isInteger(row.qty) && row.qty > 0);
  }

  if (selected.length === 0) return;

  await prisma.$transaction(async (tx) => {
    let total = 0;

    for (const row of selected) {
      const stock = await tx.stockItem.findUnique({ where: { productId: row.product.id } });
      const currentQty = stock?.quantity ?? 0;
      if (currentQty < row.qty) {
        throw new Error(`Estoque insuficiente para ${row.product.name}`);
      }
      total += Number(row.product.price) * row.qty;
    }

    const sale = await tx.sale.create({
      data: {
        clientId,
        userId: user.id,
        total,
      },
    });

    for (const row of selected) {
      const unitPrice = Number(row.product.price);
      await tx.saleItem.create({
        data: {
          saleId: sale.id,
          productId: row.product.id,
          quantity: row.qty,
          unitPrice,
          totalPrice: unitPrice * row.qty,
        },
      });

      await tx.stockItem.update({
        where: { productId: row.product.id },
        data: { quantity: { decrement: row.qty } },
      });
    }
  });

  revalidatePath("/estoque");
  revalidatePath("/vendas");
}
