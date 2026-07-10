CREATE TABLE "profiles" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "stripe_customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"default_payment_method" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "stripe_customers_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"stripe_subscription_id" text NOT NULL,
	"price_id" text NOT NULL,
	"status" varchar(32) NOT NULL,
	"plan" varchar(32) NOT NULL,
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
