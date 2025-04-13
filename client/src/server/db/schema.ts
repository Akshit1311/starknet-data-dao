import { sql } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";

export const nykaaOrders = pgTable(
	"nykaaOrders",
	(d) => ({
		id: d.serial().primaryKey(),
		brandIds: d.text().notNull(),
		brandNames: d.text().array().notNull(),
		categoryId: d.text().notNull(),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		imageUrl: d.text().notNull(),
		itemName: d.text().notNull(),
		itemQuantity: d.integer().notNull(),
		itemSku: d.text().notNull().unique(),
		itemStatus: d.text().notNull(),
		orderNo: d.text().notNull(),
		parentId: d.text().notNull(),
		productId: d.text().notNull(),
		productUrl: d.text().notNull(),
		unitPrice: d.integer().notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [
		index("product_sku_idx").on(t.itemSku),
		index("product_order_idx").on(t.orderNo),
		index("product_brand_idx").on(t.brandIds),
		index("product_id_idx").on(t.productId),
	],
);

export const NykaaOrdersSchema = createInsertSchema(nykaaOrders).omit({
	id: true,
	updatedAt: true,
	createdAt: true,
});

export const linkedinConnections = pgTable("linkedinConnections", (d) => ({
	id: d.serial().primaryKey(),
	updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	createdAt: d
		.timestamp({ withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	headline: d.text(),
	name: d.text(),
	pfp: d.text(),
	url: d.text().unique(),
}));

export const LinkedinConnectionsSchema = createInsertSchema(
	linkedinConnections,
).omit({
	id: true,
	updatedAt: true,
	createdAt: true,
});
