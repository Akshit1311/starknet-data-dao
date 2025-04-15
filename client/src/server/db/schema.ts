import { relations, sql } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", (d) => ({
	id: d.serial().primaryKey(),
	address: d.text().unique().notNull().$type<`0x${string}`>(),
	nickname: d.text(),
}));

export const nykaaOrders = pgTable(
	"nykaaOrders",
	(d) => ({
		id: d.serial().primaryKey(),
		brandIds: d.text(),
		brandNames: d.text().array(),
		categoryId: d.text(),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		imageUrl: d.text(),
		itemName: d.text(),
		itemQuantity: d.integer(),
		itemSku: d.text().unique(),
		itemStatus: d.text(),
		orderNo: d.text(),
		parentId: d.text(),
		productId: d.text(),
		productUrl: d.text(),
		unitPrice: d.integer(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
		userId: d
			.integer()
			.notNull()
			.references(() => users.id),
	}),
	(t) => [
		index("product_sku_idx").on(t.itemSku),
		index("product_order_idx").on(t.orderNo),
		index("product_brand_idx").on(t.brandIds),
		index("product_id_idx").on(t.productId),
	],
);

export const nykaaToUsersRelations = relations(nykaaOrders, ({ one }) => ({
	invitee: one(users, {
		fields: [nykaaOrders.userId],
		references: [users.id],
	}),
}));

export const NykaaOrdersSchema = createInsertSchema(nykaaOrders).omit({
	id: true,
	updatedAt: true,
	createdAt: true,
	userId: true,
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
	userId: d
		.integer()
		.notNull()
		.references(() => users.id),
}));

export const linkedinToUsersRelations = relations(
	linkedinConnections,
	({ one }) => ({
		invitee: one(users, {
			fields: [linkedinConnections.userId],
			references: [users.id],
		}),
	}),
);

export const LinkedinConnectionsSchema = createInsertSchema(
	linkedinConnections,
).omit({
	id: true,
	updatedAt: true,
	createdAt: true,
	userId: true,
});

export const zomatoOrders = pgTable("zomatoOrders", (d) => ({
	id: d.serial().primaryKey(),
	updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	createdAt: d
		.timestamp({ withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	dishString: d.text(),
	// orderId: d.bigint({ mode: "bigint" }),
	restaurantURL: d.text(),
	totalCost: d.text(),
	userId: d
		.integer()
		.notNull()
		.references(() => users.id),
}));

export const zomatoToUsersRelations = relations(zomatoOrders, ({ one }) => ({
	invitee: one(users, {
		fields: [zomatoOrders.userId],
		references: [users.id],
	}),
}));

export const ZomatoOrdersSchema = createInsertSchema(zomatoOrders).omit({
	id: true,
	updatedAt: true,
	createdAt: true,
	userId: true,
});

export const uberPastTrips = pgTable("uberPastTrips", (d) => ({
	id: d.serial().primaryKey(),
	updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	createdAt: d
		.timestamp({ withTimezone: true })
		.default(sql`CURRENT_TIMESTAMP`),
	beginTripTime: d.text(),
	dropoffTime: d.text(),
	fare: d.text(),
	pickupAddress: d.text(),
	vehicleType: d.text(),
	userId: d
		.integer()
		.notNull()
		.references(() => users.id),
}));

export const uberToUsersRelations = relations(uberPastTrips, ({ one }) => ({
	invitee: one(users, {
		fields: [uberPastTrips.userId],
		references: [users.id],
	}),
}));

export const UberPastTripsSchema = createInsertSchema(uberPastTrips).omit({
	id: true,
	updatedAt: true,
	createdAt: true,
	userId: true,
});
